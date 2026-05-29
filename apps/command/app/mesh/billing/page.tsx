"use client";

import { useState, useEffect } from "react";

interface BillingLedger {
    jobId: string;
    customerId: string;
    stripeInvoiceId: string;
    totalCost: number;
    totalCostCents: number;
    timestamp: string;
}

export default function BillingDashboard() {
    const [history, setHistory] = useState<BillingLedger[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Customer state
    const [email, setEmail] = useState("");
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [isAttaching, setIsAttaching] = useState(false);

    useEffect(() => {
        // Check for cached customer
        const cached = localStorage.getItem("wnode_stripe_customer");
        if (cached) {
            setCustomerId(cached);
        }
        fetchHistory();
        const interval = setInterval(fetchHistory, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch("/api/v1/billing/history");
            if (res.ok) {
                setHistory(await res.json() || []);
            }
        } catch (err) {
            console.error("Failed to fetch billing history", err);
        } finally {
            setLoading(false);
        }
    };

    const attachCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        
        setIsAttaching(true);
        try {
            const res = await fetch("/api/v1/billing/customer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            if (res.ok) {
                const data = await res.json();
                setCustomerId(data.customerId);
                localStorage.setItem("wnode_stripe_customer", data.customerId);
                setEmail("");
            }
        } catch (err) {
            console.error("Failed to attach customer", err);
        } finally {
            setIsAttaching(false);
        }
    };

    const clearCustomer = () => {
        localStorage.removeItem("wnode_stripe_customer");
        setCustomerId(null);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Billing & Invoicing</h1>
                <p className="text-zinc-400">Manage Stripe customers, track job ledger costs, and review finalized invoices.</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
                <h2 className="text-lg font-bold text-white mb-4">Active Billing Account</h2>
                
                {customerId ? (
                    <div className="flex items-center justify-between bg-zinc-900 p-4 rounded border border-zinc-800">
                        <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Stripe Customer ID</p>
                            <p className="font-mono text-emerald-400 font-bold">{customerId}</p>
                            <p className="text-xs text-zinc-400 mt-2">Any mock jobs submitted will automatically be billed to this Stripe Customer via the API.</p>
                        </div>
                        <button 
                            onClick={clearCustomer}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded text-sm font-bold transition-colors"
                        >
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <form onSubmit={attachCustomer} className="flex gap-4 items-end">
                        <div className="flex-1 max-w-md">
                            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Customer Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="client@example.com"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                required
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isAttaching || !email}
                            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-zinc-800 text-white font-bold rounded transition-colors h-[42px]"
                        >
                            {isAttaching ? "Attaching..." : "Create Stripe Customer"}
                        </button>
                    </form>
                )}
            </div>

            <div>
                <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2 mb-6">Network Billing Ledger</h2>
                
                {loading && <div className="text-zinc-500 italic">Synchronizing ledger...</div>}
                
                {!loading && history.length === 0 && (
                    <div className="text-center p-12 border border-zinc-800 rounded bg-zinc-900/50 text-zinc-500 italic">
                        No billed jobs recorded on the ledger.
                    </div>
                )}

                {!loading && history.length > 0 && (
                    <div className="overflow-x-auto border border-zinc-800 rounded-lg">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Timestamp</th>
                                    <th className="px-6 py-4 font-medium">Job ID</th>
                                    <th className="px-6 py-4 font-medium">Customer ID</th>
                                    <th className="px-6 py-4 font-medium">Total Cost</th>
                                    <th className="px-6 py-4 font-medium">Stripe Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800 bg-zinc-950">
                                {history.map((entry, idx) => (
                                    <tr key={idx} className="hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-zinc-400">
                                            {new Date(entry.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-zinc-300">
                                            {entry.jobId.substring(0,18)}...
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-indigo-400">
                                            {entry.customerId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-emerald-400 font-mono font-bold">
                                            ${(entry.totalCostCents / 100).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">
                                                {entry.stripeInvoiceId}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
