"use client";

import React, { useState } from "react";
import { DollarSign, Sparkles, CheckCircle2 } from "lucide-react";
import { ROI_EFFICIENCY } from "@/lib/constants";

export default function BudgetAllocator() {
  const [totalBudgetTriliun, setTotalBudgetTriliun] = useState(10);
  const [allocEkstrem, setAllocEkstrem] = useState(40);
  const [allocTertinggal, setAllocTertinggal] = useState(35);
  const [allocBerkembang, setAllocBerkembang] = useState(15);
  const [allocMaju, setAllocMaju] = useState(10);

  const totalAlloc = allocEkstrem + allocTertinggal + allocBerkembang + allocMaju;
  const isBalanced = totalAlloc === 100;

  const handleApplySigap = () => {
    setAllocEkstrem(40);
    setAllocTertinggal(35);
    setAllocBerkembang(15);
    setAllocMaju(10);
  };

  const handleEqualShare = () => {
    setAllocEkstrem(25);
    setAllocTertinggal(25);
    setAllocBerkembang(25);
    setAllocMaju(25);
  };

  const nominalEkstrem = (allocEkstrem / 100) * totalBudgetTriliun;
  const nominalTertinggal = (allocTertinggal / 100) * totalBudgetTriliun;
  const nominalBerkembang = (allocBerkembang / 100) * totalBudgetTriliun;
  const nominalMaju = (allocMaju / 100) * totalBudgetTriliun;

  const roiEkstrem = (nominalEkstrem * ROI_EFFICIENCY["Tertinggal Ekstrem"]).toFixed(1);
  const roiTertinggal = (nominalTertinggal * ROI_EFFICIENCY["Tertinggal Sedang"]).toFixed(1);
  const roiBerkembang = (nominalBerkembang * ROI_EFFICIENCY["Berkembang Menengah"]).toFixed(1);
  const roiMaju = (nominalMaju * ROI_EFFICIENCY["Maju dan Terhubung"]).toFixed(1);

  return (
    <div className="pingfest-card p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#001D39]/10 pb-3">
        <div>
          <h3 className="text-base font-black text-[#001D39] flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#10B981]" />
            Alokasi Anggaran Presisi & Kalkulator ROI Digital
          </h3>
          <p className="text-xs text-[#49769F] font-medium">
            Simulasi distribusi anggaran infrastruktur telekomunikasi USO/APBN untuk memaksimalkan dampak per rupiah (*marginal digital return*).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap pt-1 sm:pt-0">
          <button
            onClick={handleApplySigap}
            className="pingfest-btn px-3.5 py-1.5 bg-[#10B981] text-[#001D39] text-[11px] sm:text-xs font-black"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Alokasi Optimal SIGAP
          </button>
          <button
            onClick={handleEqualShare}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-[#EDF4F9] border-2 border-[#001D39] text-[11px] sm:text-xs font-bold text-[#001D39] transition-all cursor-pointer shadow-[2px_2px_0px_#001D39]"
          >
            Bagi Rata (25% per klaster)
          </button>
        </div>
      </div>

      {/* Total Budget Setting & Balance Alert */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#EDF4F9] border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] text-xs">
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          <span className="text-[#001D39] font-bold">Pagu Anggaran Simulasi:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTotalBudgetTriliun(Math.max(2, totalBudgetTriliun - 2))}
              className="w-8 h-8 rounded-xl bg-white border-2 border-[#001D39] hover:bg-[#BDD8E9] text-[#001D39] font-black flex items-center justify-center cursor-pointer shadow-[1px_1px_0px_#001D39] active:scale-95"
            >
              -
            </button>
            <span className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-[#001D39] font-mono font-black text-[#001D39] text-xs sm:text-sm shadow-[1px_1px_0px_#001D39]">
              Rp {totalBudgetTriliun} Triliun
            </span>
            <button
              onClick={() => setTotalBudgetTriliun(Math.min(30, totalBudgetTriliun + 2))}
              className="w-8 h-8 rounded-xl bg-white border-2 border-[#001D39] hover:bg-[#BDD8E9] text-[#001D39] font-black flex items-center justify-center cursor-pointer shadow-[1px_1px_0px_#001D39] active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#001D39] font-bold">Total Alokasi:</span>
          <span
            className={`font-mono font-black px-3 py-1 rounded-full border-2 border-[#001D39] ${
              isBalanced
                ? "bg-[#10B981]/20 text-[#001D39]"
                : "bg-[#EF4444]/20 text-[#EF4444]"
            }`}
          >
            {totalAlloc}% / 100%
          </span>
          {isBalanced ? (
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
          ) : (
            <span className="text-[10px] text-[#EF4444] font-black">Sesuaikan hingga 100%</span>
          )}
        </div>
      </div>

      {/* 4 Allocators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Klaster 1: Ekstrem */}
        <div className="p-4 rounded-2xl bg-white border-2 border-[#001D39] shadow-[3px_3px_0px_#001D39] space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-black text-[#EF4444] tracking-wider">
                Prioritas Afirmatif
              </span>
              <h4 className="text-sm font-black text-[#001D39]">Tertinggal Ekstrem</h4>
            </div>
            <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-[#EF4444]/15 border border-[#001D39] text-[#001D39]">
              {allocEkstrem}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="70"
            value={allocEkstrem}
            onChange={(e) => setAllocEkstrem(Number(e.target.value))}
            className="w-full accent-[#EF4444] cursor-pointer"
          />

          <div className="pt-2 border-t border-[#001D39]/10 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[#49769F] font-medium">Pagu Dana:</span>
              <strong className="text-[#001D39] font-mono">Rp {nominalEkstrem.toFixed(1)} T</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#49769F] font-medium">Estimasi Kenaikan:</span>
              <strong className="text-[#10B981] font-mono font-black">+{roiEkstrem} poin</strong>
            </div>
            <div className="text-[10px] text-[#EF4444] font-black mt-1">
              Efisiensi: 4,26 poin / Rp T (Tertinggi)
            </div>
          </div>
        </div>

        {/* Klaster 2: Tertinggal Sedang */}
        <div className="p-4 rounded-2xl bg-white border-2 border-[#001D39] shadow-[3px_3px_0px_#001D39] space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-black text-[#F59E0B] tracking-wider">
                Pemerataan Mayoritas
              </span>
              <h4 className="text-sm font-black text-[#001D39]">Tertinggal Sedang</h4>
            </div>
            <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-[#F59E0B]/20 border border-[#001D39] text-[#001D39]">
              {allocTertinggal}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="70"
            value={allocTertinggal}
            onChange={(e) => setAllocTertinggal(Number(e.target.value))}
            className="w-full accent-[#F59E0B] cursor-pointer"
          />

          <div className="pt-2 border-t border-[#001D39]/10 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[#49769F] font-medium">Pagu Dana:</span>
              <strong className="text-[#001D39] font-mono">Rp {nominalTertinggal.toFixed(1)} T</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#49769F] font-medium">Estimasi Kenaikan:</span>
              <strong className="text-[#10B981] font-mono font-black">+{roiTertinggal} poin</strong>
            </div>
            <div className="text-[10px] text-[#F59E0B] font-black mt-1">
              Efisiensi: 1,57 poin / Rp T
            </div>
          </div>
        </div>

        {/* Klaster 3: Berkembang Menengah */}
        <div className="p-4 rounded-2xl bg-white border-2 border-[#001D39] shadow-[3px_3px_0px_#001D39] space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-black text-[#0284C7] tracking-wider">
                Akselerasi Ekonomi
              </span>
              <h4 className="text-sm font-black text-[#001D39]">Berkembang Menengah</h4>
            </div>
            <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-[#7BBDE8]/20 border border-[#001D39] text-[#001D39]">
              {allocBerkembang}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="70"
            value={allocBerkembang}
            onChange={(e) => setAllocBerkembang(Number(e.target.value))}
            className="w-full accent-[#7BBDE8] cursor-pointer"
          />

          <div className="pt-2 border-t border-[#001D39]/10 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[#49769F] font-medium">Pagu Dana:</span>
              <strong className="text-[#001D39] font-mono">Rp {nominalBerkembang.toFixed(1)} T</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#49769F] font-medium">Estimasi Kenaikan:</span>
              <strong className="text-[#10B981] font-mono font-black">+{roiBerkembang} poin</strong>
            </div>
            <div className="text-[10px] text-[#0284C7] font-black mt-1">
              Efisiensi: 1,15 poin / Rp T
            </div>
          </div>
        </div>

        {/* Klaster 4: Maju */}
        <div className="p-4 rounded-2xl bg-white border-2 border-[#001D39] shadow-[3px_3px_0px_#001D39] space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-black text-[#10B981] tracking-wider">
                Inovasi & 5G
              </span>
              <h4 className="text-sm font-black text-[#001D39]">Maju dan Terhubung</h4>
            </div>
            <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-[#10B981]/20 border border-[#001D39] text-[#001D39]">
              {allocMaju}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="70"
            value={allocMaju}
            onChange={(e) => setAllocMaju(Number(e.target.value))}
            className="w-full accent-[#10B981] cursor-pointer"
          />

          <div className="pt-2 border-t border-[#001D39]/10 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[#49769F] font-medium">Pagu Dana:</span>
              <strong className="text-[#001D39] font-mono">Rp {nominalMaju.toFixed(1)} T</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#49769F] font-medium">Estimasi Kenaikan:</span>
              <strong className="text-[#10B981] font-mono font-black">+{roiMaju} poin</strong>
            </div>
            <div className="text-[10px] text-[#10B981] font-black mt-1">
              Efisiensi: 0,80 poin / Rp T (Saturasi)
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Takeaway Banner */}
      <div className="p-3.5 rounded-2xl bg-[#BDD8E9] border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] text-xs text-[#001D39] flex items-start gap-2.5 font-medium">
        <Sparkles className="w-5 h-5 text-[#001D39] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-black">Hukum Hasil Tambahan yang Menurun (*Law of Diminishing Returns*):</strong> Mengalokasikan dana ke wilayah berpenetrasi tinggi (Klaster Maju) hanya menghasilkan kenaikan marginal 0,80 poin persentase per Rp 1 Triliun karena mendekati titik jenuh. Sebaliknya, setiap Rp 1 Triliun yang dialokasikan secara terarah ke Klaster Tertinggal Ekstrem menghasilkan lonjakan hingga <strong>4,26 poin persentase</strong>. SIGAP membuktikan bahwa keadilan alokasi anggaran berbanding lurus dengan efisiensi dampak pembangunan nasional.
        </div>
      </div>
    </div>
  );
}
