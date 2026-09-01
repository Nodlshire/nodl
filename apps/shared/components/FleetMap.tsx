"use client";

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

function getHashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) / 2147483647;
}

interface MapProps {
  id?: string;
  mode?: "command" | "provider" | "mesh";
  nodes?: any[];
  nodlrs?: any[];
  loading?: boolean;
  onNodeSelect?: (id: string) => void;
  accountContext?: { id: string; jwt: string };
}

export default function FleetMap({
  id = "fleet-map-canvas",
  nodes = [],
  nodlrs = [],
  loading = false,
  onNodeSelect
}: MapProps) {
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const rawNodeList = Array.isArray(nodes) ? nodes : Object.values(nodes || {});
  const displayNodes = rawNodeList;

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      if (!isMounted) return;

      const container = document.getElementById(id);
      if (!container || mapRef.current) return;

      mapRef.current = L.map(id, {
        center: [25, 10],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false,
      });

      // Keyless OpenStreetMap Raster Tiles with Cyber Matrix Filter
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
  }, [id]);

  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    const renderMarkers = async () => {
      const L = (await import("leaflet")).default;
      markersLayerRef.current.clearLayers();

      const validNodes = displayNodes.filter(
        (n: any) =>
          (n.lat !== undefined || n.latitude !== undefined) &&
          (n.lon !== undefined || n.longitude !== undefined)
      );

      const coordBuckets: Record<string, number> = {};

      validNodes.forEach((node: any) => {
        const baseLat = Number(node.lat ?? node.latitude);
        const baseLon = Number(node.lon ?? node.longitude);
        if (!isFinite(baseLat) || !isFinite(baseLon)) return;

        const coordKey = `${baseLat.toFixed(3)},${baseLon.toFixed(3)}`;

        const index = coordBuckets[coordKey] || 0;
        coordBuckets[coordKey] = index + 1;

        let finalLat = baseLat;
        let finalLon = baseLon;

        if (index > 0) {
          const angle = (index * (2 * Math.PI)) / 5 + (getHashSeed(node.id || node.name || String(index)) * 0.5);
          const radius = 0.25 + (index * 0.15);
          finalLat = baseLat + radius * Math.cos(angle);
          finalLon = baseLon + radius * Math.sin(angle) * 1.5;
        }

        const isOnline =
          node.status?.toLowerCase() === "active" ||
          node.status?.toLowerCase() === "online";
        const markerColor = isOnline ? "#22D3EE" : "#EF4444";

        const marker = L.circleMarker([finalLat, finalLon], {
          radius: 6,
          fillColor: markerColor,
          color: "#FFFFFF",
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.9,
        });

        const tooltipContent = `
          <div style="font-family: monospace; font-size: 11px; background: #09090b; border: 1px solid rgba(255,255,255,0.15); padding: 6px 10px; border-radius: 4px; color: #fff;">
            <div style="color: #94a3b8; font-weight: bold; margin-bottom: 2px;">NODE: <span style="color: #fff;">${node.displayName || node.name || node.id || "Unknown"}</span></div>
            <div style="color: #94a3b8;">STATUS: <span style="color: ${markerColor}; text-transform: uppercase;">${node.status || "active"}</span></div>
            ${node.tier ? `<div style="color: #94a3b8;">TIER: <span style="color: #22D3EE;">${node.tier}</span></div>` : ""}
          </div>
        `;

        marker.bindTooltip(tooltipContent, {
          direction: "top",
          offset: [0, -8],
          opacity: 1.0,
        });

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
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/10 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
          <span className="text-[11px] font-bold text-white uppercase tracking-widest">Node Network Distribution</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
          <span>Active: <strong className="text-[#22D3EE]">{displayNodes.filter((n: any) => n.status === "active" || n.status === "online").length}</strong></span>
          <span>Offline: <strong className="text-red-400">{displayNodes.filter((n: any) => n.status !== "active" && n.status !== "online").length}</strong></span>
        </div>
      </div>

      <div id={id} className="w-full flex-1 relative z-0 bg-[#050505]" />

      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest animate-pulse">
            Synchronizing Nodes...
          </span>
        </div>
      )}

      <style jsx global>{`
        .cyber-osm-dark-tiles {
          filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.25) brightness(0.7);
        }
      `}</style>
    </div>
  );
}
