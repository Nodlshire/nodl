'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface WasmBundle {
    id: string;
    name: string;
    size: string;
    timestamp: string;
}

export interface Job {
    id: string;
    name: string;
    tier: string;
    status: 'Running' | 'Completed' | 'Queued';
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
    bundles: WasmBundle[];
    jobs: Job[];
    addBundle: (file: File) => void;
    addJob: (job: Omit<Job, 'id' | 'date' | 'status'>) => void;
    deleteBundle: (id: string) => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export function JobsProvider({ children }: { children: ReactNode }) {
    const [bundles, setBundles] = useState<WasmBundle[]>([
        { id: 'WASM-001', name: 'genomic_calc_v2.wasm', size: '2.4 MB', timestamp: '2026-03-28 10:12' },
        { id: 'WASM-002', name: 'raytrace_kernel_v4.wasm', size: '1.8 MB', timestamp: '2026-03-27 14:45' },
    ]);

    const [jobs, setJobs] = useState<Job[]>([
        { 
            id: 'JOB-9921', 
            name: 'LLM BATCH INFERENCE',
            tier: 'Standard', 
            status: 'Completed', 
            date: '2026-03-27 14:22',
            cost: '$1.42',
            uptime: '12h 44m',
            result: 'Success // Hash Integrity Verified',
            compute_used: '744.2 GigaFLOPs',
            energy_saved: '1.2 kWh',
            cpu_cores: 16,
            ram_gb: 32,
            gpu_model: 'T4 GPU'
        },
        { 
            id: 'JOB-9918', 
            name: 'GENOMIC ALIGNMENT',
            tier: 'Boost', 
            status: 'Running', 
            date: '2026-03-29 08:30',
            cost: '$0.88',
            uptime: '4h 12m',
            result: 'Processing...',
            compute_used: '2,105.8 GigaFLOPs',
            energy_saved: '0.4 kWh',
            cpu_cores: 32,
            ram_gb: 64,
            gpu_model: 'RTX 4090'
        },
    ]);

    const addBundle = (file: File) => {
        const newBundle: WasmBundle = {
            id: `WASM-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            timestamp: new Date().toLocaleString()
        };
        setBundles(prev => [newBundle, ...prev]);
    };

    const addJob = (job: Omit<Job, 'id' | 'date' | 'status'>) => {
        const newJob: Job = {
            ...job,
            id: `JOB-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            date: new Date().toLocaleString(),
            status: 'Queued'
        };
        setJobs(prev => [newJob, ...prev]);
    };

    const deleteBundle = (id: string) => {
        setBundles(prev => prev.filter(b => b.id !== id));
    };

    return (
        <JobsContext.Provider value={{ 
            bundles, 
            jobs, 
            addBundle, 
            addJob,
            deleteBundle
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
