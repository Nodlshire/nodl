"use client";

import React, { useEffect, useRef } from "react";
import { Globe, MapPin, Radio } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface MapProps {
    nodes: any[];
    nodlrs: any[];
    loading: boolean;
    onNodeSelect: (id: string) => void;
}

export default function FleetMap({ nodes, nodlrs, loading, onNodeSelect }: MapProps) {
    console.log('FLEETMAP RENDER START', { nodes, loading });

    if (nodes === undefined || nodes === null) {
        console.log('FLEETMAP BRANCH: NODES UNDEFINED');
        return (
            <div className="bg-yellow-500/20 text-yellow-400 p-4 border border-yellow-500 font-mono text-sm text-center">
                FLEETMAP BRANCH: NODES UNDEFINED
            </div>
        );
    }

    const mapRef = useRef<any>(null);
    const markersRef = useRef<any>(null);

    // Normalise: backend may return an object keyed by ID or an array
    const nodeList = Array.isArray(nodes) ? nodes : Object.values(nodes || {});
    const mappedNodes = nodeList.filter((n: any) => n.lat && n.lon);

    if (Array.isArray(nodes) && nodes.length === 0 && !loading) {
        console.log('FLEETMAP BRANCH: NODES EMPTY');
    } else if (Array.isArray(nodes) && nodes.length > 0) {
        console.log('FLEETMAP BRANCH: NODES PRESENT', { count: nodes.length });
    }

    // Initialise Leaflet map
    useEffect(() => {
        if (typeof window === "undefined") return;

        let cancelled = false;

        const initMap = async () => {
            const L = (await import("leaflet")).default;
            if (cancelled) return;

            const container = document.getElementById("fleet-map");
            if (!container || mapRef.current) return;

            mapRef.current = L.map("fleet-map", {
                center: [20, 0],
                zoom: 2,
                zoomControl: false,
                attributionControl: false,
            });

            L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
                {
                    maxZoom: 20,
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                }
            ).addTo(mapRef.current);

            markersRef.current = L.layerGroup().addTo(mapRef.current);
        };

        initMap();

        return () => {
            cancelled = true;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Paint markers whenever node data changes
    useEffect(() => {
        if (!mapRef.current || !markersRef.current || !mappedNodes.length) return;

        const updateMarkers = async () => {
            if (typeof window === "undefined") return;
            try {
                const L = (await import("leaflet")).default;
                markersRef.current.clearLayers();
                const safeNodlrs = Array.isArray(nodlrs) ? nodlrs : [];
                const providerLookup = new globalThis.Map(safeNodlrs.map((n: any) => [n.id, n.displayName]));

                mappedNodes.forEach((node: any) => {
                    let safeID = "Unknown Peer";
                    try {
                        safeID = node.id || "Unknown";
                    } catch (e) {
                        console.warn("Caught CID parse error during render:", e);
                    }

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

                    const providerName = providerLookup.get(node.userID) || "Unknown Provider";

                    const tooltipContent = `
                        <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; padding: 4px 8px; border-radius: 4px; font-size: 11px;">
                            <div style="color: #64748b; margin-bottom: 2px;">NODE_ID: <span style="color: white; font-weight: bold;">${safeID}</span></div>
                            <div style="color: #64748b; margin-bottom: 2px;">PROVIDER: <span style="color: ${color}; font-weight: bold;">${providerName}</span></div>
                            <div style="color: #64748b; margin-bottom: 2px;">TIER: <span style="color: white;">${node.tier || "N/A"}</span></div>
                            <div style="color: #64748b;">UPTIME: <span style="color: white;">${node.uptime || "0%"}</span></div>
                        </div>
                    `;

                    marker.bindTooltip(tooltipContent, {
                        direction: "top",
                        offset: [0, -10],
                        className: "nodl-map-tooltip",
                        opacity: 0.9,
                    });

                    marker.on("click", () => onNodeSelect(node.id));
                });
            } catch (err) {
                console.error("Map marker update failure:", err);
            }
        };

        updateMarkers();
    }, [nodes, nodlrs, mappedNodes.length, onNodeSelect]);

    return (
        <section className="w-full bg-neutral-900/60 border border-neutral-700 p-4 rounded-md h-[520px] relative overflow-hidden flex flex-col group shadow-sm transition-all">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-neutral-100 uppercase tracking-widest">
                    Global Fleet Distribution
                </span>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                        <span className="text-[10px] text-neutral-300 uppercase tracking-widest font-bold">
                            Active Nodes: {nodeList.filter((n: any) => n.status?.toLowerCase() === 'active').length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                        <span className="text-[10px] text-neutral-300 uppercase tracking-widest font-bold">
                            Inactive Nodes: {nodeList.filter((n: any) => n.status?.toLowerCase() !== 'active').length}
                        </span>
                    </div>
                </div>
            </div>

            {(!loading && mappedNodes.length === 0) ? (
                <div className="flex-1 flex items-center justify-center bg-neutral-950 rounded-md border border-neutral-800 min-h-[400px] relative">
                    <div className="absolute top-4 left-4 z-[9999] bg-orange-500/20 text-orange-400 p-2 text-xs font-mono border border-orange-500/50">
                        FLEETMAP BRANCH: NODES EMPTY
                    </div>
                    <div className="flex flex-col items-center gap-4 p-6 bg-neutral-900/80 border border-neutral-700 rounded-lg max-w-sm">
                        <div className="w-12 h-12 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-cyan-400/60" />
                        </div>
                        <div className="text-center space-y-2">
                            <span className="text-[13px] text-neutral-100 uppercase tracking-wider font-semibold block">
                                NO GEOCODED NODES AVAILABLE
                            </span>
                            <span className="text-[11px] text-neutral-400 font-mono tracking-wide block">
                                {nodeList.length} node{nodeList.length !== 1 ? 's' : ''} registered — awaiting coordinate data
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 relative bg-neutral-950 rounded-md overflow-hidden border border-neutral-800">
                    {Array.isArray(nodes) && nodes.length > 0 && (
                        <div className="absolute top-4 left-4 z-[9999] bg-green-500/20 text-green-400 p-2 text-xs font-mono border border-green-500/50 pointer-events-none">
                            FLEETMAP BRANCH: NODES PRESENT
                        </div>
                    )}
                    <div
                        id="fleet-map"
                        className="absolute inset-0 z-0"
                        style={{ backgroundColor: "#080808" }}
                    />

                    {loading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-8 h-8 border-2 border-t-cyan-400 border-white/10 rounded-full animate-spin" />
                                <span className="text-[11px] text-neutral-400 uppercase tracking-[0.2em] font-medium">
                                    Synchronizing Registry...
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </section>
    );
}
