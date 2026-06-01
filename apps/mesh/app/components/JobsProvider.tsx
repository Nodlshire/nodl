'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { splitAndSubmit } from '../lib/splitAndSubmit';

export interface JobBundle {
    id: string;
    name: string;
    size: string;
    timestamp: string;
}

export interface Job {
    id: string;
    name: string;
    tier: string;
    status: 'Running' | 'Completed' | 'Queued' | 'Pending' | 'Assigned' | 'Failed' | 'Expired';
    date: string;
    cost: string;
    // Drawer details
    uptime?: string;
    result?: string;
    compute_used?: string;
    energy_saved?: string;
    cpu_cores?: number;
    ram_gb?: number;
    gpu_model?: string;
}

interface JobsContextType {
    bundles: JobBundle[];
    jobs: Job[];
    submitJob: (file: File, metadata: { budget: number, targetCycles: number }) => Promise<{ id: string, result: string }>;
    deleteBundle: (id: string) => void;
    refreshJobs: () => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

const API_BASE = '/api/v1';

export function JobsProvider({ children }: { children: ReactNode }) {
    const [bundles, setBundles] = useState<JobBundle[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);

    const fetchJobs = useCallback(async () => {
        try {
            // Check for user session to avoid 401 polling spam
            const email = typeof window !== 'undefined' ? localStorage.getItem('nodl_user_email') : null;
            if (!email) return;

            const resp = await fetch(`${API_BASE}/jobs`);
            if (!resp.ok) return;
            const data = await resp.json();
            
            // Map backend Job model to frontend Job interface
            const mappedJobs: Job[] = data.map((j: any) => ({
                id: j.id,
                name: j.name || `JOB-${j.id.slice(0,4).toUpperCase()}`,
                tier: j.tier || 'Standard',
                status: j.status.charAt(0).toUpperCase() + j.status.slice(1),
                date: new Date(j.createdAt).toLocaleString(),
                cost: `$${(j.budget || 0).toFixed(2)}`,
                cpu_cores: j.cpu_cores || 16,
                ram_gb: j.ram_gb || 32,
                gpu_model: j.gpu_model || 'T4 GPU',
                result: j.status === 'complete' ? 'Success // Verified' : undefined
            }));
            
            setJobs(mappedJobs);
        } catch (err) {
            console.error('Failed to fetch jobs:', err);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [fetchJobs]);

    const submitJob = async (file: File, metadata: { budget: number, targetCycles: number }) => {
        // Delegate to automated splitting and aggregation utility
        const unifiedResult = await splitAndSubmit(file, metadata, API_BASE);
        
        // For the UI, we represent this as a single virtual job bundle
        const virtualId = `JOB-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
        
        // Add to local bundles for UI storage view
        const newBundle: JobBundle = {
            id: virtualId,
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            timestamp: new Date().toLocaleString()
        };
        setBundles(prev => [newBundle, ...prev]);

        fetchJobs();
        return { id: virtualId, result: unifiedResult };
    };

    const deleteBundle = (id: string) => {
        setBundles(prev => prev.filter(b => b.id !== id));
    };

    return (
        <JobsContext.Provider value={{ 
            bundles, 
            jobs, 
            submitJob, 
            deleteBundle,
            refreshJobs: fetchJobs
        }}>
            {children}
        </JobsContext.Provider>
    );
}

export function useJobs() {
    const context = useContext(JobsContext);
    if (context === undefined) {
        throw new Error('useJobs must be used within a JobsProvider');
    }
    return context;
}

