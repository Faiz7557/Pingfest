"use client";

import React, { useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import { ProvinceData, MapLayerMode } from "@/lib/types";
import { CLUSTER_COLORS } from "@/lib/constants";
import {
  getSpatialRelations,
  getCurvedArc,
  SpatialRelationsResult
} from "@/lib/spatialRelations";
import {
  ZoomIn,
  ZoomOut,
  Share2,
  Compass,
  Layers,
  Sparkles,
  Keyboard
} from "lucide-react";

interface ChoroplethMapProps {
  geoData: any;
  provinces: ProvinceData[];
  selectedProvince: ProvinceData | null;
  onSelectProvince: (prov: ProvinceData) => void;
  layerMode: MapLayerMode;
  hoveredProvince?: ProvinceData | null;
  onHoverProvince?: (prov: ProvinceData | null) => void;
  showProjections?: boolean;
  onToggleProjections?: () => void;
  resetTrigger?: number;
  zoomTrigger?: { type: "in" | "out"; ts: number } | null;
  onOpenShortcuts?: () => void;
}

export default function ChoroplethMap({
  geoData,
  provinces,
  selectedProvince,
  onSelectProvince,
  layerMode,
  hoveredProvince = null,
  onHoverProvince,
  showProjections = true,
  onToggleProjections,
  resetTrigger,
  zoomTrigger,
  onOpenShortcuts
}: ChoroplethMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const projectionLayerRef = useRef<L.LayerGroup | null>(null);

  // Fast map lookup by province name
  const provMap = useMemo(() => {
    return new Map(provinces.map((p) => [p.Provinsi, p]));
  }, [provinces]);

  // Active province for drawing projection lines
  const activeProvince = hoveredProvince || selectedProvince || provinces[0] || null;

  // Spatial relations for active province
  const activeRelations: SpatialRelationsResult | null = useMemo(() => {
    if (!activeProvince || provinces.length === 0) return null;
    return getSpatialRelations(activeProvince, provinces, 4);
  }, [activeProvince, provinces]);

  // Determine fill color by active layer
  const getFeatureColor = (provData?: ProvinceData) => {
    if (!provData) return "#CBD5E1";

    switch (layerMode) {
      case "klaster":
        return CLUSTER_COLORS[provData.nama_klaster] || "#94A3B8";

      case "kerentanan": {
        const v = provData.indeks_kerentanan;
        if (v >= 0.6) return "#EF4444";
        if (v >= 0.45) return "#F97316";
        if (v >= 0.35) return "#F59E0B";
        if (v >= 0.25) return "#7BBDE8";
        return "#10B981";
      }

      case "lisa": {
        switch (provData.lisa) {
          case "High-High":
            return "#DC2626";
          case "Low-Low":
            return "#2563EB";
          case "High-Low":
            return "#F97316";
          case "Low-High":
            return "#8B5CF6";
          default:
            return "#94A3B8";
        }
      }

      case "gwr": {
        const coeff = provData.gwr_ipm_2024;
        if (coeff >= 10.0) return "#7C3AED";
        if (coeff >= 8.0) return "#2563EB";
        if (coeff >= 5.0) return "#0284C7";
        return "#0D9488";
      }

      default:
        return CLUSTER_COLORS[provData.nama_klaster] || "#94A3B8";
    }
  };

  // Initialize Map without external TileLayer (pure vector map, NO watermark, NO WM basemap)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Fractional zoom enabled for tighter, focused framing of Indonesia
    const map = L.map(mapContainerRef.current, {
      center: [-2.2, 118],
      zoom: 5.25,
      zoomSnap: 0.05,
      zoomDelta: 0.25,
      minZoom: 4,
      maxZoom: 9,
      zoomControl: false,
      attributionControl: false
    });

    // Create a dedicated layer group for projection lines and connection nodes
    const projGroup = L.layerGroup().addTo(map);
    projectionLayerRef.current = projGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      projectionLayerRef.current = null;
    };
  }, []);

  const hasFittedBoundsRef = useRef(false);

  // Initialize GeoJSON layer once when map and geoData are ready
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !geoData) return;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
    }

    const geoLayer = L.geoJSON(geoData, {
      style: (feature) => {
        const provName = feature?.properties?.PROVINSI;
        const pData = provMap.get(provName);
        const fillColor = getFeatureColor(pData);
        return {
          fillColor,
          weight: 1.2,
          opacity: 1,
          color: "#001D39",
          fillOpacity: 0.78
        };
      },
      onEachFeature: (feature, layer: any) => {
        const provName = feature?.properties?.PROVINSI;
        const pData = provMap.get(provName);

        if (pData) {
          // Minimal sticky tooltip on polygon
          layer.bindTooltip(
            `
            <div style="font-family: inherit; font-size: 11px; font-weight: 800; color: #001D39; padding: 2px;">
              <strong>${pData.Provinsi}</strong> <span style="color: #49769F; font-weight: 600;">(${pData.nama_klaster})</span>
            </div>
            `,
            { sticky: true, opacity: 0.95, direction: "top" }
          );

          layer.on({
            mouseover: () => {
              onHoverProvince?.(pData);
            },
            mouseout: () => {
              onHoverProvince?.(null);
            },
            click: () => {
              onSelectProvince(pData);
            }
          });
        }
      }
    }).addTo(map);

    geoJsonLayerRef.current = geoLayer;

    // Fit bounds strictly once on initial load - stable, calm, no jitter
    if (!hasFittedBoundsRef.current) {
      try {
        const bounds = geoLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [16, 16] });
          hasFittedBoundsRef.current = true;
        }
      } catch {
        // fallback
      }
    }
  }, [geoData, provMap, onSelectProvince, onHoverProvince]);

  // Dynamically update polygon styling without recreating layer or moving the map
  useEffect(() => {
    const geoLayer = geoJsonLayerRef.current;
    if (!geoLayer) return;

    geoLayer.setStyle((feature) => {
      const provName = feature?.properties?.PROVINSI;
      const pData = provMap.get(provName);
      const isSelected = selectedProvince?.Provinsi === provName;
      const isHovered = hoveredProvince?.Provinsi === provName;

      // Check if this province is one of the active spatial neighbors
      const isNeighbor =
        activeRelations?.knnNeighbors.some((n) => n.provinsi === provName) || false;

      const fillColor = getFeatureColor(pData);

      return {
        fillColor,
        weight: isHovered ? 3.5 : isSelected ? 3 : isNeighbor ? 2.2 : 1.2,
        opacity: 1,
        color: isHovered
          ? "#001D39"
          : isSelected
          ? "#001D39"
          : isNeighbor
          ? "#0A4174"
          : "#001D39",
        fillOpacity: isHovered
          ? 0.98
          : isSelected
          ? "#001D39" === fillColor ? 0.95 : 0.92
          : isNeighbor
          ? 0.88
          : 0.78
      };
    });

    // Bring hovered or selected polygon to front smoothly
    if (hoveredProvince || selectedProvince) {
      const targetName = hoveredProvince?.Provinsi || selectedProvince?.Provinsi;
      geoLayer.eachLayer((l: any) => {
        if (l.feature?.properties?.PROVINSI === targetName) {
          l.bringToFront();
        }
      });
    }
  }, [layerMode, selectedProvince, hoveredProvince, activeRelations, provMap]);

  // Handle external reset trigger
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      handleResetBounds();
    }
  }, [resetTrigger]);

  // Handle external zoom trigger
  useEffect(() => {
    if (zoomTrigger) {
      if (zoomTrigger.type === "in") handleZoomIn();
      if (zoomTrigger.type === "out") handleZoomOut();
    }
  }, [zoomTrigger]);

  // Draw Spatial Projection Lines and Nodes on Hover/Selection
  useEffect(() => {
    const projGroup = projectionLayerRef.current;
    if (!projGroup) return;

    projGroup.clearLayers();

    if (!showProjections || !activeProvince || !activeRelations) return;

    const sourceLat = activeProvince.lat;
    const sourceLon = activeProvince.lon;

    // Source Centroid Pulse Marker
    const sourceIcon = L.divIcon({
      className: "source-node-marker",
      html: `
        <div style="position: relative; width: 18px; height: 18px; display: flex; items-center; justify-content: center;">
          <span style="position: absolute; width: 24px; height: 24px; border-radius: 9999px; background: #001D39; opacity: 0.35; animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <span style="position: relative; width: 14px; height: 14px; border-radius: 9999px; background: #001D39; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 4px rgba(0,0,0,0.4);"></span>
        </div>
      `,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    L.marker([sourceLat, sourceLon], { icon: sourceIcon, interactive: false }).addTo(projGroup);

    // Draw curved lines to each spatial neighbor
    activeRelations.knnNeighbors.forEach((neighbor) => {
      const arcPoints = getCurvedArc(sourceLat, sourceLon, neighbor.lat, neighbor.lon, 24);

      // Glow underlay line
      L.polyline(arcPoints, {
        color: "#7BBDE8",
        weight: 5,
        opacity: 0.65,
        interactive: false
      }).addTo(projGroup);

      // Main dashed animated projection line
      L.polyline(arcPoints, {
        color: "#001D39",
        weight: 2.5,
        dashArray: "6, 6",
        opacity: 0.9,
        className: "spatial-projection-line",
        interactive: false
      }).addTo(projGroup);

      // Destination pulsing node marker
      const targetColor = CLUSTER_COLORS[neighbor.nama_klaster] || "#EF4444";
      const targetIcon = L.divIcon({
        className: "target-node-marker",
        html: `
          <div style="position: relative; width: 14px; height: 14px;">
            <span style="position: absolute; inset: -3px; border-radius: 9999px; background: ${targetColor}; opacity: 0.6; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
            <span style="position: relative; display: block; width: 14px; height: 14px; border-radius: 9999px; background: ${targetColor}; border: 2px solid #001D39; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></span>
          </div>
        `,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const destMarker = L.marker([neighbor.lat, neighbor.lon], {
        icon: targetIcon,
        zIndexOffset: 1000,
        interactive: false
      }).addTo(projGroup);
    });
  }, [activeProvince, activeRelations, showProjections]);

  // Controls handler
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetBounds = () => {
    if (geoJsonLayerRef.current && mapInstanceRef.current) {
      const bounds = geoJsonLayerRef.current.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [16, 16]
        });
      }
    }
  };

  const renderLegend = () => {
    switch (layerMode) {
      case "klaster":
        return (
          <div className="flex items-center flex-wrap gap-2 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#10B981] border border-[#001D39]" />
              <span className="text-[#001D39]">Maju (6)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#7BBDE8] border border-[#001D39]" />
              <span className="text-[#001D39]">Berkembang (8)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#F59E0B] border border-[#001D39]" />
              <span className="text-[#001D39]">Tertinggal (22)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#EF4444] border border-[#001D39]" />
              <span className="text-[#EF4444]">Ekstrem (2)</span>
            </div>
          </div>
        );

      case "kerentanan":
        return (
          <div className="flex items-center gap-2 text-xs font-bold text-[#001D39]">
            <span>Aman (0.14)</span>
            <div className="w-24 h-2.5 rounded-full bg-gradient-to-r from-[#10B981] via-[#F59E0B] to-[#EF4444] border border-[#001D39]" />
            <span className="text-[#EF4444]">Rentan (0.84)</span>
          </div>
        );

      case "lisa":
        return (
          <div className="flex items-center flex-wrap gap-2 text-xs font-bold">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[#DC2626] border border-[#001D39]" />
              <span className="text-[#001D39]">High-High</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[#2563EB] border border-[#001D39]" />
              <span className="text-[#001D39]">Low-Low</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[#F97316] border border-[#001D39]" />
              <span className="text-[#001D39]">Outlier</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[#94A3B8] border border-[#001D39]" />
              <span className="text-[#49769F]">Non-Signifikan</span>
            </div>
          </div>
        );

      case "gwr":
        return (
          <div className="flex items-center flex-wrap gap-2 text-xs font-bold">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[#7C3AED] border border-[#001D39]" />
              <span className="text-[#001D39]">&gt;10</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[#2563EB] border border-[#001D39]" />
              <span className="text-[#001D39]">8-10</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[#0284C7] border border-[#001D39]" />
              <span className="text-[#001D39]">5-8</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[#0D9488] border border-[#001D39]" />
              <span className="text-[#001D39]">&lt;5</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[560px] rounded-2xl overflow-hidden border-2 border-[#001D39] shadow-[4px_4px_0px_#001D39] bg-[#EDF4F9] bg-grid-pattern group">
      {/* Standalone Leaflet Map Canvas - Completely unobstructed */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top-Left Subtle Focus Badge (Hidden on small mobile to give room to controls) */}
      <div className="hidden sm:flex absolute top-3 left-3 sm:top-4 sm:left-4 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border-2 border-[#001D39] text-[11px] font-bold text-[#001D39] shadow-[2px_2px_0px_#001D39] items-center gap-1.5 pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-[#0A4174]" />
        <span>Fokus Spasial 38 Provinsi</span>
      </div>

      {/* Top-Right Control Bar: Shortcuts, Projections Toggle & Map Navigation */}
      <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-[400] flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {/* Keyboard Shortcuts Button */}
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 rounded-xl bg-white hover:bg-[#EDF4F9] border-2 border-[#001D39] text-xs font-black text-[#001D39] shadow-[2px_2px_0px_#001D39] transition-all cursor-pointer"
            title="Buka panduan pintasan keyboard (Shortcut: ?)"
          >
            <Keyboard className="w-3.5 h-3.5 text-[#0A4174]" />
            <span className="hidden md:inline">Pintasan</span>
            <kbd className="px-1.5 py-0.2 rounded bg-[#EDF4F9] text-[10px] font-mono border">?</kbd>
          </button>
        )}

        {/* Toggle Projection Lines */}
        {onToggleProjections && (
          <button
            onClick={onToggleProjections}
            className={`flex items-center gap-1 px-2.5 py-1.5 sm:px-3 rounded-xl border-2 border-[#001D39] text-xs font-black shadow-[2px_2px_0px_#001D39] transition-all cursor-pointer ${
              showProjections
                ? "bg-[#7BBDE8] text-[#001D39]"
                : "bg-white text-[#49769F] hover:bg-[#EDF4F9]"
            }`}
            title="Tampilkan atau sembunyikan garis proyeksi keterkaitan spasial (Shortcut: P)"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Garis Spasial:</span>
            <span>{showProjections ? "Aktif" : "Nonaktif"}</span>
          </button>
        )}

        {/* Reset View Button */}
        <button
          onClick={handleResetBounds}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#EDF4F9] border-2 border-[#001D39] text-xs font-black text-[#001D39] shadow-[2px_2px_0px_#001D39] transition-all cursor-pointer"
          title="Fokuskan kembali peta ke seluruh Kepulauan Indonesia (Shortcut: R)"
        >
          <Compass className="w-3.5 h-3.5 text-[#0A4174]" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center bg-white rounded-xl border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-[#EDF4F9] text-[#001D39] border-r border-[#001D39] transition-colors cursor-pointer"
            title="Perbesar Fokus (Shortcut: +)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-[#EDF4F9] text-[#001D39] transition-colors cursor-pointer"
            title="Perkecil (Shortcut: -)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-2.5 left-2.5 sm:bottom-4 sm:left-4 z-[400] bg-white/95 backdrop-blur-md px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl border-2 border-[#001D39] shadow-[3px_3px_0px_#001D39] max-w-[calc(100%-20px)] sm:max-w-none overflow-x-auto">
        <div className="text-[10px] font-black text-[#49769F] uppercase tracking-wider mb-1 flex items-center gap-1">
          <Layers className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            Lapisan:{" "}
            <span className="text-[#001D39]">
              {layerMode === "klaster"
                ? "4 Klaster K-Means"
                : layerMode === "kerentanan"
                ? "Indeks Kerentanan"
                : layerMode === "lisa"
                ? "LISA Spasial (Moran)"
                : "Sensitivitas GWR (IPM)"}
            </span>
          </span>
        </div>
        {renderLegend()}
      </div>

      {/* Bottom-Right Guide Hint with Keyboard Keys (Hidden on mobile and tablet to prevent clutter) */}
      <div className="hidden md:flex items-center gap-2 absolute bottom-4 right-4 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border-2 border-[#001D39] text-[11px] font-bold text-[#001D39] shadow-[2px_2px_0px_#001D39]">
        <span>⌨️ Gunakan</span>
        <div className="flex items-center gap-0.5">
          <kbd className="px-1 rounded bg-[#EDF4F9] text-[10px] font-mono border">←</kbd>
          <kbd className="px-1 rounded bg-[#EDF4F9] text-[10px] font-mono border">↑</kbd>
          <kbd className="px-1 rounded bg-[#EDF4F9] text-[10px] font-mono border">↓</kbd>
          <kbd className="px-1 rounded bg-[#EDF4F9] text-[10px] font-mono border">→</kbd>
        </div>
        <span>untuk navigasi wilayah</span>
      </div>
    </div>
  );
}
