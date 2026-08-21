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
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any>(null);

    // Normalise: backend may return an object keyed by ID or an array
    const nodeList = Array.isArray(nodes) ? nodes : Object.values(nodes || {});
    const mappedNodes = nodeList.filter((n: any) => 
        n.lat !== undefined && n.lon !== undefined && 
        isFinite(Number(n.lat)) && isFinite(Number(n.lon))
    );
    const unmappedCount = nodeList.length - mappedNodes.length;

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
                "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
                {
                    maxZoom: 20,
                    attribution:
                        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
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

                const providerLookup = new globalThis.Map(nodlrs.map((n: any) => [n.id, n.displayName]));

                mappedNodes.forEach((node: any) => {
                    const status = node.status?.toLowerCase() || "active";
                    let color = "#22D3EE";
                    if (status === "offline" || status === "down") color = "#EF4444";
                    if (status === "suspended" || status === "flagged") color = "#F59E0B";

                    const marker = L.circleMarker([Number(node.lat), Number(node.lon)], {
                        radius: 6,
                        fillColor: color,
                        color: "#FFFFFF",
                        weight: 1.5,
                        opacity: 1,
                        fillOpacity: 0.8,
                    }).addTo(markersRef.current);

                    const providerName = providerLookup.get(node.userID) || "Unknown Provider";

                    const tooltipContent = `
                        <div style="font-family: ui-monospace, monospace; padding: 6px 10px; border-radius: 4px; font-size: 11px; background: rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.1); color: white;">
                            <div style="color: #b0bac3; margin-bottom: 2px;">NODE: <span style="color: white;">${node.id?.slice(0, 12)}...</span></div>
                            <div style="color: #b0bac3; margin-bottom: 2px;">PROVIDER: <span style="color: ${color};">${providerName}</span></div>
                            <div style="color: #b0bac3; margin-bottom: 2px;">CORES: <span style="color: white;">${node.cpuCores || 0}</span></div>
                            <div style="color: #b0bac3;">STATUS: <span style="color: ${color}; uppercase">${status}</span></div>
                        </div>
                    `;

                    marker.bindTooltip(tooltipContent, {
                        direction: "top",
                        offset: [0, -10],
                        className: "nodl-map-tooltip",
                        opacity: 1.0,
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
        <section className="w-full flex flex-col gap-4">
            {/* Map Header - Moved Above per Requirement 2 */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
                    <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">Global Fleet Distribution</span>
                    <div className="h-4 w-px bg-white/10 mx-2" />
                    <span className="ds-sub font-bold text-[#b0bac3]">{mappedNodes.length} Coordinates Swarmed</span>
                </div>
                
                {unmappedCount > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-[3px]">
                        <Radio className="w-3 h-3 text-yellow-500 animate-pulse" />
                        <span className="text-[9px] text-yellow-500 uppercase tracking-widest font-bold">
                            {unmappedCount} Geocoding pending
                        </span>
                    </div>
                )}
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-[5px] h-[480px] relative overflow-hidden group shadow-xl transition-all hover:bg-white/[0.03] backdrop-blur-sm">
                <div className="absolute inset-0 relative bg-neutral-950 rounded-md overflow-hidden border border-neutral-800">
                    <div
                        id="fleet-map"
                        className="absolute inset-0 z-0"
                        style={{ backgroundColor: "#080808" }}
                    />

                    {/* Map Legend / Annunciator - Requirement 5 */}
                    <div className="absolute bottom-6 left-6 z-10 bg-black/60 backdrop-blur-md p-3 border border-white/10 rounded-[5px] flex flex-col gap-2 min-w-[160px] pointer-events-none">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-[9px] text-[#b0bac3] uppercase tracking-widest font-bold">Active Nodes</span>
                            <span className="text-[10px] font-mono text-[#22D3EE] font-bold">{mappedNodes.length}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-2">
                            <span className="text-[9px] text-[#b0bac3] uppercase tracking-widest font-bold">Registry Sync</span>
                            <span className="text-[9px] font-mono text-green-400 font-bold tracking-tighter">STABLE</span>
                        </div>
                    </div>

                    {loading && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-8 h-8 border-2 border-t-cyan-400 border-white/10 rounded-full animate-spin" />
                                <span className="text-[11px] text-neutral-400 uppercase tracking-[0.2em] font-medium">
                                    Synchronizing Registry...
                                </span>
                            </div>
                        </div>
                    )}

                    {!loading && mappedNodes.length === 0 && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                            <div className="flex flex-col items-center gap-4 p-6 bg-neutral-900/80 border border-neutral-700 rounded-lg max-w-sm">
                                <div className="w-12 h-12 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-cyan-400/60" />
                                </div>
                                <div className="text-center space-y-2">
                                    <span className="text-[13px] text-neutral-100 uppercase tracking-wider font-semibold block">
                                        No Geocoded Nodes Available
                                    </span>
                                    <span className="text-[11px] text-neutral-400 font-mono tracking-wide block">
                                        {nodeList.length} node{nodeList.length !== 1 ? 's' : ''} registered — awaiting coordinate data
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="absolute top-4 right-4 flex flex-col items-end pointer-events-none z-10">
                    <span className="text-[10px] font-mono font-bold tracking-[0.4em] text-[#22D3EE] animate-pulse uppercase">
                        Fleet Link Active
                    </span>
                </div>
            </div>
        </section>
    );
}
