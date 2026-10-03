"use client";

import React from "react";
import { ProvinceData } from "@/lib/types";
import { CLUSTER_COLORS } from "@/lib/constants";
import { Crown, TrendingUp, ShieldAlert, AlertOctagon } from "lucide-react";

interface ClusterCardsProps {
  provinces: ProvinceData[];
  onSelectProvince: (prov: ProvinceData) => void;
}

export default function ClusterCards({ provinces, onSelectProvince }: ClusterCardsProps) {
  const clusters = [
    {
      id: 2,
      name: "Maju dan Terhubung",
      title: "Sang Juara Digital",
      icon: Crown,
      color: CLUSTER_COLORS["Maju dan Terhubung"],
      badgeBg: "#10B981",
      bars: { akses: 4, sdm: 4, ekonomi: 4 },
      desc: "Infrastruktur prima, penetrasi ponsel 72–84%, IPM >74, dan kapasitas fiskal tinggi. Berperan sebagai lokomotif ekonomi digital nasional.",
      provList: provinces.filter(p => p.nama_klaster === "Maju dan Terhubung")
    },
    {
      id: 3,
      name: "Berkembang Menengah",
      title: "Pengejar yang Menjanjikan",
      icon: TrendingUp,
      color: CLUSTER_COLORS["Berkembang Menengah"],
      badgeBg: "#7BBDE8",
      bars: { akses: 3, sdm: 3, ekonomi: 2 },
      desc: "Konektivitas stabil (64–71%) dan modal manusia kompeten, namun akselerasi ekonomi digital produktif masih perlu dipacu.",
      provList: provinces.filter(p => p.nama_klaster === "Berkembang Menengah")
    },
    {
      id: 1,
      name: "Tertinggal Sedang",
      title: "Mayoritas yang Tertahan",
      icon: ShieldAlert,
      color: CLUSTER_COLORS["Tertinggal Sedang"],
      badgeBg: "#F59E0B",
      bars: { akses: 3, sdm: 2, ekonomi: 2 },
      desc: "Kelompok mayoritas (22 provinsi). Sinyal 4G tersedia namun kualitas fluktuatif serta daya beli perangkat masyarakat masih terbatas.",
      provList: provinces.filter(p => p.nama_klaster === "Tertinggal Sedang")
    },
    {
      id: 0,
      name: "Tertinggal Ekstrem",
      title: "Terputus dari Sinyal",
      icon: AlertOctagon,
      color: CLUSTER_COLORS["Tertinggal Ekstrem"],
      badgeBg: "#EF4444",
      bars: { akses: 1, sdm: 1, ekonomi: 2 },
      desc: "Papua Tengah & Papua Pegunungan. Penetrasi ponsel sangat rendah (15–34%) akibat isolasi geografis dan keterbatasan jaringan terestrial.",
      provList: provinces.filter(p => p.nama_klaster === "Tertinggal Ekstrem")
    }
  ];

  const renderDots = (count: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full border border-[#001D39] ${
              i <= count ? "bg-[#EF4444]" : "bg-[#BDD8E9]"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="w-full space-y-4">
      {/* Section Header & Statistical Chips */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-[#001D39]/10 pb-3">
        <div>
          <h2 className="text-xl font-black text-[#001D39] tracking-tight flex items-center gap-2">
            Tipologi 4 Klaster Kesiapan Digital
          </h2>
          <p className="text-xs text-[#49769F] font-medium">
            Hasil segmentasi K-Means (Silhouette 0,424; DBI 0,678) berdasarkan kombinasi 5 dimensi spasial BPS 2024
          </p>
        </div>

        {/* Statistical Chips from Infographic */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <div className="px-3 py-1 rounded-full bg-white border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] text-[#001D39] font-mono font-bold">
            <span className="text-[#49769F]">Moran&apos;s I:</span> 0,406
          </div>
          <div className="px-3 py-1 rounded-full bg-white border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] text-[#001D39] font-mono font-bold">
            <span className="text-[#49769F]">R² Model:</span> 0,832 - 0,915
          </div>
          <div className="px-3 py-1 rounded-full bg-white border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] text-[#001D39] font-mono font-bold">
            <span className="text-[#49769F]">AICc:</span> 229,6
          </div>
          <div className="px-3 py-1 rounded-full bg-white border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] text-[#001D39] font-mono font-bold">
            <span className="text-[#49769F]">Silhouette:</span> 0,424
          </div>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {clusters.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              className="pingfest-card p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-xl border-2 border-[#001D39] flex items-center justify-center shadow-[2px_2px_0px_#001D39]"
                      style={{ backgroundColor: c.badgeBg, color: "#001D39" }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-[#49769F]">
                        {c.name}
                      </div>
                      <h3 className="text-sm font-black text-[#001D39]">&ldquo;{c.title}&rdquo;</h3>
                    </div>
                  </div>
                  <span
                    className="text-xs font-black px-2.5 py-0.5 rounded-full border border-[#001D39]"
                    style={{ backgroundColor: `${c.badgeBg}30`, color: "#001D39" }}
                  >
                    {c.provList.length} Prov
                  </span>
                </div>

                <p className="text-[11px] text-[#0A4174] leading-relaxed mb-3 font-medium">
                  {c.desc}
                </p>

                {/* Rating Dots */}
                <div className="space-y-1.5 bg-[#EDF4F9] p-3 rounded-2xl border-1.5 border-[#001D39] mb-3 text-[11px] font-bold">
                  <div className="flex items-center justify-between">
                    <span className="text-[#001D39]">📶 Akses Digital:</span>
                    {renderDots(c.bars.akses)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#001D39]">🎓 Kualitas SDM:</span>
                    {renderDots(c.bars.sdm)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#001D39]">💰 Kekuatan Ekonomi:</span>
                    {renderDots(c.bars.ekonomi)}
                  </div>
                </div>

                {/* Province Pill List */}
                <div>
                  <div className="text-[10px] uppercase font-black text-[#49769F] tracking-wider mb-1.5">
                    Anggota Wilayah:
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                    {c.provList.map((p) => (
                      <button
                        key={p.Provinsi}
                        onClick={() => onSelectProvince(p)}
                        className="px-2 py-0.5 rounded-lg bg-white hover:bg-[#7BBDE8] text-[#001D39] text-[10px] font-bold border border-[#001D39] shadow-[1px_1px_0px_#001D39] transition-all cursor-pointer truncate max-w-[130px]"
                        title={`Pilih ${p.Provinsi}`}
                      >
                        {p.Provinsi}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
