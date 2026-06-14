"use client";

import React, { useEffect, useRef, useState } from "react";
import { Globe, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

const SIM_MACHINES = [
    {
        id: "sim-lon-01",
        displayName: "London Edge #1",
        latitude: 51.5074,
        longitude: -0.1278,
        status: "active",
        provider: "Nodlr Sim",
        isSim: true
    },
    {
        id: "sim-par-02",
        displayName: "Paris Core #1",
        latitude: 48.8566,
        longitude: 2.3522,
        status: "active",
        provider: "Nodlr Sim",
        isSim: true
    },
    {
        id: "sim-ber-03",
        displayName: "Berlin Relay #1",
        latitude: 52.5200,
        longitude: 13.4050,
        status: "active",
        provider: "Nodlr Sim",
        isSim: true
    },
    {
        id: "sim-nyc-04",
        displayName: "NYC Hub #1",
        latitude: 40.7128,
        longitude: -74.0060,
        status: "suspended",
        provider: "Nodlr Sim",
        isSim: true
    },
    {
        id: "sim-tok-05",
        displayName: "Tokyo Edge #1",
        latitude: 35.6762,
        longitude: 139.6503,
        status: "offline",
        provider: "Nodlr Sim",
        isSim: true
    }
];

interface MapProps {
    id?: string;
    mode?: "command" | "provider";
    nodes?: any[];
    nodlrs?: any[];
    accountContext?: { id: string; jwt: string };
    loading?: boolean;
    onNodeSelect?: (id: string) => void;
}

export default function FleetMap({ 
    id = "shared-fleet-map", 
    mode = "command",
    nodes: propNodes, 
    nodlrs,
    accountContext,
    loading: propLoading = false, 
    onNodeSelect 
}: MapProps) {
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any>(null);
    const [L, setL] = useState<any>(null);
    const [internalNodes, setInternalNodes] = useState<any[]>([]);
    const [internalLoading, setInternalLoading] = useState(false);

    // Data handling logic
    const fetchProviderNodes = async () => {
        if (mode !== "provider" || !accountContext?.id) return;
        
        try {
            setInternalLoading(true);
            const res = await fetch('/api/v1/nodes', {
                headers: { 
                    'Authorization': `Bearer ${accountContext.jwt}`,
                    'x-user-id': accountContext.id 
                }
            });
            
            if (res.ok) {
                const data = await res.json();
                const normalized = data.map((n: any) => ({
                    ...n,
                    lat: (n.lat ?? n.latitude ?? n.location?.lat),
                    lon: (n.lon ?? n.longitude ?? n.location?.lon),
                    displayName: (n.name ?? n.displayName ?? n.id)
                }));

                if (normalized.length === 0 && process.env.NODE_ENV === 'development') {
                    setInternalNodes(SIM_MACHINES);
                } else {
                    setInternalNodes(normalized);
                }
            }
        } catch (err) {
            console.error("FleetMap sync error:", err);
        } finally {
            setInternalLoading(false);
        }
    };

    useEffect(() => {
        if (mode === "provider") {
            fetchProviderNodes();
            const interval = setInterval(fetchProviderNodes, 15000);
            return () => clearInterval(interval);
        }
    }, [mode, accountContext?.id]);

    const activeNodes = mode === "provider" ? internalNodes : (propNodes || []);
    const loading = mode === "provider" ? internalLoading : propLoading;

    const nodeList = Array.isArray(activeNodes) ? activeNodes : (activeNodes && typeof activeNodes === 'object' ? Object.values(activeNodes) : []);
    const mappedNodes = nodeList.filter((n: any) => 
        n.lat !== undefined && n.lon !== undefined && 
        isFinite(Number(n.lat)) && isFinite(Number(n.lon))
    );

    useEffect(() => {
        if (typeof window === "undefined") return;

        const init = async () => {
            const leaflet = (await import("leaflet")).default;
            setL(leaflet);
            
            const container = document.getElementById(id);
            if (!container || mapRef.current) return;

            mapRef.current = leaflet.map(id, {
                center: [20, 0],
                zoom: 2,
                zoomControl: false,
                attributionControl: false,
            });

            leaflet.tileLayer(
                "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
                {
                    maxZoom: 20,
                    attribution: '&copy; CARTO',
                }
            ).addTo(mapRef.current);

            setTimeout(() => {
                if (mapRef.current) mapRef.current.invalidateSize();
            }, 100);

            markersRef.current = leaflet.layerGroup().addTo(mapRef.current);
        };

        init();

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [id]);

    useEffect(() => {
        if (!mapRef.current || !markersRef.current || !L || !mappedNodes.length) return;

        markersRef.current.clearLayers();

        mappedNodes.forEach((node: any) => {
            const status = node.status?.toLowerCase() || "active";
            let color = "#22D3EE";
            if (status === "offline" || status === "down") color = "#EF4444";
            if (status === "suspended" || status === "flagged") color = "#F59E0B";

            const marker = L.circleMarker([node.lat, node.lon], {
                radius: 6,
                fillColor: color,
                color: "#FFFFFF",
                weight: 1.5,
                opacity: 1,
                fillOpacity: 0.8,
            }).addTo(markersRef.current);

            const tooltipContent = `
                <div style="font-family: ui-monospace, monospace; padding: 6px 10px; border-radius: 4px; font-size: 11px; background: #000; border: 1px solid rgba(255,255,255,0.1); color: #fff;">
                    <div style="color: #64748b; margin-bottom: 2px;">NODE_ID: <span style="color: #fff; font-weight: bold;">${node.id || 'Unknown'}</span></div>
                    <div style="color: #64748b;">STATUS: <span style="color: ${color}; font-weight: bold; text-transform: uppercase;">${status}</span></div>
                </div>
            `;

            marker.bindTooltip(tooltipContent, {
                direction: "top",
                offset: [0, -10],
                className: "nodl-map-tooltip",
                opacity: 0.9,
            });

            if (onNodeSelect) {
                marker.on("click", () => onNodeSelect(node.id));
            }
        });
    }, [L, mappedNodes, onNodeSelect]);

    return (
        <section className="w-full bg-white/[0.02] border border-white/10 p-6 rounded-[5px] h-[520px] relative overflow-hidden flex flex-col group backdrop-blur-sm shadow-xl transition-all hover:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-cyber-cyan" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Global Fleet Distribution</h3>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative bg-black/40 rounded-[5px] overflow-hidden border border-white/5">
                <div id={id} className="absolute inset-0 z-0 map-canvas" style={{ backgroundColor: "#050505" }} />

                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-md">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-2 border-t-[#22D3EE] border-white/10 rounded-full animate-spin" />
                            <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Synchronizing Nodes...</span>
                        </div>
                    </div>
                )}

                {!loading && mappedNodes.length === 0 && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                        <div className="flex flex-col items-center gap-4 p-8 bg-black/60 border border-white/10 rounded-[5px] backdrop-blur-md">
                            <MapPin className="w-8 h-8 text-slate-700" />
                            <div className="text-center">
                                <span className="text-[11px] text-white uppercase tracking-[0.2em] font-bold block mb-1">Zero geocoded nodes detected</span>
                                <span className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">Nodes online: {nodeList.length} — Awaiting coordinate data</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </section>
    );
}
