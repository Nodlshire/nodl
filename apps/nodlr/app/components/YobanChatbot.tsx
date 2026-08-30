'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles, Shield, Cpu, Share2, HelpCircle, ChevronRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'yoban' | 'user';
  text: string;
  timestamp: string;
  sources?: string[];
}

// Complete Enterprise Ingested Single Source of Truth (SOT) Documentation Corpus (v1.5.0-enterprise)
const SOT_DOCS_KNOWLEDGE = [
  {
    topic: 'security_stride',
    keywords: ['stride', 'threat', 'threat model', 'security', 'attack', 'mitigation', 'soc 2', 'iso 27001', 'key', 'kms'],
    source: 'security.md — Section 1 & 2 (STRIDE Threat Model & Compliance)',
    response: `**Wnode Enterprise Security Envelope & Threat Model** (\`v1.5.0-enterprise\`):\n\n• **STRIDE Threat Matrix**: Formally mitigates Spoofing (Ed25519 key-pair challenges), Tampering (Merkle tree hashes), Repudiation (append-only SOT ledgers), Info Disclosure (hardware enclaves SEV/TDX), DoS (token bucket rate limits), and Elevation of Privilege (Firecracker microVM isolation).\n• **Compliance Posture**: SOC 2 Type II & ISO 27001 readiness mapping with automated continuous audit logging for all SOT mutations (\`/api/v1/system/pulse\`).\n• **Key Lifecycle**: Ed25519 key-pairs generated in TPM 2.0 enclaves with 90-day automatic rotation and 500ms emergency revocation slashing.`
  },
  {
    topic: 'developer_api_sdks',
    keywords: ['api', 'sdk', 'openapi', 'grpc', 'error', 'err_', 'rate limit', 'idempotency', 'python', 'go', 'typescript'],
    source: 'developer-api.md — Section 1-4 (OpenAPI, SDKs & Error Catalog)',
    response: `**Enterprise Developer API & Multi-Language SDKs**:\n\n• **OpenAPI 3.1 & gRPC Specs**: Production endpoints hosted at \`https://api.wnode.one\` and local SOT on port 8080.\n• **Idempotency & Rate Limits**: 1,000 req/min per WUID with \`X-Idempotency-Key: <UUIDv4>\` header support for deterministic state mutations.\n• **SDKs**: First-party Go (\`wnode-sdk-go\`), TypeScript (\`@wnode/sdk\`), and Python (\`wnode\`) clients.\n• **Error Catalog**: Strict RFC 7807 problem details (\`ERR_WUID_INVALID\`, \`ERR_PLACEMENT_EXISTS\`, \`ERR_SOT_SYNC_TIMEOUT\`).`
  },
  {
    topic: 'operations_runbooks',
    keywords: ['runbook', 'ops', 'incident', 'alert', 'slo', 'sla', 'failover', 'rollback', 'monitoring', 'threshold'],
    source: 'operations-runbooks.md — Section 1-4 (Operations & Disaster Recovery)',
    response: `**Production Operations & Incident Response Runbooks**:\n\n• **SLO / SLA Commitments**: 99.95% API uptime, < 45ms SOT sync latency (p95), and < 15 minute MTTR for Sev-1 incidents.\n• **Alert Thresholds**: Automated triggers when CPU > 85% for 3 mins, p95 SOT latency > 250ms, or HTTP 5xx errors > 3.0%.\n• **Disaster Recovery**: Zero-downtime rollback protocols and active-passive multi-region failover from primary \`192.168.1.140\` to secondary replica \`192.168.1.141\` (< 500ms WAL replication lag).`
  },
  {
    topic: 'operator_hardware',
    keywords: ['hardware', 'tier', 'matrix', 'firecracker', 'gvisor', 'multi-tenancy', 'isolation', 'gpu', 'h100', 'rtx 4090'],
    source: 'operator-hardware.md — Section 1-3 (Hardware Certification & Sandboxing)',
    response: `**Operator Hardware Certification & Multi-Tenancy Matrix**:\n\n• **Tier 1 Enterprise GPU**: 8x NVIDIA H100/A100 (1.50x yield factor) for LLM fine-tuning.\n• **Tier 2 Workstation**: RTX 4090 / 3090 (1.00x yield factor) for 3D rendering & computer vision.\n• **Tier 3 Edge Gateway**: 8-core ARM/x86 CPU (0.75x yield factor) for DeWi packet telemetry.\n• **Sandboxing**: Firecracker microVM hypervisors + gVisor syscall isolation + isolated WireGuard VLANs.`
  },
  {
    topic: 'affiliate_invite',
    keywords: ['invite', 'affiliate', 'modal', 'link', 'qr', 'qr code', 'share', 'whatsapp', 'telegram'],
    source: 'affiliates.md — Section 1 & 2',
    response: `In Nodlr, clicking "+ Add Affiliate" opens the canonical **Affiliate Invite Modal**.\n\n• **Universal Invite Link**: Generates a shareable URL (\`https://nodlr.wnode.one/invite?code=<WUID>\`) containing your verified inviter WUID. Functions 100% reliably from any device or location, even offline.\n• **Dynamic Scannable QR Code**: Scannable by any mobile camera to launch the signup flow with your inviter WUID prefilled and locked.\n• **One-Tap Share**: Direct triggers for WhatsApp, Telegram, SMS, and Email.\n• **Explainer**: Includes a link to the 20-second Affiliate Viral Growth Engine Explainer.`
  },
  {
    topic: 'placement_rules',
    keywords: ['placement', 'vge', 'rules', 'sot', 'founder', 'round-robin', 'lock', 'wuid', 'l1', 'l2', 'downline'],
    source: 'affiliates.md — Section 3 & 4 (Affiliate VGE Placement Rules)',
    response: `**Affiliate VGE Placement Rules** enforce Single Source of Truth (SOT) downline placement:\n\n1. **Invite Link Signup**: Inviter WUID is automatically locked (\`readOnly\`). The user is assigned directly to your L1 downline.\n2. **Direct Signup (No Link)**: Users select manual WUID entry or **Founder Round-Robin Placement** (\`100001-0426-01-AA\` through \`100004-0426-04-AA\` in rotation).\n3. **SOT Database Write**: Placements write atomically to \`/api/v1/affiliates/placement\` in the Go backend on port 8080.\n4. **CMD Synchronization**: Placements immediately reflect across CMD (\`cmd.wnode.one\`) and Nodlr dashboards.`
  },
  {
    topic: 'depin_compute',
    keywords: ['depin', 'compute', 'hardware', 'gpu', 'cpu', 'mesh', 'workload', 'idle', 'carbon'],
    source: 'Wnode Architecture Spec — DePIN Compute',
    response: `**DePIN (Decentralized Physical Infrastructure Networks) Compute**:\n\nWnode connects idle consumer and enterprise hardware into a sovereign compute mesh network. Node operators run the Nodlr software agent to process distributed AI workloads, graphics rendering, and data verification, earning automated daily yields while offsetting carbon through localized compute allocation.`
  },
  {
    topic: 'dewi_infrastructure',
    keywords: ['dewi', 'telecom', 'wireless', 'spectrum', 'mesh', 'gateway', 'wifi', 'cellular'],
    source: 'Wnode Architecture Spec — DeWi Hybrid Infrastructure',
    response: `**DeWi Hybrid Infrastructure** combines decentralized wireless telemetry with sovereign mesh networking. Nodes operate as local spectrum gateways, routing encrypted traffic across peer-to-peer Wi-Fi and cellular backhauls to maintain low-latency network connectivity without centralized telecommunication intermediaries.`
  },
  {
    topic: 'adrs_governance',
    keywords: ['adr', 'decision', 'architecture decision', 'changelog', 'release', 'glossary', 'v1.4.0'],
    source: 'adrs/ADR-001 & changelog.md (Architecture Governance & Release Notes)',
    response: `**Architecture Governance & ADRs** (\`v1.5.0-enterprise\`):\n\n• **ADR-001**: Selected Go for SOT Core on port 8080 due to sub-10ms latency, static binary compilation, and goroutine concurrency (< 30MB idle RAM footprint).\n• **ADR-002**: Mandated Firecracker VMM hypervisor sandboxing for compute job multi-tenancy.\n• **Changelog**: Release v1.5.0-enterprise published complete security envelope, developer SDKs, incident runbooks, and operator hardware matrices.`
  }
];

