"use client";

import React from "react";
import { Share2, Zap, Info } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function SpilloverViz() {
  const decompositionData = [
    {
      variabel: "Lama Sekolah (RLS)",
      langsung: 0.43,
      spillover: 6.13,
      spilloverPct: "93,5%"
    },
    {
      variabel: "Ekonomi PDRB",
      langsung: 4.26,
      spillover: 4.31,
      spilloverPct: "50,3%"
    },
    {
      variabel: "IPM",
      langsung: 1.81,
      spillover: -0.68,
      spilloverPct: "Lokal"
    }
  ];

  return (
    <div className="pingfest-card p-5 flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#001D39]/10 pb-3">
        <div>
          <h3 className="text-base font-black text-[#001D39] flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#4E8EA2]" />
            Efek Limpahan Spasial (Spillover Effect)
          </h3>
          <p className="text-xs text-[#49769F] font-medium">
            Pemodelan ekonometrika Spatial Durbin Model (SDM) membuktikan investasi digital berdampak melintasi batas administratif wilayah.
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-[#10B981]/20 border-2 border-[#001D39] text-xs text-[#001D39] font-black font-mono shadow-[2px_2px_0px_#001D39]">
          Moran&apos;s I = 0,406 (p=0,001)
        </div>
      </div>

      {/* Narrative & Key Insight Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left: Bar Chart */}
        <div className="md:col-span-7 h-56">
          <div className="text-[11px] font-black text-[#49769F] uppercase tracking-wider mb-1">
            Dekomposisi Efek Langsung vs Limpahan (SDM Model)
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={decompositionData}
              layout="vertical"
              margin={{ top: 5, right: 15, left: 0, bottom: 5 }}
            >
              <CartesianGrid stroke="#001D39" strokeDasharray="3 3" opacity={0.1} horizontal={false} />
              <XAxis type="number" tick={{ fill: "#001D39", fontSize: 10, fontWeight: 600 }} />
              <YAxis
                dataKey="variabel"
                type="category"
                tick={{ fill: "#001D39", fontSize: 10, fontWeight: 700 }}
                width={95}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#001D39",
                  borderWidth: "2px",
                  borderRadius: "0.75rem",
                  boxShadow: "3px 3px 0px #001D39",
                  color: "#001D39",
                  fontSize: "11px",
                  fontWeight: 600
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px" }}
                formatter={(val) => <span className="text-[#001D39] font-bold">{val === "langsung" ? "Efek Langsung" : "Efek Limpahan (Spillover)"}</span>}
              />
              <Bar dataKey="langsung" fill="#7BBDE8" stroke="#001D39" strokeWidth={1.5} stackId="a" />
              <Bar dataKey="spillover" fill="#10B981" stroke="#001D39" strokeWidth={1.5} stackId="a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Key Spatially-Driven Findings */}
        <div className="md:col-span-5 space-y-2.5">
          <div className="p-3 rounded-2xl bg-[#EDF4F9] border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39]">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#001D39] mb-1">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <span>93,5% Pengaruh Pendidikan Bersifat Limpahan</span>
            </div>
            <p className="text-[11px] text-[#0A4174] leading-relaxed font-medium">
              Peningkatan rata-rata lama sekolah di suatu provinsi mendorong adopsi teknologi di provinsi tetangga melalui mobilitas tenaga kerja dan jejaring pasar antarwilayah.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39]">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#001D39] mb-1">
              <Info className="w-4 h-4 text-[#4E8EA2]" />
              <span>Implikasi Kebijakan Regional</span>
            </div>
            <p className="text-[11px] text-[#0A4174] leading-relaxed font-medium">
              Penguatan infrastruktur pada kota simpul (*hub* seperti Makassar atau Surabaya) melipatgandakan kesiapan digital pulau sekitarnya secara efisien melalui integrasi koridor ekonomi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
