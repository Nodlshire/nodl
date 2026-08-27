"use client";

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const DEV_FALLBACK_NODES = [
  { id: "node-lon-01", name: "London Edge #1", lat: 51.5074, lon: -0.1278, status: "active", tier: "Tier-1" },
  { id: "node-bud-02", name: "Budapest Relay #2", lat: 47.4979, lon: 19.0402, status: "active", tier: "Tier-1" },
  { id: "node-nyc-03", name: "NYC Core Gateway #3", lat: 40.7128, lon: -74.0060, status: "active", tier: "Tier-1" },
  { id: "node-tok-04", name: "Tokyo Autonomous Edge #4", lat: 35.6762, lon: 139.6503, status: "active", tier: "Tier-2" },
  { id: "node-fra-05", name: "Frankfurt Relay #5", lat: 50.1109, lon: 8.6821, status: "active", tier: "Tier-1" },
  { id: "node-syd-06", name: "Sydney Mesh Unit #6", lat: -33.8688, lon: 151.2093, status: "offline", tier: "Tier-3" },
  { id: "node-sao-07", name: "São Paulo Ingress #7", lat: -23.5505, lon: -46.6333, status: "active", tier: "Tier-2" }
];

interface MapProps {
  nodes?: Array<{ id: string; lat?: number; lon?: number; status?: string; name?: string; tier?: string }>;
  nodlrs?: any[];
  loading?: boolean;
  onNodeSelect?: (id: string) => void;
}

export default function OpenMap({ nodes = [], nodlrs = [], loading = false, onNodeSelect }: MapProps) {
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const displayNodes = Array.isArray(nodes) && nodes.length > 0 ? nodes : DEV_FALLBACK_NODES;

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      if (!isMounted) return;

      const container = document.getElementById("cmd-map-canvas");
      if (!container || mapRef.current) return;

      mapRef.current = L.map("cmd-map-canvas", {
        center: [25, 10],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false,
      });

      // Free Open-Source OpenStreetMap with High-Res Country/City Labels
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        className: "cyber-osm-dark-tiles",
      }).addTo(mapRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);

      setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      }, 150);
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Marker updates
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    const renderMarkers = async () => {
      const L = (await import("leaflet")).default;
      markersLayerRef.current.clearLayers();

      const validNodes = displayNodes.filter(
        (n) => n.lat !== undefined && n.lon !== undefined && isFinite(Number(n.lat)) && isFinite(Number(n.lon))
      );

      validNodes.forEach((node) => {
        const isOnline = node.status?.toLowerCase() === "active" || node.status?.toLowerCase() === "online";
        const markerColor = isOnline ? "#22D3EE" : "#EF4444";

        const marker = L.circleMarker([Number(node.lat), Number(node.lon)], {
          radius: 6,
          fillColor: markerColor,
          color: "#FFFFFF",
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.9,
        });

        marker.bindTooltip(
          `<div style="font-family: monospace; font-size: 11px; background: #09090b; border: 1px solid rgba(255,255,255,0.15); padding: 6px 10px; border-radius: 4px; color: #fff;">
            <div style="color: #94a3b8; font-weight: bold; margin-bottom: 2px;">NODE: <span style="color: #fff;">${node.name || node.id}</span></div>
            <div style="color: #94a3b8;">STATUS: <span style="color: ${markerColor}; text-transform: uppercase;">${node.status || "active"}</span></div>
            ${node.tier ? `<div style="color: #94a3b8;">TIER: <span style="color: #22D3EE;">${node.tier}</span></div>` : ""}
          </div>`,
          { direction: "top", offset: [0, -8], opacity: 1.0 }
        );

        if (onNodeSelect) {
          marker.on("click", () => onNodeSelect(node.id));
        }

        marker.addTo(markersLayerRef.current);
      });
    };

    renderMarkers();
  }, [displayNodes, onNodeSelect]);

  return (
    <div className="w-full h-[480px] bg-[#09090b] rounded-[5px] border border-white/10 flex flex-col relative overflow-hidden my-4 shadow-2xl">
      {/* Header bar with Border Box */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/10 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
          <span className="text-[11px] font-bold text-white uppercase tracking-widest">Global Node Distribution</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
          <span>Active: <strong className="text-[#22D3EE]">{displayNodes.filter((n) => n.status === "active").length}</strong></span>
          <span>Offline: <strong className="text-red-400">{displayNodes.filter((n) => n.status !== "active").length}</strong></span>
        </div>
      </div>

      {/* High-Res Labeled Dark Map Surface */}
      <div id="cmd-map-canvas" className="w-full flex-1 relative z-0 bg-[#050505]" />

      <style jsx global>{`
        /* High-Definition Cyber Inversion Matrix for Zero-Key OSM Tiles */
        .cyber-osm-dark-tiles {
          filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.25) brightness(0.7);
        }
      `}</style>
    </div>
  );
}
