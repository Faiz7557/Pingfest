"use client";

import React from "react";
import TopNav from "@/components/layout/TopNav";
import ForecastSection from "@/components/dashboard/ForecastSection";
import { useSigapData } from "@/hooks/useSigapData";
import { Radio, BarChart3, CheckCircle, TrendingUp } from "lucide-react";

export default function ProyeksiPage() {
  const { qrisData, clusterProjData, loading } = useSigapData();

  if (loading || !qrisData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-[#001D39] space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#BDD8E9] border-2 border-[#001D39] shadow-[3px_3px_0px_#001D39] flex items-center justify-center animate-bounce">
          <Radio className="w-7 h-7 text-[#001D39]" />
        </div>
        <div className="text-base font-black tracking-tight">Memuat Modul Proyeksi & Peramalan...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <TopNav
        title="Proyeksi Masa Depan Kesiapan Digital & QRIS"
        subtitle="Analisis peramalan deret waktu transaksi QRIS Bank Indonesia 2026 dan lintasan kesenjangan 4 klaster menuju 2030."
      />

      {/* Main Forecast Section (Fan Chart + Cluster Curves) */}
      <ForecastSection
        qrisData={qrisData}
        clusterProjData={clusterProjData}
      />

      {/* Model Benchmark & Cross-Validation Table */}
      <div className="pingfest-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#001D39]/10 pb-3">
          <div>
            <h3 className="text-base font-black text-[#001D39] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#4E8EA2]" />
              Evaluasi & Perbandingan Akurasi Model Peramalan
            </h3>
            <p className="text-xs text-[#49769F] font-medium">
              Hasil <em>Rolling-Window Cross Validation</em> pada horizon peramalan 3 bulan dan 12 bulan
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#001D39] text-xs font-mono font-bold text-[#001D39]">
            Model Unggulan: SARIMA &amp; ETS (MAPE &lt; 4%)
          </span>
        </div>

        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full text-left text-xs min-w-[560px]">
            <thead>
              <tr className="border-b-2 border-[#001D39] text-[#001D39]">
                <th className="py-2.5 px-3 font-black">Algoritma / Model</th>
                <th className="py-2.5 px-3 font-black">Horizon (Bulan)</th>
                <th className="py-2.5 px-3 font-black">MAPE (%)</th>
                <th className="py-2.5 px-3 font-black">RMSE</th>
                <th className="py-2.5 px-3 font-black">SMAPE (%)</th>
                <th className="py-2.5 px-3 font-black">Status Kelayakan</th>
              </tr>
            </thead>
            <tbody className="divide-y border-b border-[#001D39]/10 text-[#0A4174]">
              {qrisData.cv_comparison?.map((m: any, idx: number) => {
                const isBest = m.mape < 4.0;
                return (
                  <tr key={idx} className={isBest ? "bg-[#10B981]/10 font-bold" : ""}>
                    <td className="py-2 px-3 text-[#001D39] font-black">{m.model}</td>
                    <td className="py-2 px-3 font-mono">{m.h} bln</td>
                    <td className="py-2 px-3 font-mono">
                      <span className={m.mape < 5 ? "text-[#10B981] font-bold" : "text-[#EF4444]"}>
                        {m.mape}%
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono">{m.rmse}</td>
                    <td className="py-2 px-3 font-mono">{m.smape}%</td>
                    <td className="py-2 px-3">
                      {isBest ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#10B981] font-black">
                          <CheckCircle className="w-3.5 h-3.5" /> Sangat Akurat (&lt;4%)
                        </span>
                      ) : m.mape < 10 ? (
                        <span className="text-[11px] text-[#0284C7] font-bold">Layak (&lt;10%)</span>
                      ) : (
                        <span className="text-[11px] text-[#EF4444] font-bold">Baseline Pembanding</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
