"use client";

import React from "react";
import { Smartphone, Users, ArrowUpRight, TrendingUp, AlertTriangle } from "lucide-react";

export default function KpiCards() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="pingfest-card p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#49769F]">
              Kesiapan Digital Nasional
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#BDD8E9] border-2 border-[#001D39] flex items-center justify-center text-[#001D39] shadow-[2px_2px_0px_#001D39]">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-[#001D39]">66,7%</span>
            <span className="text-xs font-bold text-[#4E8EA2]">Rata-rata Penetrasi</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#0A4174] bg-[#EDF4F9] px-3 py-1.5 rounded-xl border-1.5 border-[#001D39]/20 font-medium">
            <span className="font-black text-[#EF4444]">13 dari 38</span>
            <span>provinsi di bawah rata-rata nasional</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="pingfest-card p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#49769F]">
              Disparitas Kota vs Desa
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/20 border-2 border-[#001D39] flex items-center justify-center text-[#001D39] shadow-[2px_2px_0px_#001D39]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-[#001D39]">±57 Juta</span>
            <span className="text-xs font-bold text-[#F59E0B]">Penduduk Terisolasi</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#0A4174] bg-[#EDF4F9] px-3 py-1.5 rounded-xl border-1.5 border-[#001D39]/20 font-medium">
            <span>Kota: <strong>8,99%</strong></span>
            <span className="text-[#49769F]">vs</span>
            <span>Desa: <strong className="text-[#EF4444]">18,40%</strong></span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="pingfest-card p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#49769F]">
              Kesenjangan Antarwilayah
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#EF4444]/20 border-2 border-[#001D39] flex items-center justify-center text-[#001D39] shadow-[2px_2px_0px_#001D39]">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-[#EF4444]">67,7 Poin</span>
            <span className="text-xs font-bold text-[#49769F]">Disparitas Ekstrem</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#0A4174] bg-[#EDF4F9] px-3 py-1.5 rounded-xl border-1.5 border-[#001D39]/20 font-medium">
            <span className="truncate">DKI Jakarta (83,4%)</span>
            <span className="text-[#EF4444] font-bold">vs</span>
            <span className="truncate">Papua Peg. (15,8%)</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="pingfest-card p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#49769F]">
              Proyeksi QRIS (Des 2026)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#10B981]/20 border-2 border-[#001D39] flex items-center justify-center text-[#001D39] shadow-[2px_2px_0px_#001D39]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-[#10B981]">Rp 114,8 T</span>
            <span className="text-xs font-bold text-[#49769F]">/ bulan</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-[#0A4174] bg-[#EDF4F9] px-3 py-1.5 rounded-xl border-1.5 border-[#001D39]/20 font-medium">
            <span className="flex items-center gap-1 text-[#10B981] font-bold">
              <ArrowUpRight className="w-3.5 h-3.5" /> +113,3% vs 2024
            </span>
            <span className="text-[#49769F] font-bold">MAPE 3,97%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