export default function YobanChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'yoban',
      text: "I’m Yoban, your Wnode assistant. How can I help you with DePIN compute, DeWi infrastructure, node onboarding, our affiliate growth engine, or anything else?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerQ = query.toLowerCase();
      let matchedDoc = SOT_DOCS_KNOWLEDGE.find((doc) =>
        doc.keywords.some((kw) => lowerQ.includes(kw))
      );

      let responseText = '';
      let sourceTag = '';

      if (matchedDoc) {
        responseText = matchedDoc.response;
        sourceTag = matchedDoc.source;
      } else {
        responseText = `I’m Yoban, your Wnode assistant. All my answers are strictly grounded in Wnode's canonical enterprise documentation (\`v1.5.0-enterprise\`).\n\nCould you clarify if your question relates to:\n• **STRIDE Threat Model & Security Envelope**\n• **Developer OpenAPI 3.1 & SDKs** (Go, TS, Python)\n• **Production Operations & Failover Runbooks**\n• **Operator Hardware Certification Matrix**\n• **Affiliate VGE Placement Rules**?`;
        sourceTag = 'Wnode Enterprise Documentation Canon';
      }

      const botMsg: ChatMessage = {
        id: `yob-${Date.now()}`,
        sender: 'yoban',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [sourceTag]
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Bottom-Right Floating Trigger Icon (Photorealistic Avatar, Bigger Size) */}
      <div className="fixed bottom-6 right-6 z-50 font-sans">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-3 bg-[#0E0E10] border border-[#00FFB2]/50 p-3 pr-5 rounded-full shadow-[0_0_30px_rgba(0,255,178,0.25)] hover:shadow-[0_0_40px_rgba(0,255,178,0.45)] transition-all cursor-pointer group"
            >
              {/* Photorealistic Larger Avatar Container (w-14 h-14) */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#00FFB2]/80 shrink-0 shadow-lg">
                <img
                  src="/yoban-avatar.jpg"
                  alt="Yoban — Wnode Assistant"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Status Badge Pulse */}
              <div className="absolute -top-0.5 right-2 w-4 h-4 bg-[#00FFB2] border-2 border-[#0E0E10] rounded-full shadow-[0_0_10px_#00FFB2]" />

              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white tracking-tight">Yoban</span>
                  <span className="text-[10px] font-mono bg-[#00FFB2]/20 text-[#00FFB2] px-2 py-0.5 rounded border border-[#00FFB2]/40 font-semibold">SOT AI</span>
                </div>
                <span className="text-xs text-slate-400 block font-normal">Wnode Assistant</span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Minimal Desktop/Mobile Chat Window (Positioned on the Right) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-[360px] sm:w-[400px] h-[540px] max-h-[85vh] bg-[#0E0E10] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50"
            >
              {/* Window Header */}
              <div className="p-4 bg-gradient-to-r from-[#141417] to-[#0E0E10] border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#00FFB2]/60 shrink-0">
                    <img src="/yoban-avatar.jpg" alt="Yoban" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white tracking-tight">Yoban</h4>
                      <span className="text-[9px] font-mono text-[#00FFB2] bg-[#00FFB2]/10 px-1.5 py-0.5 rounded border border-[#00FFB2]/30">v1.5.0-enterprise</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">Canonical Enterprise Assistant</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Display Area */}
              <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {msg.sender === 'yoban' ? 'Yoban' : 'You'}
                      </span>
                      <span className="text-[9px] font-mono text-slate-600">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[85%] p-3 rounded-xl whitespace-pre-wrap leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#00FFB2] text-black font-medium rounded-br-none shadow-[0_0_15px_rgba(0,255,178,0.2)]'
                          : 'bg-white/[0.03] border border-white/[0.08] text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-1 flex items-center gap-1 text-[9px] text-[#00FFB2] font-mono">
                        <Shield className="w-3 h-3" />
                        <span>SOT: {msg.sources[0]}</span>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                    <span className="w-2 h-2 rounded-full bg-[#00FFB2] animate-ping" />
                    <span>Yoban is retrieving documentation...</span>
                  </div>
                )}
              </div>

              {/* Suggested Quick Topics */}
              <div className="px-4 py-2 border-t border-white/[0.04] bg-black/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => handleSendMessage('What is the STRIDE threat model?')}
                  className="px-2.5 py-1 bg-white/[0.03] hover:bg-[#00FFB2]/10 border border-white/[0.08] hover:border-[#00FFB2]/30 text-slate-300 hover:text-[#00FFB2] rounded-full text-[10px] whitespace-nowrap transition-colors"
                >
                  STRIDE Threat Model
                </button>
                <button
                  onClick={() => handleSendMessage('Show me OpenAPI and SDK specs')}
                  className="px-2.5 py-1 bg-white/[0.03] hover:bg-[#00FFB2]/10 border border-white/[0.08] hover:border-[#00FFB2]/30 text-slate-300 hover:text-[#00FFB2] rounded-full text-[10px] whitespace-nowrap transition-colors"
                >
                  OpenAPI & SDKs
                </button>
                <button
                  onClick={() => handleSendMessage('What are the production runbooks and SLOs?')}
                  className="px-2.5 py-1 bg-white/[0.03] hover:bg-[#00FFB2]/10 border border-white/[0.08] hover:border-[#00FFB2]/30 text-slate-300 hover:text-[#00FFB2] rounded-full text-[10px] whitespace-nowrap transition-colors"
                >
                  Ops Runbooks & SLOs
                </button>
              </div>

              {/* Input Form Footer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-[#0E0E10] border-t border-white/[0.08] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask Yoban about security, OpenAPI, SLOs..."
                  className="flex-1 bg-black/60 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00FFB2]/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim()}
                  className="p-2 bg-[#00FFB2] hover:bg-[#00e6a0] disabled:opacity-40 disabled:hover:bg-[#00FFB2] text-black rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-black" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
