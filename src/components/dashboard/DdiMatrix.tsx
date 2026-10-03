"use client";

import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { ProvinceData } from "@/lib/types";
import { CLUSTER_COLORS } from "@/lib/constants";
import { Grid, HelpCircle } from "lucide-react";

interface DdiMatrixProps {
  provinces: ProvinceData[];
  selectedProvince: ProvinceData | null;
  onSelectProvince: (prov: ProvinceData) => void;
}

export default function DdiMatrix({
  provinces,
  selectedProvince,
  onSelectProvince
}: DdiMatrixProps) {
  const medianInfra = 68.4;
  const medianSdm = 73.4;

  const scatterData = provinces.map((p) => ({
    name: p.Provinsi,
    x: p.hp_seluler_2024,
    y: p.ipm_2024,
    cluster: p.nama_klaster,
    color: CLUSTER_COLORS[p.nama_klaster] || "#7BBDE8",
    vulnerability: p.indeks_kerentanan,
    data: p
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white border-2 border-[#001D39] p-3 rounded-2xl shadow-[3px_3px_0px_#001D39] text-xs text-[#001D39]">
          <div className="font-black text-sm mb-1">{d.name}</div>
          <div className="text-[11px] font-bold text-[#49769F]">
            Klaster: <span style={{ color: d.color }}>{d.cluster}</span>
          </div>
          <div className="text-[11px] font-medium text-[#0A4174]">
            Akses Ponsel: <strong>{d.x.toFixed(1)}%</strong>
          </div>
          <div className="text-[11px] font-medium text-[#0A4174]">
            IPM: <strong>{d.y.toFixed(2)}</strong>
          </div>
          <div className="text-[10px] text-[#4E8EA2] font-bold mt-1">
            Klik untuk inspeksi provinsi ini &rarr;
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pingfest-card p-5 flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#001D39]/10 pb-3">
        <div>
          <h3 className="text-base font-black text-[#001D39] flex items-center gap-2">
            <Grid className="w-5 h-5 text-[#4E8EA2]" />
            Matriks DDI (Digital Divide Index) Dua Sumbu
          </h3>
          <p className="text-xs text-[#49769F] font-medium">
            Pemetaan Akses Fisik (Ponsel %) vs Kapasitas SDM (IPM) untuk membedakan kesenjangan konektivitas dari kesenjangan kapabilitas.
          </p>
        </div>
        <div className="text-[11px] px-3 py-1 rounded-full bg-[#EDF4F9] border-1.5 border-[#001D39] text-[#001D39] font-bold flex items-center gap-1 self-start sm:self-auto shadow-[1px_1px_0px_#001D39]">
          <HelpCircle className="w-3.5 h-3.5 text-[#4E8EA2]" />
          <span>Garis Putus = Median Nasional (Ponsel 68,4% • IPM 73,4)</span>
        </div>
      </div>

      {/* Matrix Scatter Chart */}
      <div className="w-full h-72 sm:h-80 lg:h-96 relative">
        <div className="hidden sm:block absolute top-2 left-10 text-[10px] font-black text-[#F59E0B] uppercase tracking-wider pointer-events-none bg-white/85 px-1.5 py-0.5 rounded border border-[#001D39]/20 shadow-xs">
          Kuadran I: Akselerasi Jaringan
        </div>
        <div className="hidden sm:block absolute top-2 right-4 text-[10px] font-black text-[#10B981] uppercase tracking-wider pointer-events-none bg-white/85 px-1.5 py-0.5 rounded border border-[#001D39]/20 shadow-xs">
          Kuadran II: Pemimpin Digital
        </div>
        <div className="hidden sm:block absolute bottom-10 left-10 text-[10px] font-black text-[#EF4444] uppercase tracking-wider pointer-events-none bg-white/85 px-1.5 py-0.5 rounded border border-[#001D39]/20 shadow-xs">
          Kuadran IV: Intervensi Terpadu
        </div>
        <div className="hidden sm:block absolute bottom-10 right-4 text-[10px] font-black text-[#0284C7] uppercase tracking-wider pointer-events-none bg-white/85 px-1.5 py-0.5 rounded border border-[#001D39]/20 shadow-xs">
          Kuadran III: Penguatan Literasi
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 15, bottom: 20, left: 0 }}>
            <CartesianGrid stroke="#001D39" strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              type="number"
              dataKey="x"
              name="Akses Ponsel (%)"
              domain={[10, 90]}
              tick={{ fill: "#001D39", fontSize: 10, fontWeight: 600 }}
              label={{
                value: "Akses Ponsel (%) →",
                position: "insideBottom",
                offset: -10,
                fill: "#001D39",
                fontSize: 11,
                fontWeight: 700
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="IPM"
              domain={[50, 86]}
              tick={{ fill: "#001D39", fontSize: 10, fontWeight: 600 }}
              width={42}
              label={{
                value: "IPM →",
                angle: -90,
                position: "insideLeft",
                offset: 12,
                fill: "#001D39",
                fontSize: 11,
                fontWeight: 700
              }}
            />
            <ZAxis type="number" range={[70, 70]} />
            <Tooltip content={<CustomTooltip />} />

            <ReferenceLine
              x={medianInfra}
              stroke="#001D39"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <ReferenceLine
              y={medianSdm}
              stroke="#001D39"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />

            <Scatter
              name="Provinsi"
              data={scatterData}
              onClick={(entry: any) => {
                if (entry && entry.data) {
                  onSelectProvince(entry.data);
                }
              }}
              className="cursor-pointer"
            >
              {scatterData.map((entry, index) => (
                <circle
                  key={`cell-${index}`}
                  cx={0}
                  cy={0}
                  r={selectedProvince?.Provinsi === entry.name ? 9 : 5.5}
                  fill={entry.color}
                  stroke="#001D39"
                  strokeWidth={selectedProvince?.Provinsi === entry.name ? 3 : 1.5}
                  className="transition-all hover:scale-125"
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Policy Quadrant Explanation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
        <div className="p-2.5 rounded-2xl bg-[#F59E0B]/10 border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39]">
          <div className="font-black text-[#F59E0B] text-[11px]">Kuadran I: Jaringan</div>
          <div className="text-[10px] text-[#0A4174] font-medium">SDM Siap, Jaringan Minim → Alokasi BTS 4G &amp; Satelit</div>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#10B981]/10 border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39]">
          <div className="font-black text-[#10B981] text-[11px]">Kuadran II: Pemimpin</div>
          <div className="text-[10px] text-[#0A4174] font-medium">SDM &amp; Akses Prima → Hub Inovasi Digital &amp; 5G Nasional</div>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#7BBDE8]/20 border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39]">
          <div className="font-black text-[#0284C7] text-[11px]">Kuadran III: Literasi</div>
          <div className="text-[10px] text-[#0A4174] font-medium">Akses Tersedia, Literasi Rendah → Pelatihan UMKM &amp; Edukasi</div>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#EF4444]/10 border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39]">
          <div className="font-black text-[#EF4444] text-[11px]">Kuadran IV: Terpadu</div>
          <div className="text-[10px] text-[#0A4174] font-medium">Tertinggal Komprehensif → Bantuan Fisik &amp; SDM Serentak</div>
        </div>
      </div>
    </div>
  );
}
