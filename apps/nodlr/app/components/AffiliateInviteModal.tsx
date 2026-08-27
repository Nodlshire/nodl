'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, Users, QrCode, MessageSquare, Send, Mail, Smartphone, Globe, ShieldCheck, Play, ExternalLink } from 'lucide-react';

interface AffiliateInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userWUID?: string;
}

export default function AffiliateInviteModal({ isOpen, onClose, userWUID }: AffiliateInviteModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const wuid = userWUID || '100001-0426-01-AA';
  const inviteUrl = `https://nodlr.wnode.one/invite?code=${wuid}`;
  const shareText = encodeURIComponent(`Join my sovereign node fleet network on Nodlr: ${inviteUrl}`);

  // Dynamic real scannable QR code URL
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteUrl)}&color=00ffb2&bgcolor=0e0e10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window: Canonical Deep Graphite (#0E0E10) with 1px border rgba(255,255,255,0.08) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#0E0E10] border border-white/[0.08] rounded-2xl p-6 shadow-2xl z-10 space-y-5 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#00FFB2]/10 border border-[#00FFB2]/30 rounded-xl text-[#00FFB2]">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white tracking-tight">Affiliate Invite</h3>
                <p className="text-xs text-slate-400 font-normal">Universal shareable referral link (Device & Location Independent)</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* WUID Identifier Card */}
          <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-xl flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider block mb-0.5">Verified Inviter WUID</span>
              <span className="text-base font-mono font-semibold text-[#00FFB2] tracking-tight">{wuid}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#00FFB2]/10 border border-[#00FFB2]/30 rounded-md text-xs font-semibold text-[#00FFB2]">
              <Users className="w-3.5 h-3.5" />
              L1 Direct Override
            </div>
          </div>

          {/* Shareable Link Box */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs text-slate-300 font-semibold block">Universal Shareable Link</label>
              <button
                type="button"
                onClick={() => setShowQR(!showQR)}
                className="text-xs text-[#00FFB2] hover:underline flex items-center gap-1 font-medium transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" />
                {showQR ? 'Hide QR Code' : 'Show Dynamic QR Code'}
              </button>
            </div>

            <div className="flex items-center gap-2 bg-black/60 border border-white/[0.08] p-2.5 rounded-xl">
              <Globe className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="w-full bg-transparent text-sm text-slate-200 font-mono focus:outline-none px-1 select-all truncate"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-[#00FFB2] hover:bg-[#00e6a0] text-black text-xs font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 shadow-md hover:shadow-[0_0_20px_rgba(0,255,178,0.4)] active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-black" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Real Scannable Dynamic QR Code Block */}
          <AnimatePresence>
            {showQR && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-b from-[#141417] to-[#0E0E10] border border-white/[0.08] p-4 rounded-xl flex flex-col items-center justify-center space-y-3"
              >
                <div className="p-3 bg-[#0E0E10] border border-[#00FFB2]/30 rounded-xl shadow-[0_0_25px_rgba(0,255,178,0.15)] flex flex-col items-center">
                  <img
                    src={qrCodeImageUrl}
                    alt="Nodlr Affiliate Invite QR Code"
                    className="w-40 h-40 rounded-lg"
                  />
                </div>
                <div className="text-center space-y-1">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider block">Scan with mobile camera</span>
                  <span className="text-[11px] font-mono text-[#00FFB2] block">{inviteUrl}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Sharing Channels */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Share Anywhere</span>
            <div className="grid grid-cols-4 gap-2">
              <a
                href={`https://wa.me/?text=${shareText}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white/[0.02] hover:bg-[#00FFB2]/10 border border-white/[0.08] hover:border-[#00FFB2]/30 rounded-xl flex flex-col items-center gap-1 transition-all text-xs font-medium text-slate-300 hover:text-[#00FFB2]"
              >
                <MessageSquare className="w-4 h-4 text-[#00FFB2]" />
                WhatsApp
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent('Join my Nodlr fleet network')}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white/[0.02] hover:bg-[#00FFB2]/10 border border-white/[0.08] hover:border-[#00FFB2]/30 rounded-xl flex flex-col items-center gap-1 transition-all text-xs font-medium text-slate-300 hover:text-[#00FFB2]"
              >
                <Send className="w-4 h-4 text-[#00FFB2]" />
                Telegram
              </a>

              <a
                href={`sms:?body=${shareText}`}
                className="p-2.5 bg-white/[0.02] hover:bg-[#00FFB2]/10 border border-white/[0.08] hover:border-[#00FFB2]/30 rounded-xl flex flex-col items-center gap-1 transition-all text-xs font-medium text-slate-300 hover:text-[#00FFB2]"
              >
                <Smartphone className="w-4 h-4 text-[#00FFB2]" />
                SMS
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent('Invitation to Nodlr Sovereign Network')}&body=${shareText}`}
                className="p-2.5 bg-white/[0.02] hover:bg-[#00FFB2]/10 border border-white/[0.08] hover:border-[#00FFB2]/30 rounded-xl flex flex-col items-center gap-1 transition-all text-xs font-medium text-slate-300 hover:text-[#00FFB2]"
              >
                <Mail className="w-4 h-4 text-[#00FFB2]" />
                Email
              </a>
            </div>
          </div>

          {/* Modal Section Label: Affiliate VGE Placement Rules */}
          <div className="bg-[#00FFB2]/10 border border-[#00FFB2]/20 p-3.5 rounded-xl space-y-1">
            <h4 className="text-xs font-semibold text-[#00FFB2] tracking-wide uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Affiliate VGE Placement Rules
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              When an invitee completes signup via this link, their inviter field will automatically lock to your WUID (<span className="font-mono font-semibold text-[#00FFB2]">{wuid}</span>). They will be placed directly into your L1 downline tree in the SOT database and immediately reflected across CMD and Nodlr fleet metrics.
            </p>
          </div>

          {/* Stand-Out Explainer Banner (Bottom of Modal) */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#00FFB2]/15 via-[#22d3ee]/10 to-[#9333ea]/15 border border-[#00FFB2]/40 rounded-xl p-4 shadow-[0_0_25px_rgba(0,255,178,0.15)] flex items-center justify-between gap-3 group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#00FFB2] animate-ping" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Affiliate Viral Growth Engine Explainer
                </h4>
              </div>
              <p className="text-xs text-slate-300">
                Interactive 20-second architecture breakdown & referral payout flow.
              </p>
            </div>

            <a
              href="/vge-explainer.html"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[#00FFB2] hover:bg-[#00e6a0] text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shrink-0 shadow-lg hover:shadow-[0_0_20px_rgba(0,255,178,0.5)] active:scale-95 no-underline"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              Watch Explainer
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end pt-1 border-t border-white/[0.08]">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
