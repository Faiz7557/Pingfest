"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { ProvinceData, MapLayerMode } from "@/lib/types";
import ProvinceInspector from "./ProvinceInspector";
import SpatialProjectionPanel from "./SpatialProjectionPanel";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";
import { getNextProvinceDirectional } from "@/lib/spatialRelations";
import { Layers, Keyboard, Sparkles, Check } from "lucide-react";

const DynamicChoroplethMap = dynamic(() => import("./ChoroplethMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[560px] rounded-2xl bg-white border-2 border-[#001D39] shadow-[4px_4px_0px_#001D39] flex flex-col items-center justify-center text-[#001D39] space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-[#BDD8E9] border-2 border-[#001D39] flex items-center justify-center text-[#001D39] animate-bounce shadow-[2px_2px_0px_#001D39]">
        <Layers className="w-6 h-6" />
      </div>
      <span className="text-sm font-black">Memuat Peta Spasial 38 Provinsi...</span>
    </div>
  )
});

interface MapSectionProps {
  geoData: any;
  provinces: ProvinceData[];
  selectedProvince: ProvinceData | null;
  onSelectProvince: (prov: ProvinceData) => void;
}

export default function MapSection({
  geoData,
  provinces,
  selectedProvince,
  onSelectProvince
}: MapSectionProps) {
  const [layerMode, setLayerMode] = useState<MapLayerMode>("klaster");
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceData | null>(null);
  const [showProjections, setShowProjections] = useState<boolean>(true);

  // Keyboard shortcut state triggers
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [zoomTrigger, setZoomTrigger] = useState<{ type: "in" | "out"; ts: number } | null>(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Active province for inspection / right panel: priority to hover, fallback to selected
  const activeProvince = hoveredProvince || selectedProvince || provinces[0] || null;

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 1600);
  }, []);

  // Global seamless keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is currently typing in an input, textarea, or select
      const activeTag = (document.activeElement as HTMLElement)?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT") {
        return;
      }

      const key = e.key;

      if (key === "ArrowRight") {
        e.preventDefault();
        const current = activeProvince || provinces[0];
        if (current && provinces.length > 0) {
          const next = getNextProvinceDirectional(current, "right", provinces);
          setHoveredProvince(next);
          showToast(`→ Timur: ${next.Provinsi} (${next.nama_klaster})`);
        }
      } else if (key === "ArrowLeft") {
        e.preventDefault();
        const current = activeProvince || provinces[0];
        if (current && provinces.length > 0) {
          const next = getNextProvinceDirectional(current, "left", provinces);
          setHoveredProvince(next);
          showToast(`← Barat: ${next.Provinsi} (${next.nama_klaster})`);
        }
      } else if (key === "ArrowUp") {
        e.preventDefault();
        const current = activeProvince || provinces[0];
        if (current && provinces.length > 0) {
          const next = getNextProvinceDirectional(current, "up", provinces);
          setHoveredProvince(next);
          showToast(`↑ Utara: ${next.Provinsi} (${next.nama_klaster})`);
        }
      } else if (key === "ArrowDown") {
        e.preventDefault();
        const current = activeProvince || provinces[0];
        if (current && provinces.length > 0) {
          const next = getNextProvinceDirectional(current, "down", provinces);
          setHoveredProvince(next);
          showToast(`↓ Selatan: ${next.Provinsi} (${next.nama_klaster})`);
        }
      } else if (key === "Enter" || key === " ") {
        e.preventDefault();
        if (activeProvince) {
          onSelectProvince(activeProvince);
          showToast(`✓ Wilayah Terpilih: ${activeProvince.Provinsi}`);
        }
      } else if (key === "1") {
        setLayerMode("klaster");
        showToast("Lapisan: 4 Klaster K-Means");
      } else if (key === "2") {
        setLayerMode("kerentanan");
        showToast("Lapisan: Indeks Kerentanan");
      } else if (key === "3") {
        setLayerMode("lisa");
        showToast("Lapisan: LISA Spasial (Moran)");
      } else if (key === "4") {
        setLayerMode("gwr");
        showToast("Lapisan: Sensitivitas GWR (IPM)");
      } else if (key === "p" || key === "P") {
        setShowProjections((prev) => {
          showToast(prev ? "Garis Spasial: Nonaktif" : "Garis Spasial: Aktif");
          return !prev;
        });
      } else if (key === "r" || key === "R") {
        setResetTrigger((c) => c + 1);
        showToast("Peta direset ke seluruh Indonesia");
      } else if (key === "+" || key === "=") {
        setZoomTrigger({ type: "in", ts: Date.now() });
        showToast("Perbesar Peta (+)");
      } else if (key === "-" || key === "_") {
        setZoomTrigger({ type: "out", ts: Date.now() });
        showToast("Perkecil Peta (-)");
      } else if (key === "?" || key === "h" || key === "H") {
        setShowShortcutsModal((prev) => !prev);
      } else if (key === "Escape") {
        setShowShortcutsModal(false);
        setHoveredProvince(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProvince, provinces, onSelectProvince, showToast]);

  return (
    <section className="w-full space-y-5 relative">
      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      {/* Dynamic Tactile Keyboard Navigation Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9990] bg-[#001D39] text-white px-4 py-2 rounded-2xl border-2 border-[#7BBDE8] shadow-[4px_4px_0px_#001D39] text-xs font-black flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-[#7BBDE8] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Controls: Layer Mode Switcher & Province Quick Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border-2 border-[#001D39] shadow-[4px_4px_0px_#001D39]">
        {/* Layer Mode Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 flex-nowrap sm:flex-wrap w-full md:w-auto">
          <span className="text-xs font-black text-[#001D39] flex items-center gap-1.5 mr-1 pl-1 whitespace-nowrap">
            <Layers className="w-4 h-4 text-[#4E8EA2] flex-shrink-0" />
            <span className="hidden sm:inline">Lapisan Analitik:</span>
          </span>

          <button
            onClick={() => setLayerMode("klaster")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border-2 border-[#001D39] flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
              layerMode === "klaster"
                ? "bg-[#BDD8E9] text-[#001D39] shadow-[2px_2px_0px_#001D39]"
                : "bg-white text-[#49769F] hover:bg-[#EDF4F9]"
            }`}
          >
            <kbd className="px-1 py-0.2 rounded bg-white text-[9px] font-mono border border-[#001D39]/30">1</kbd>
            <span>4 Klaster</span>
          </button>

          <button
            onClick={() => setLayerMode("kerentanan")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border-2 border-[#001D39] flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
              layerMode === "kerentanan"
                ? "bg-[#BDD8E9] text-[#001D39] shadow-[2px_2px_0px_#001D39]"
                : "bg-white text-[#49769F] hover:bg-[#EDF4F9]"
            }`}
          >
            <kbd className="px-1 py-0.2 rounded bg-white text-[9px] font-mono border border-[#001D39]/30">2</kbd>
            <span>Kerentanan</span>
          </button>

          <button
            onClick={() => setLayerMode("lisa")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border-2 border-[#001D39] flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
              layerMode === "lisa"
                ? "bg-[#BDD8E9] text-[#001D39] shadow-[2px_2px_0px_#001D39]"
                : "bg-white text-[#49769F] hover:bg-[#EDF4F9]"
            }`}
          >
            <kbd className="px-1 py-0.2 rounded bg-white text-[9px] font-mono border border-[#001D39]/30">3</kbd>
            <span>LISA Moran</span>
          </button>

          <button
            onClick={() => setLayerMode("gwr")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border-2 border-[#001D39] flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
              layerMode === "gwr"
                ? "bg-[#BDD8E9] text-[#001D39] shadow-[2px_2px_0px_#001D39]"
                : "bg-white text-[#49769F] hover:bg-[#EDF4F9]"
            }`}
          >
            <kbd className="px-1 py-0.2 rounded bg-white text-[9px] font-mono border border-[#001D39]/30">4</kbd>
            <span>GWR (IPM)</span>
          </button>
        </div>

        {/* Quick Province Dropdown Selector & Shortcut Cheatsheet Button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowShortcutsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDF4F9] hover:bg-white border-2 border-[#001D39] text-xs font-black text-[#001D39] shadow-[2px_2px_0px_#001D39] transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
            title="Lihat seluruh pintasan keyboard (Shortcut: ?)"
          >
            <Keyboard className="w-3.5 h-3.5 text-[#0A4174]" />
            <span className="hidden sm:inline">Pintasan</span>
            <kbd className="px-1.5 py-0.2 rounded bg-white text-[10px] font-mono border">?</kbd>
          </button>

          <div className="relative flex-1 md:w-56 lg:w-64">
            <select
              value={selectedProvince?.Provinsi || ""}
              onChange={(e) => {
                const found = provinces.find((p) => p.Provinsi === e.target.value);
                if (found) onSelectProvince(found);
              }}
              className="w-full px-3.5 py-1.5 rounded-full bg-[#EDF4F9] border-2 border-[#001D39] text-xs font-bold text-[#001D39] focus:outline-none focus:bg-white shadow-[2px_2px_0px_#001D39]"
            >
              <option value="">-- Pilih Provinsi Langsung --</option>
              {provinces.map((p) => (
                <option key={p.Provinsi} value={p.Provinsi}>
                  #{p.peringkat} {p.Provinsi} ({p.nama_klaster})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Clean Map (Left 8 cols) + Dedicated Hover/Spatial Panel (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Unobstructed Vector Map with Focused Zoom */}
        <div className="lg:col-span-8 flex flex-col">
          <DynamicChoroplethMap
            geoData={geoData}
            provinces={provinces}
            selectedProvince={selectedProvince}
            onSelectProvince={onSelectProvince}
            layerMode={layerMode}
            hoveredProvince={hoveredProvince}
            onHoverProvince={setHoveredProvince}
            showProjections={showProjections}
            onToggleProjections={() => setShowProjections(!showProjections)}
            resetTrigger={resetTrigger}
            zoomTrigger={zoomTrigger}
            onOpenShortcuts={() => setShowShortcutsModal(true)}
          />
        </div>

        {/* Right: Dedicated Segment for Hovered Province & Spatial Projections (No Map Overlap!) */}
        <div className="lg:col-span-4 min-h-0 lg:min-h-[560px]">
          <SpatialProjectionPanel
            province={activeProvince}
            isHovered={!!hoveredProvince}
            allProvinces={provinces}
            showProjections={showProjections}
            onToggleProjections={() => setShowProjections(!showProjections)}
            onSelectProvince={onSelectProvince}
          />
        </div>
      </div>

      {/* Lower Section: Full-Width Detailed Province Inspector Placed Below Map */}
      <div id="province-inspector-section" className="w-full pt-2">
        <ProvinceInspector province={selectedProvince} />
      </div>
    </section>
  );
}
