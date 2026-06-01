import React, { useEffect, useState } from "react";
import FounderInviteModal from "../../components/modals/FounderInviteModal";

export default function FounderSlots() {
    const [slots, setSlots] = useState<Record<string, string>>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [activeSlot, setActiveSlot] = useState<number | null>(null);

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            const res = await fetch("/api/v1/admin/founder/slots");
            if (res.ok) {
                const data = await res.json();
                setSlots(data);
            }
        } catch (err) {
            console.error("Failed to fetch founder slots", err);
        }
    };

    const handleInvite = (slotNum: number) => {
        setActiveSlot(slotNum);
        setModalOpen(true);
    };

    return (
        <section className="bg-black/40 border border-white/10 rounded-xl p-6 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight text-white mb-2 font-display">Founder Slots</h2>
                <p className="text-sm text-white/50 max-w-2xl">
                    The 4 authoritative governance slots. Stephen occupies Slot 1. Other slots are available for invitation. 
                    Inviting a Founder assigns them to the slot natively during their signup process.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((slot) => {
                    const filledBy = slots[String(slot)];
                    const isFilled = !!filledBy;

                    return (
                        <div key={slot} className="flex flex-col p-4 bg-white/5 border border-white/10 rounded-lg relative overflow-hidden transition-all hover:bg-white/10">
                            {isFilled && <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />}
                            {!isFilled && <div className="absolute top-0 left-0 w-1 h-full bg-white/10" />}
                            
                            <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Slot {slot}</div>
                            <div className="text-sm font-medium text-white mb-4">
                                {isFilled ? (
                                    <span className="text-amber-400 font-mono text-xs">{filledBy}</span>
                                ) : (
                                    <span className="text-white/30 italic">Empty</span>
                                )}
                            </div>

                            <div className="mt-auto">
                                {!isFilled ? (
                                    <button 
                                        onClick={() => handleInvite(slot)}
                                        className="w-full py-1.5 text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded transition-colors"
                                    >
                                        INVITE FOUNDER
                                    </button>
                                ) : (
                                    <button disabled className="w-full py-1.5 text-xs font-semibold bg-white/5 text-white/30 border border-white/5 rounded cursor-not-allowed">
                                        FILLED
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <FounderInviteModal 
                open={modalOpen} 
                onClose={() => setModalOpen(false)} 
                slot={activeSlot} 
            />
        </section>
    );
}
