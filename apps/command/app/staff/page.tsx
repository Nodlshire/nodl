"use client";

import { useState, useEffect } from "react";
import { Shield, Users, UserPlus, MoreVertical, Search, Filter, ShieldCheck, ShieldAlert, BadgeCheck, Zap, Activity, Mail, Trash2, Ban, CheckCircle, RefreshCw, X, ChevronRight, Lock } from "lucide-react";
import { usePageTitle } from "../components/PageTitleContext";
import IdentityHeader from "@shared/components/IdentityHeader";
import DetailPanel from "../components/DetailPanel";
import { motion, AnimatePresence } from "framer-motion";

const ROLE_COLORS: Record<string, string> = {
    'owner': 'text-[#22D3EE] bg-[#22D3EE]/10 border-[#22D3EE]/20',
    'management': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    'customer_service': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    'visitor': 'text-white/40 bg-white/[0.01] border-wnode-border-separator',
};

const ROLE_ICONS: Record<string, any> = {
    'owner': BadgeCheck,
    'management': ShieldAlert,
    'customer_service': Users,
    'visitor': Search,
};

const STATUS_COLORS: Record<string, string> = {
    'active': 'bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.5)]',
    'suspended': 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
    'invited': 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
};

export default function StaffManagementPage() {
    usePageTitle("Personnel Governance", "Define and manage personnel roles and system access permissions.");
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    // New User Form State
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'visitor' });

    const fetchStaff = async () => {
        try {
            const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
            const res = await fetch('/api/v1/governance/users', {
                headers: { 'Authorization': `Bearer ${jwt}` },
                cache: 'no-store'
            });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setStaff(data);
                } else {
                    console.error("Expected array from personnel API, got:", data);
                    setStaff([]);
                }
            } else {
                setStaff([]);
            }
        } catch (err) {
            console.error("Failed to fetch personnel:", err);
            setStaff([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
            const res = await fetch('/api/v1/governance/invite', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify(newUser)
            });
            if (res.ok) {
                setIsAddModalOpen(false);
                setNewUser({ name: '', email: '', role: 'visitor' });
                fetchStaff();
            }
        } catch (err) {
            console.error("Failed to invite user:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
            const res = await fetch(`/api/v1/governance/users/${id}/status`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setActiveDropdown(null);
                fetchStaff();
                if (selectedUser?.id === id) {
                    setSelectedUser({ ...selectedUser, status });
                }
            }
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const handleResendInvite = async (user: any) => {
        setIsSubmitting(true);
        try {
            const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
            const res = await fetch(`/api/v1/governance/users/${user.id}/resend-invite`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${jwt}` }
            });
            if (res.ok) {
                alert(`Invitation resent to ${user.email}`);
                setActiveDropdown(null);
            } else {
                const data = await res.json();
                alert(`Error: ${data.error || 'Failed to resend invite'}`);
            }
        } catch (err) {
            console.error("Failed to resend invite:", err);
            alert("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async (user: any) => {
        try {
            const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
            const res = await fetch(`/api/v1/governance/users/${user.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${jwt}` }
            });
            if (res.ok) {
                setConfirmDeleteId(null);
                setActiveDropdown(null);
                fetchStaff();
                if (selectedUser?.id === user.id) {
                    setSelectedUser(null);
                }
            } else {
                const data = await res.json();
                alert(`Error: ${data.error || 'Failed to remove user'}`);
                setConfirmDeleteId(null);
            }
        } catch (err) {
            console.error("Failed to delete user:", err);
            alert("An unexpected error occurred during user removal.");
            setConfirmDeleteId(null);
        }
    };

    const filteredStaff = staff.filter(member => 
        (member.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (member.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (member.role?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <main className="flex-1 p-8 overflow-y-auto pb-24 relative space-y-10 focus:outline-none">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white/[0.01] border border-wnode-border-separator p-4 rounded-[5px]">
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                        <div className="relative group flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#22D3EE] transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search by name, identity, or role..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/[0.03] border border-wnode-border-neutral rounded-[5px] pl-10 pr-4 py-2 text-[13px] focus:outline-none focus:border-[#22D3EE]/50 w-full transition-all"
                            />
                        </div>
                        <button className="px-4 py-2 bg-white/[0.03] border border-wnode-border-neutral rounded-[5px] text-[13px] font-normal text-white/60 hover:text-white transition-all flex items-center gap-2">
                            <Filter className="w-4 h-4 text-white/40" /> Filter Roles
                        </button>
                    </div>

                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#22D3EE] hover:bg-[#22D3EE]/80 text-black px-6 py-2 rounded-[5px] text-[12px] font-bold flex items-center gap-2 transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    >
                        <UserPlus className="w-4 h-4" /> Add user account
                    </button>
                </div>

                    <div className="card-sovereign overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.04] text-[12px] text-white/60 uppercase-none border-b border-wnode-border-neutral">
                                <tr>
                                    <th className="px-8 py-5 font-normal">Operator Name</th>
                                    <th className="px-6 py-5 font-normal">Access Level</th>
                                    <th className="px-6 py-5 font-normal">Network Status</th>
                                    <th className="px-8 py-5 font-normal text-left">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="text-[14px] text-white/80 divide-y divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan={4} className="px-8 py-12 text-center text-white/40">Retrieving personnel security records...</td></tr>
                                    ) : filteredStaff.map((member) => {
                                        const Icon = ROLE_ICONS[member.role] || Users;
                                        return (
                                            <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group relative">
                                                <td className="px-8 py-6">
                                                    <div 
                                                        onClick={() => setSelectedUser(member)}
                                                        className="flex items-center gap-4 cursor-pointer"
                                                    >
                                                        <div className="w-10 h-10 rounded-[5px] bg-white/5 border border-wnode-border-neutral flex items-center justify-center text-white/40 group-hover:border-[#22D3EE]/30 transition-colors">
                                                            {member.name ? member.name.charAt(0).toUpperCase() : (member.email ? member.email.charAt(0).toUpperCase() : '?')}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[14px] font-normal text-white group-hover:text-[#22D3EE] transition-colors">{member.name || 'Anonymous Operator'}</span>
                                                            <span className="text-[12px] font-normal text-white/40 font-mono tracking-tighter">{member.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 font-mono">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-[5px] border text-[11px] font-bold ${ROLE_COLORS[member.role] || ROLE_COLORS['visitor']}`}>
                                                        <Icon className="w-3.5 h-3.5" />
                                                        {member.role.toUpperCase()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[member.status] || 'bg-slate-700'}`} />
                                                        <span className="text-[12px] font-bold text-white/60 tracking-widest uppercase">{member.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-left relative">
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveDropdown(activeDropdown === member.id ? null : member.id);
                                                                setConfirmDeleteId(null);
                                                            }}
                                                            className="p-1.5 text-white hover:bg-white/10 transition-all bg-white/[0.05] border border-wnode-border-neutral rounded-[5px] flex items-center justify-center transition-all group"
                                                        >
                                                            <MoreVertical className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                        </button>

                                                        {activeDropdown === member.id && (
                                                            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-48 bg-[#0A0A0B] border border-wnode-border-neutral rounded-[5px] shadow-2xl z-[100] p-1 animate-in fade-in slide-in-from-right-2 duration-200">
                                                                {member.status === 'suspended' ? (
                                                                    <button 
                                                                        onClick={() => handleUpdateStatus(member.id, 'active')}
                                                                        className="w-full text-left px-3 py-2 text-[12px] text-emerald-400 hover:bg-emerald-400/5 rounded transition-colors flex items-center gap-2"
                                                                    >
                                                                        <CheckCircle className="w-3.5 h-3.5" /> Reinstate Access
                                                                    </button>
                                                                ) : (
                                                                    <button 
                                                                        onClick={() => handleUpdateStatus(member.id, 'suspended')}
                                                                        className="w-full text-left px-3 py-2 text-[12px] text-red-400 hover:bg-red-400/5 rounded transition-colors flex items-center gap-2"
                                                                    >
                                                                        <Ban className="w-3.5 h-3.5" /> Suspend Access
                                                                    </button>
                                                                )}
                                                                {member.status === 'invited' && (
                                                                    <button className="w-full text-left px-3 py-2 text-[12px] text-amber-400 hover:bg-amber-400/5 rounded transition-colors flex items-center gap-2">
                                                                        <RefreshCw className="w-3.5 h-3.5" /> Resend Invite
                                                                    </button>
                                                                )}
                                                                {member.status === 'invited' && (
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleResendInvite(member);
                                                                        }}
                                                                        className="w-full text-left px-3 py-2 text-[12px] text-white/40 hover:bg-white/5 hover:text-white rounded transition-colors flex items-center gap-2"
                                                                    >
                                                                        <Mail className="w-3.5 h-3.5" /> Resend Invite
                                                                    </button>
                                                                )}

                                                                <div className="h-px bg-white/5 my-1" />
                                                                <button 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (confirmDeleteId === member.id) {
                                                                            handleDeleteUser(member);
                                                                        } else {
                                                                            setConfirmDeleteId(member.id);
                                                                        }
                                                                    }}
                                                                    className={`w-full text-left px-3 py-2 text-[12px] rounded transition-all flex items-center gap-2 ${
                                                                        confirmDeleteId === member.id 
                                                                        ? 'bg-red-500 text-white font-bold animate-pulse' 
                                                                        : 'text-white/40 hover:bg-red-500/10 hover:text-red-400'
                                                                    }`}
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" /> 
                                                                    {confirmDeleteId === member.id ? 'Click Again to Confirm' : 'Remove User'}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-10 text-[12px] font-normal text-white/40">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 opacity-50" />
                            Command RBAC: Active
                        </div>
                    </div>
                </main>

            {/* DETAIL PANEL */}
            <DetailPanel
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                title={selectedUser?.name || 'User Details'}
                subtitle={selectedUser?.role}
            >
                <div className="space-y-8">
                    <div className="bg-white/[0.02] border border-wnode-border-separator p-6 rounded-[5px]">
                        <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Command Identity</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] text-white/60">Canonical Email</span>
                                <span className="text-[13px] text-white font-mono">{selectedUser?.email}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] text-white/60">Account Status</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[selectedUser?.status]}`} />
                                    <span className="text-[12px] text-white uppercase tracking-widest">{selectedUser?.status}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] text-white/60">Operational Level</span>
                                <span className={`text-[12px] font-bold px-2 py-0.5 rounded border ${ROLE_COLORS[selectedUser?.role]}`}>{selectedUser?.role?.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-wnode-border-separator p-6 rounded-[5px]">
                        <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">Access Governance</h4>
                        <div className="space-y-4">
                            <button 
                                onClick={() => handleUpdateStatus(selectedUser?.id, selectedUser?.status === 'suspended' ? 'active' : 'suspended')}
                                className={`w-full py-3 rounded-[5px] text-[12px] font-bold uppercase tracking-widest transition-all ${
                                    selectedUser?.status === 'suspended' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                                    : 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
                                }`}
                            >
                                {selectedUser?.status === 'suspended' ? 'Restore Full Access' : 'Suspend All Privileges'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-black/40 border border-wnode-border-separator p-6 rounded-[5px] flex items-center gap-4">
                        <Lock className="w-5 h-5 text-white/40" />
                        <div>
                            <p className="text-[13px] text-white/80">RBAC Enforcement active.</p>
                            <p className="text-[11px] text-white/40">Administrative changes are logged to the platform audit trace.</p>
                        </div>
                    </div>
                </div>
            </DetailPanel>


            {/* ADD USER MODAL */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md bg-[#0A0A0B] border border-wnode-border-neutral rounded-[5px] shadow-2xl p-10 relative"
                        >
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-2">Add user account</h2>
                                <p className="text-[12px] text-white/40">The user will receive an email to set their password.</p>
                            </div>

                            <form onSubmit={handleAddUser} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Full Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                        className="w-full bg-black/50 border border-wnode-border-neutral rounded-[5px] px-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all font-normal"
                                        placeholder="James Carter"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Email Address</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                        className="w-full bg-black/50 border border-wnode-border-neutral rounded-[5px] px-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all font-normal"
                                        placeholder="james@wnode.one"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Access Level</label>
                                    <select 
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                        className="w-full bg-black/50 border border-wnode-border-neutral rounded-[5px] px-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all font-normal appearance-none"
                                    >
                                        <option value="management">Manager</option>
                                        <option value="customer_service">Customer Service</option>
                                        <option value="visitor">Visitor (Read-only)</option>
                                    </select>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-[#22D3EE] hover:bg-[#22D3EE]/80 text-black rounded-[5px] text-[12px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Mail className="w-4 h-4" /> Send Secure Invite</>}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
