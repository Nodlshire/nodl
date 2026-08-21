import AppLayout from "../../../components/layout/AppLayout";

export default function FoundersNotePage() {
    return (
        <AppLayout>
            <div className="relative pt-40 pb-24 px-8">
                <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-full border-2 border-blue-500/50 shadow-xl shrink-0">
                                <img 
                                    src="/founder.jpg" 
                                    alt="Stephen Soos" 
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase leading-none">Founder's Bio & Note</h1>
                                <p className="text-blue-500 font-bold uppercase tracking-widest text-xs mt-2">Stephen Soos - Founder</p>
                            </div>
                        </div>

                        {/* Centralized Planet Image */}
                        <div className="flex justify-center mb-16">
                            <div className="relative w-full max-w-2xl aspect-square md:aspect-video overflow-hidden rounded-3xl border border-white/5 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                                <img 
                                    src="/planet.png" 
                                    alt="The Mesh Planet" 
                                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                            </div>
                        </div>

                        <div className="space-y-8 text-slate-300 text-lg md:text-xl leading-relaxed font-light">
                            <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tighter border-b border-white/10 pb-4">BIO - Stephen Soos</h2>
                            <p>
                                Stephen Soos is the founder, architect, and developer of Wnode, a sovereign, zero-trust compute network built from almost nothing. After four years living through the war in Ukraine, enduring blackouts, freezing winters, and martial law, Stephen relocated to Hungary with only what fitted in his car. With no capital, no team, and sleeping on a sofa, he built the entire Wnode MVP on a Lenovo M700 “potato,” a re-engineered Dell T1500, and a stack of broken laptops he revived by hand.
                            </p>
                            <p>
                                A lifelong systems architect, Stephen has spent decades building early ecommerce platforms, cloud-connected print systems, medical hardware, and full-stack ecosystems that scaled to seven-figure revenues and public listings. His mission now is singular: connect billions of existing devices into a global compute layer that reduces e-waste, eliminates unnecessary datacenters, and gives everyday people a meaningful income stream in the emerging compute economy.
                            </p>
                            <p>
                                Wnode is the culmination of a lifetime of building, and the belief that decentralisation should serve everyone, not just hyperscalers.
                            </p>

                            <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tighter border-b border-white/10 pb-4 pt-12">Founders Note</h2>
                            <p>
                                You’ve probably felt it, the shift, a tension, a quiet knowing that something fundamental is changing. 
                                We’re entering a new era of human experience where the old structures no longer serve us, and the 
                                familiar ways of creating value are dissolving beneath our feet.
                            </p>
                            
                            <p>
                                As AI and robotics take over the mundane, we’re being pushed to redefine meaning, ownership, and opportunity. 
                                The frontrunners in AI all agree on one thing: <span className="text-white font-medium">compute is the new currency.</span>
                            </p>

                            <p>
                                Those who control it will hold the keys to the vault. And so the race is on for more concrete, more cooling towers, 
                                more mega‑centres rising from the earth. I can almost hear the Mother Earth weeping under the weight of it.
                            </p>

                            <p>
                                But the future doesn’t need more scars in the ground or more water‑hungry monoliths. The future is already humming 
                                around us and it is a quiet, ubiquitous planetary hum, a living orchestration of compute that is unused, 
                                unconnected, and spectacularly powerful.
                            </p>

                            <p>
                                Wnode is the conductor that turns that hum into harmony without uprooting a single acacia tree or evicting 
                                a single creature. Not a bee displaced, not a mole disturbed. Every phone, every EV, every robot, every smart TV, 
                                every IoT device, every server, old or new, is part of a global fabric of compute that is astonishingly vast and wildly underused.
                            </p>

                            <p>
                                Wnode Mesh isn’t a data centre, a satellite array, or some crypto‑bro hypervisor. It is the connection and 
                                harmonisation of that planetary hum into a living, breathing orchestration of compute that dwarfs the combined 
                                power of the corporate incumbents, and it’s already in your pocket, your home, your office, your car, even the fields.
                            </p>

                            <p className="pt-8 text-white font-medium text-2xl border-t border-white/10">
                                My vision is simple: connect what already exists, empower everyone to participate, and stop wasting the devices 
                                we’ve already paid for with our money and our planet’s resources.
                            </p>

                            <p>
                                Wnode transforms everyday hardware into income‑generating nodes, giving people real economic agency while 
                                reducing the ecological cost of compute. No more digging. No more water‑hungry cooling. No more landfill cycles.
                            </p>

                            <p>
                                A truly democratic, community‑owned mesh that is governed by its participants, operated with institutional 
                                stability, and accessible to anyone with a device. This planetary compute layer will power applications we 
                                can’t yet imagine, create revenue streams for millions, and shift control away from centralised giants into 
                                the hands of the people who actually power the network.
                            </p>
                        </div>
                    </div>
                </div>
        </AppLayout>
    );
}
