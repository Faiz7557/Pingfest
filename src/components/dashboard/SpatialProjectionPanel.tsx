"use client";

import React, { useMemo } from "react";
import { ProvinceData } from "@/lib/types";
import { CLUSTER_COLORS } from "@/lib/constants";
import { getSpatialRelations, SpatialRelationsResult } from "@/lib/spatialRelations";
import {
  MapPin,
  Share2,
  Smartphone,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  ArrowDown,
  Compass,
  CheckCircle2
} from "lucide-react";

interface SpatialProjectionPanelProps {
  province: ProvinceData | null;
  isHovered: boolean;
  allProvinces: ProvinceData[];
  showProjections: boolean;
  onToggleProjections: () => void;
  onSelectProvince: (prov: ProvinceData) => void;
}

export default function SpatialProjectionPanel({
  province,
  isHovered,
  allProvinces,
  showProjections,
  onToggleProjections,
  onSelectProvince
}: SpatialProjectionPanelProps) {
  const activeRelations: SpatialRelationsResult | null = useMemo(() => {
    if (!province || allProvinces.length === 0) return null;
    return getSpatialRelations(province, allProvinces, 4);
  }, [province, allProvinces]);

  if (!province) {
    return (
      <div className="pingfest-card-static p-6 h-full flex flex-col items-center justify-center text-center bg-white space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#BDD8E9] border-2 border-[#001D39] flex items-center justify-center text-[#001D39] shadow-[2px_2px_0px_#001D39]">
          <Compass className="w-6 h-6 animate-spin" />
        </div>
        <h4 className="text-base font-black text-[#001D39]">Sorot Wilayah pada Peta</h4>
        <p className="text-xs text-[#49769F] max-w-xs font-medium leading-relaxed">
          Arahkan kursor ke pulau atau provinsi mana pun di peta untuk melihat metrik instan dan memproyeksikan jejaring keterkaitan spasialnya di sini.
        </p>
      </div>
    );
  }

  const clusterColor = CLUSTER_COLORS[province.nama_klaster] || "#BDD8E9";

  const handleScrollToInspector = () => {
    const el = document.getElementById("province-inspector-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="pingfest-card-static p-5 h-full flex flex-col justify-between bg-white space-y-4 shadow-[4px_4px_0px_#001D39]">
      {/* Top Header: Status Indicator & Province Title */}
      <div className="space-y-3 border-b-2 border-[#001D39]/10 pb-3">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black border transition-all ${
              isHovered
                ? "bg-[#7BBDE8] text-[#001D39] border-[#001D39] shadow-[1px_1px_0px_#001D39] animate-pulse"
                : "bg-[#EDF4F9] text-[#49769F] border-[#001D39]/30"
            }`}
          >
            <span>{isHovered ? "🔍 Pratinjau Kursor" : "📍 Wilayah Terpilih"}</span>
          </span>

          <span
            className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#001D39] shadow-[1px_1px_0px_#001D39]"
            style={{ backgroundColor: clusterColor, color: "#001D39" }}
          >
            {province.nama_klaster}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-5 h-5 text-[#001D39] flex-shrink-0" />
            <h3 className="text-xl font-black text-[#001D39] tracking-tight">
              {province.Provinsi}
            </h3>
          </div>
          <div className="text-xs font-bold text-[#49769F] mt-0.5">
            Peringkat #{province.peringkat} Kerentanan Digital Nasional
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-[#EDF4F9] border border-[#001D39]/20 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#001D39] flex-shrink-0" />
          <div>
            <div className="text-[9px] font-bold text-[#49769F] uppercase">Akses HP</div>
            <div className="text-sm font-black text-[#001D39]">
              {province.hp_seluler_2024.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#EDF4F9] border border-[#001D39]/20 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-[#001D39] flex-shrink-0" />
          <div>
            <div className="text-[9px] font-bold text-[#49769F] uppercase">IPM 2024</div>
            <div className="text-sm font-black text-[#001D39]">
              {province.ipm_2024.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#EDF4F9] border border-[#001D39]/20 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#001D39] flex-shrink-0" />
          <div>
            <div className="text-[9px] font-bold text-[#49769F] uppercase">PDRB / Kap</div>
            <div className="text-sm font-black text-[#001D39]">
              Rp {(province.pdrb_kapita_2024 / 1000).toFixed(1)} jt
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#EF4444]/15 border border-[#001D39]/20 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#EF4444] flex-shrink-0" />
          <div>
            <div className="text-[9px] font-bold text-[#EF4444] uppercase">Kerentanan</div>
            <div className="text-sm font-black text-[#EF4444]">
              {province.indeks_kerentanan.toFixed(3)}
            </div>
          </div>
        </div>
      </div>

      {/* Spatial Projections Section (W KNN k=4) */}
      {activeRelations && (
        <div className="p-3.5 rounded-2xl bg-[#EDF4F9]/70 border-1.5 border-[#001D39] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#001D39]">
              <Share2 className="w-3.5 h-3.5 text-[#0A4174]" />
              <span>Garis Proyeksi Spasial (W KNN k=4)</span>
            </div>
            <button
              onClick={onToggleProjections}
              className={`text-[9px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                showProjections
                  ? "bg-[#7BBDE8] text-[#001D39] border-[#001D39]"
                  : "bg-white text-[#49769F] border-[#001D39]/30"
              }`}
            >
              {showProjections ? "🟢 Aktif" : "⚪ Nonaktif"}
            </button>
          </div>

          <p className="text-[10px] text-[#49769F] font-medium leading-snug">
            Wilayah terhubung pada matriks autokorelasi spasial berdasarkan bobot kedekatan geografis:
          </p>

          {/* Connected Neighbor Badges */}
          <div className="flex flex-wrap gap-1.5">
            {activeRelations.knnNeighbors.map((n) => (
              <button
                key={n.provinsi}
                onClick={() => {
                  const targetProv = allProvinces.find((p) => p.Provinsi === n.provinsi);
                  if (targetProv) onSelectProvince(targetProv);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-[#001D39] text-xs font-bold text-[#001D39] shadow-[1.5px_1.5px_0px_#001D39] hover:bg-[#7BBDE8] hover:translate-x-0.5 transition-all cursor-pointer"
                title={`Klik untuk memilih ${n.provinsi}`}
              >
                <span>{n.provinsi}</span>
                <span className="text-[10px] text-[#49769F] font-mono font-normal">
                  {n.distanceKm} km
                </span>
              </button>
            ))}
          </div>

          {/* Same Cluster Cohort */}
          {activeRelations.clusterPeers.length > 0 && (
            <div className="pt-1 text-[10px] text-[#49769F] font-medium border-t border-[#001D39]/10">
              <span className="font-bold text-[#001D39]">Klaster Serupa: </span>
              {activeRelations.clusterPeers.map((p) => p.provinsi).slice(0, 3).join(", ")}
              {activeRelations.clusterPeers.length > 3 &&
                ` (+${activeRelations.clusterPeers.length - 3} lainnya)`}
            </div>
          )}
        </div>
      )}

      {/* Action to Jump to Deep Inspection */}
      <button
        onClick={handleScrollToInspector}
        className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#EDF4F9] border-1.5 border-[#001D39] text-xs font-black text-[#001D39] flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#001D39] transition-all cursor-pointer"
      >
        <span>Lihat Profil 5 Dimensi &amp; Rekomendasi Preskriptif</span>
        <ArrowDown className="w-3.5 h-3.5 text-[#0A4174]" />
      </button>
    </div>
  );
}
