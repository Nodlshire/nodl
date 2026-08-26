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

    const coordCounts = new Map<string, number>();

    const mappedNodes = nodeList.map((n: any, index: number) => {
		let lat = Number(n.lat !== undefined ? n.lat : (n.latitude !== undefined ? n.latitude : 0));
		let lon = Number(n.lon !== undefined ? n.lon : (n.lng !== undefined ? n.lng : (n.longitude !== undefined ? n.longitude : 0)));
		
		if (!isFinite(lat)) lat = 0;
		if (!isFinite(lon)) lon = 0;
		
		if (lat === 0 && lon === 0) {
			const countryKey = (n.country || n.location || n.countryName || '').toLowerCase().trim();
			const COUNTRY_CENTROIDS: Record<string, [number, number]> = {
				"united states": [37.0902, -95.7129],
				"us": [37.0902, -95.7129],
				"usa": [37.0902, -95.7129],
				"united kingdom": [55.3781, -3.4360],
				"uk": [55.3781, -3.4360],
				"gb": [55.3781, -3.4360],
				"germany": [51.1657, 10.4515],
				"de": [51.1657, 10.4515],
				"france": [46.2276, 2.2137],
				"fr": [46.2276, 2.2137],
				"japan": [36.2048, 138.2529],
				"jp": [36.2048, 138.2529],
				"australia": [-25.2744, 133.7751],
				"au": [-25.2744, 133.7751],
				"canada": [56.1304, -106.3468],
				"ca": [56.1304, -106.3468],
				"brazil": [-14.2350, -51.9253],
				"br": [-14.2350, -51.9253],
				"united arab emirates": [23.4241, 53.8478],
				"uae": [23.4241, 53.8478],
				"hungary": [47.1625, 19.5033],
				"hu": [47.1625, 19.5033],
			};

			if (countryKey && COUNTRY_CENTROIDS[countryKey]) {
				const [cLat, cLon] = COUNTRY_CENTROIDS[countryKey];
				const angle = index * 137.5 * (Math.PI / 180);
				const radius = 0.1 * Math.sqrt(index + 1);
				lat = cLat + Math.cos(angle) * radius;
				lon = cLon + Math.sin(angle) * radius;
			} else {
				// Staggered golden spiral around Budapest, Hungary (47.4979, 19.0402)
				const angle = index * 137.5 * (Math.PI / 180);
				const radius = 0.2 * Math.sqrt(index + 1);
				lat = 47.4979 + Math.cos(angle) * radius;
				lon = 19.0402 + Math.sin(angle) * radius;
			}
		}

		// Offset overlapping node markers so every node renders distinctly on the map
		const coordKey = `${lat.toFixed(3)},${lon.toFixed(3)}`;
		const count = coordCounts.get(coordKey) || 0;
		coordCounts.set(coordKey, count + 1);
		if (count > 0) {
			const angle = count * 137.5 * (Math.PI / 180);
			const radius = 0.5 * Math.sqrt(count);
			lat = lat + Math.cos(angle) * radius;
			lon = lon + Math.sin(angle) * radius;
		}
		
		return {
			...n,
			lat,
			lon
		};
	});

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

            const resizeMap = () => {
                if (mapRef.current) mapRef.current.invalidateSize();
            };
            setTimeout(resizeMap, 100);
            setTimeout(resizeMap, 500);
            setTimeout(resizeMap, 1000);
            window.addEventListener("resize", resizeMap);

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

            const rawType = node.node_type || node.type || node.operator_type || 'native';
            const operatorLabel = rawType.includes('headless') ? 'Headless Node Operator' : rawType.includes('space') ? 'Space Node Operator' : 'Native Node Operator';

            const currentUserId = typeof window !== 'undefined'
                ? (localStorage.getItem('nodl_user_id') || localStorage.getItem('nodlr_user_id') || '100001-0426-01-AA')
                : '100001-0426-01-AA';
            const nodeOwner = node.ownerId || node.owner_id;
            const isOwnedByUser = nodeOwner === currentUserId;

            const tooltipContent = `
                <div style="font-family: ui-monospace, monospace; padding: 6px 10px; border-radius: 4px; font-size: 11px; background: #000; border: 1px solid rgba(255,255,255,0.1); color: #fff;">
                    <div style="color: #64748b; margin-bottom: 2px;">NODE_ID: <span style="color: #fff; font-weight: bold;">${node.id || 'Unknown'}</span></div>
                    <div style="color: #22D3EE; margin-bottom: 2px;">TYPE: <span style="color: #fff; font-weight: bold;">${operatorLabel}</span></div>
                    <div style="color: #64748b; margin-bottom: 2px;">STATUS: <span style="color: ${color}; font-weight: bold; text-transform: uppercase;">${status}</span></div>
                    <div style="color: ${isOwnedByUser ? '#10B981' : '#94A3B8'}; font-size: 10px; margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px;">
                        ${isOwnedByUser ? '● OWNER FLEET (Manageable)' : '● GLOBAL MESH (Read-Only)'}
                    </div>
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
                    <div className="absolute bottom-4 right-4 z-10 flex items-center justify-center pointer-events-none">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/80 border border-white/10 rounded-full backdrop-blur-md">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Nodes online: {nodeList.length} (Awaiting Geo)</span>
                        </div>
                    </div>
                )}
            </div>

        </section>
    );
}
