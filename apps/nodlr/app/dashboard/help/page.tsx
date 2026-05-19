'use client';

import React, { useState } from 'react';
import { HelpCircle, LayoutDashboard, Cpu, DollarSign, Users, Settings, ChevronDown, ChevronRight, Zap, Mail, ExternalLink, Shield, CreditCard, Server, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpSection {
    id: string;
    icon: React.ElementType;
    iconColor: string;
    title: string;
    subtitle: string;
    items: { question: string; answer: string }[];
}

const HELP_SECTIONS: HelpSection[] = [
    {
        id: 'overview',
        icon: LayoutDashboard,
        iconColor: 'text-[#22d3ee]',
        title: 'Overview',
        subtitle: 'Your dashboard home screen',
        items: [
            {
                question: 'What is the Overview page?',
                answer: 'The Overview is your at-a-glance command centre. It shows your total earnings, affiliate yield, global rank, and the number of active nodes you have on the network. Below that you will find your Fleet Map showing the geographic location of all your nodes, a list of your active infrastructure, and real-time resource allocation meters.'
            },
            {
                question: 'What does Initialize Fleet do?',
                answer: 'The Initialize Fleet button activates your nodes on the Wnode mesh network. Once active, your hardware begins accepting and processing distributed compute jobs. You will see the Processor and Graphics allocation meters animate in real time as work is dispatched to your machines. Press Deactivate Node to pause participation.'
            },
            {
                question: 'What is the Impact Card?',
                answer: 'The Impact Card shows your environmental contribution. Every compute job your nodes process offsets carbon by keeping workloads on efficient distributed infrastructure rather than centralised data centres. It displays carbon saved (kg), equivalent km of driving avoided, and tree-days of offset generated.'
            },
            {
                question: 'What does Global Rank mean?',
                answer: 'Your Global Rank reflects your standing among all Nodlrs on the network. It is calculated from a combination of your total earnings, uptime, node count, and affiliate network size. A lower number means a higher rank.'
            },
        ],
    },
    {
        id: 'nodes',
        icon: Cpu,
        iconColor: 'text-[#a855f7]',
        title: 'Nodes',
        subtitle: 'Managing your hardware',
        items: [
            {
                question: 'How do I add a new node?',
                answer: 'Click the "+ Add Node" button in the top bar of any page. This opens the Add Machine modal where you can register a new device by entering its name and specifications. Once registered, the node will appear in your Nodes list and on the Fleet Map.'
            },
            {
                question: 'What are the node statuses?',
                answer: 'Each node has one of three statuses:\n\n• Active — The node is online, connected to the mesh, and processing jobs.\n• Suspended — You have manually paused this node. It will not accept new jobs but remains registered.\n• Offline — The node has lost connectivity. Check the device is powered on and connected to the internet.'
            },
            {
                question: 'Can I pause or remove a node?',
                answer: 'Yes. On the Nodes page, each device has a Pause button (to temporarily suspend it) and a Remove button (the bin icon) to deregister it from the network entirely. Pausing is reversible — removing is permanent and the node must be re-registered.'
            },
            {
                question: 'What specifications are shown?',
                answer: 'Each node card displays the CPU model and core count, GPU model and VRAM, total system RAM, cumulative uptime since registration, and the last time the node checked in with the mesh coordinator.'
            },
        ],
    },
    {
        id: 'money',
        icon: DollarSign,
        iconColor: 'text-[#10b981]',
        title: 'Money',
        subtitle: 'Earnings, payouts, and your ledger',
        items: [
            {
                question: 'How do I earn money?',
                answer: 'You earn through the Wnode Sovereign Economic Protocol. For every compute job processed, the revenue is split atomically: 70% to the Nodlr (Operator), 10% to the Sales Source (Affiliate), and the remainder across Lineage and Protocol tiers (3/7/3/7 split). This ensures deterministic, constitutional payouts for every participant.'
            },
            {
                question: 'When are payouts made?',
                answer: 'Funds are settled every 24 hours automatically. The settlement is processed via the secure mesh payment layer and deposited into your connected Stripe account. The Wnode system verifies ledger synchronization every 10 minutes to ensure institutional integrity.'
            },
            {
                question: 'How do I connect Stripe?',
                answer: 'Go to Settings → Earnings & Payouts to configure your Stripe Connect account. Once verified, all payouts are routed automatically. You can also view your Stripe verification status on the Money page under Payout Management.'
            },
            {
                question: 'What is the Summary Ledger?',
                answer: 'The Summary Ledger shows your aggregated revenue across four timeframes: Last 24 Hours, Last Week, Last Month, and Last Year. Use the Status Verification tool to audit the connection between your local ledger and the global payout network.'
            },
            {
                question: 'Can I export my financial data?',
                answer: 'Yes. Click the "Export CSV" button at the top of the Money page to download a complete record of your earnings and settlements. This is useful for accounting and tax purposes.'
            },
        ],
    },
    {
        id: 'affiliates',
        icon: Users,
        iconColor: 'text-[#3b82f6]',
        title: 'Affiliates',
        subtitle: 'Your referral network',
        items: [
            {
                question: 'How does the affiliate programme work?',
                answer: 'When you invite someone to join Wnode using your personal invite link, you become the "Sales Source" for their account. This entitles you to a 10% commission on all revenue generated by their hardware.\n\nYour lineage also generates returns: you earn 3% for Level 1 (direct) referrals and 7% for Level 2 referrals. This is hard-wired into the mesh protocol to ensure permanent payout integrity.'
            },
            {
                question: 'How do I invite someone?',
                answer: 'There are two ways:\n\n1. Click the blue "+ Add Affiliate" button in the top bar. This opens your email client with a pre-written invitation containing your personal invite link.\n\n2. On the Affiliates page, click the Invite Link box at the bottom to copy your link to the clipboard. You can then paste it in any messaging app or social media.'
            },
            {
                question: 'What information can I see about my affiliates?',
                answer: 'For L1 affiliates, click any row in the Affiliate Network table to open the detail drawer. This shows their full contact details (name, email, phone), the number and type of nodes they are running, uptime, and their financial contribution to your earnings. You can email them directly using the Message button.\n\nL2 affiliate details are more limited as they were not directly invited by you.'
            },
            {
                question: 'What is My Earnings on the Affiliates page?',
                answer: 'This is the total commission you have earned from your lineage. It is the sum of your 10% Sales Source commission plus your 3%/7% referral overrides. This figure is settled daily alongside your hardware yield.'
            },
        ],
    },
    {
        id: 'sales',
        icon: TrendingUp,
        iconColor: 'text-[#ffff00]',
        title: 'Mesh Sales',
        subtitle: 'Ambassador Intelligence Suite',
        items: [
            {
                question: 'What is Ambassador Intelligence?',
                answer: 'Ambassador Intelligence is a specialized diagnostic suite designed to maximize your mesh yield. It provides deep visibility into your network performance via the Revenue Matrix and allows for strategic planning using the Yield Simulator.'
            },
            {
                question: 'How does the Yield Simulator work?',
                answer: 'The Yield Simulator allows you to project monthly revenue by adjusting your anticipated mesh client growth and hardware contribution. It uses real-time network pricing and the 70/10 split protocol to provide accurate financial forecasts for your business.'
            },
            {
                question: 'What is the Revenue Matrix?',
                answer: 'The Revenue Matrix tracks your economic performance in real time. It monitors three key metrics:\n\n• Earned Sales — Your realized 10% Sales Source commission.\n• Missed Potential — Revenue lost due to unlinked accounts in your network.\n• Capture Efficiency — A percentage score measuring how effectively you are converting network potential into earnings.'
            },
            {
                question: 'What is Capture Efficiency?',
                answer: 'Capture Efficiency (CE) measures your network health. A high CE score indicates that your affiliates have correctly linked their Stripe accounts and that your hardware is maintaining consistent uptime. If your CE is low, the Ambassador Intelligence suite will provide specific tasks to improve it.'
            },
        ],
    },
    {
        id: 'settings',
        icon: Settings,
        iconColor: 'text-[#f59e0b]',
        title: 'Settings',
        subtitle: 'Identity, network, payouts, and security',
        items: [
            {
                question: 'What can I configure in Settings?',
                answer: 'Settings is divided into four tabs:\n\n• My Profile — Edit your display name, business name, bio, contact email, and phone number. View your read-only account identifiers (Protocol ID, Net ID, User ID).\n\n• Network & Registry — View your node count, active nodes, network status, architecture, registry entry, protocol version, and capability flags.\n\n• Earnings & Payouts — See your current balance, pending payouts, commission rate, and configure your Stripe payout address. View recent payout history.\n\n• Security & Auth — Toggle multi-factor authentication, change your password, view your permissions, and manage notification preferences (email, SMS, push).'
            },
            {
                question: 'How do I change my profile photo?',
                answer: 'Click on your avatar photo in the top-right corner of any page, or go to Settings and click "Change Photo" next to your Protocol ID. Select an image file from your device and it will be uploaded immediately.'
            },
            {
                question: 'What is my Protocol ID?',
                answer: 'Your Protocol ID (e.g. 100001-0426-01-AA) is your unique, permanent identifier on the Wnode network. It is assigned when your account is created and cannot be changed. It is used for affiliate tracking, node ownership, payment routing, and network authentication.'
            },
            {
                question: 'How do I enable two-factor authentication?',
                answer: 'Go to Settings → Security & Auth and toggle the "MFA Enabled" switch. Multi-factor authentication adds a step-up verification layer to your login process, protecting your account and earnings from unauthorised access.'
            },
        ],
    },
    {
        id: 'getting-started',
        icon: Zap,
        iconColor: 'text-[#f472b6]',
        title: 'Getting Started',
        subtitle: 'New to Wnode? Start here',
        items: [
            {
                question: 'What is Wnode?',
                answer: 'Wnode is a distributed compute mesh that lets you earn money by sharing your unused hardware resources. Your computers, servers, and GPUs process workloads for the network and you get paid in return. The more hardware you contribute and the more people you invite, the more you earn.'
            },
            {
                question: 'How do I get started?',
                answer: 'Follow these steps:\n\n1. Add your first node — Click "+ Add Node" in the top bar and register your device.\n2. Initialize your fleet — Go to Overview and click "Initialize Fleet" to start accepting jobs.\n3. Connect Stripe — Go to Settings → Earnings & Payouts and link your Stripe account so you can receive payouts.\n4. Invite friends — Use the "+ Add Affiliate" button to send invitations and build your affiliate network.'
            },
            {
                question: 'Is my hardware safe?',
                answer: 'Yes. Wnode uses a sandboxed WebAssembly (WASM) runtime to execute compute jobs. Your personal files, data, and system are completely isolated from any network workload. The mesh only uses the compute resources you allocate.'
            },
            {
                question: 'How much can I earn?',
                answer: 'Earnings depend on your hardware specifications, uptime, and affiliate network. More powerful GPUs and CPUs generate higher yields. Maintaining consistent uptime and building an active affiliate network can significantly increase your passive income. All earnings are settled daily into your Stripe account.'
            },
        ],
    },
];

export default function HelpPage() {
    const [expandedSection, setExpandedSection] = useState<string>('getting-started');
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const toggleSection = (id: string) => {
        setExpandedSection(expandedSection === id ? '' : id);
        setExpandedItem(null);
    };

    const toggleItem = (key: string) => {
        setExpandedItem(expandedItem === key ? null : key);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-normal tracking-tight text-white mb-1.5">Help Centre</h1>
                    <p className="text-16px text-slate-400 font-normal">Everything you need to know about your Nodlr Dashboard</p>
                </div>
                <a
                    href="mailto:support@wnode.one?subject=Nodlr%20Dashboard%20Support%20Request"
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-[5px] border border-white/10 text-sm font-normal transition-all"
                >
                    <Mail className="w-4 h-4" />
                    Contact Support
                </a>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {HELP_SECTIONS.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => toggleSection(section.id)}
                        className={`surface-card p-4 flex items-center gap-3 text-left transition-all hover:border-white/20 ${expandedSection === section.id ? 'border-white/20 bg-white/[0.04]' : ''}`}
                    >
                        <section.icon className={`w-4 h-4 ${section.iconColor} shrink-0`} />
                        <div>
                            <span className="text-sm font-normal text-white block">{section.title}</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">{section.subtitle}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* FAQ Sections */}
            <div className="space-y-3">
                {HELP_SECTIONS.map((section) => (
                    <div key={section.id} className="surface-card overflow-hidden">
                        {/* Section Header */}
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <section.icon className={`w-4.5 h-4.5 ${section.iconColor}`} />
                                <div className="text-left">
                                    <h3 className="text-base font-normal text-white tracking-tight">{section.title}</h3>
                                    <p className="text-[11px] text-slate-500 font-normal">{section.subtitle}</p>
                                </div>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${expandedSection === section.id ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Section Content */}
                        <AnimatePresence>
                            {expandedSection === section.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="border-t border-white/5">
                                        {section.items.map((item, idx) => {
                                            const itemKey = `${section.id}-${idx}`;
                                            const isOpen = expandedItem === itemKey;
                                            return (
                                                <div key={itemKey} className="border-b border-white/5 last:border-b-0">
                                                    <button
                                                        onClick={() => toggleItem(itemKey)}
                                                        className="w-full px-8 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-all"
                                                    >
                                                        <span className={`text-sm font-normal ${isOpen ? 'text-white' : 'text-slate-400'} transition-colors`}>
                                                            {item.question}
                                                        </span>
                                                        <ChevronRight className={`w-3.5 h-3.5 text-slate-600 shrink-0 ml-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                                                    </button>
                                                    <AnimatePresence>
                                                        {isOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.15 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-8 pb-5 pt-1">
                                                                    <p className="text-sm text-slate-400 font-normal leading-relaxed whitespace-pre-line">
                                                                        {item.answer}
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="surface-card p-8 flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-normal text-white mb-1">Still need help?</h4>
                    <p className="text-[11px] text-slate-500 font-normal">Our team typically responds within 24 hours</p>
                </div>
                <a
                    href="mailto:support@wnode.one?subject=Nodlr%20Dashboard%20Support%20Request"
                    className="flex items-center gap-2 bg-[#9333ea] hover:bg-[#a855f7] text-white px-6 py-3 rounded-[5px] text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg"
                >
                    <Mail className="w-4 h-4" />
                    Email Support
                </a>
            </div>
        </div>
    );
}
