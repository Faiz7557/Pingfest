"use client";

import React, { useState } from "react";
import { Sliders, RotateCcw, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

export default function WhatIfSimulator() {
  const [bts, setBts] = useState(25);
  const [satria, setSatria] = useState(20);
  const [literasi, setLiterasi] = useState(20);
  const [subsidi, setSubsidi] = useState(15);

  const handleReset = () => {
    setBts(0);
    setSatria(0);
    setLiterasi(0);
    setSubsidi(0);
  };

  const handlePresetSigap = () => {
    setBts(35);
    setSatria(30);
    setLiterasi(25);
    setSubsidi(25);
  };

  const calcEkstrem = () => {
    const delta =
      (bts / 50) * 8.5 +
      (satria / 50) * 7.0 +
      (literasi / 50) * 3.2 +
      (subsidi / 50) * 6.8;
    return Number((24.7 + delta).toFixed(1));
  };

  const calcTertinggal = () => {
    const delta =
      (bts / 50) * 5.2 +
      (satria / 50) * 2.8 +
      (literasi / 50) * 4.6 +
      (subsidi / 50) * 3.4;
    return Number((66.6 + delta).toFixed(1));
  };

  const calcBerkembang = () => {
    const delta =
      (bts / 50) * 2.5 +
      (satria / 50) * 1.2 +
      (literasi / 50) * 4.8 +
      (subsidi / 50) * 1.5;
    return Number((68.2 + delta).toFixed(1));
  };

  const calcMaju = () => {
    const delta =
      (bts / 50) * 1.0 +
      (satria / 50) * 0.5 +
      (literasi / 50) * 2.5 +
      (subsidi / 50) * 0.5;
    return Number((79.1 + delta).toFixed(1));
  };

  const simEkstrem = calcEkstrem();
  const simTertinggal = calcTertinggal();
  const simBerkembang = calcBerkembang();
  const simMaju = calcMaju();

  const currentGap = 79.1 - 24.7;
  const simulatedGap = Number((simMaju - simEkstrem).toFixed(1));
  const gapReduction = Number((currentGap - simulatedGap).toFixed(1));
  const citizensConnectedJuta = Number(((simEkstrem - 24.7) * 0.85 + (simTertinggal - 66.6) * 1.8).toFixed(1));

  return (
    <div id="simulator-section" className="pingfest-card p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#001D39]/10 pb-3">
        <div>
          <h3 className="text-base font-black text-[#001D39] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#4E8EA2]" />
            Simulator Kebijakan Intervensi &ldquo;What-If&rdquo;
          </h3>
          <p className="text-xs text-[#49769F] font-medium">
            Geser tuas kebijakan untuk mensimulasikan dampak investasi fisik dan peningkatan SDM terhadap penutupan jurang digital.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePresetSigap}
            className="pingfest-btn px-4 py-1.5 bg-[#7BBDE8] text-[#001D39] text-xs font-black"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Preset Optimal SIGAP
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-[#EDF4F9] border-2 border-[#001D39] text-xs font-bold text-[#001D39] transition-all flex items-center gap-1 shadow-[2px_2px_0px_#001D39] cursor-pointer"
            title="Reset ke kondisi awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sliders Column */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* Slider 1: BTS 4G */}
          <div className="p-3.5 rounded-2xl bg-[#EDF4F9] border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-black text-[#001D39]">
                📡 Penambahan Menara BTS 4G Daerah 3T
              </span>
              <span className="font-mono font-black text-[#001D39] bg-white border border-[#001D39] px-2.5 py-0.5 rounded-full shadow-[1px_1px_0px_#001D39]">
                +{bts}% kapasitas
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={bts}
              onChange={(e) => setBts(Number(e.target.value))}
              className="w-full accent-[#001D39] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#49769F] font-semibold">
              <span>Status Quo (0%)</span>
              <span>Target Maksimal (+50%)</span>
            </div>
          </div>

          {/* Slider 2: SATRIA-1 */}
          <div className="p-3.5 rounded-2xl bg-[#EDF4F9] border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-black text-[#001D39]">
                🛰️ Pemanfaatan Satelit VHTS SATRIA-1
              </span>
              <span className="font-mono font-black text-[#001D39] bg-white border border-[#001D39] px-2.5 py-0.5 rounded-full shadow-[1px_1px_0px_#001D39]">
                +{satria}% titik
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={satria}
              onChange={(e) => setSatria(Number(e.target.value))}
              className="w-full accent-[#001D39] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#49769F] font-semibold">
              <span>Eksisting 30.000 titik</span>
              <span>Ekspansi +50% fasilitas</span>
            </div>
          </div>

          {/* Slider 3: Literasi */}
          <div className="p-3.5 rounded-2xl bg-[#EDF4F9] border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-black text-[#001D39]">
                🎓 Pelatihan Literasi Digital & SDM Desa
              </span>
              <span className="font-mono font-black text-[#10B981] bg-white border border-[#001D39] px-2.5 py-0.5 rounded-full shadow-[1px_1px_0px_#001D39]">
                +{literasi}% intensitas
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={literasi}
              onChange={(e) => setLiterasi(Number(e.target.value))}
              className="w-full accent-[#10B981] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#49769F] font-semibold">
              <span>Pelatihan reguler</span>
              <span>Kurikulum Digital Terpadu (+50%)</span>
            </div>
          </div>

          {/* Slider 4: Subsidi Gawai */}
          <div className="p-3.5 rounded-2xl bg-[#EDF4F9] border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-black text-[#001D39]">
                📱 Subsidi Gawai Terjangkau & PLTS Mikro Komunal
              </span>
              <span className="font-mono font-black text-[#F59E0B] bg-white border border-[#001D39] px-2.5 py-0.5 rounded-full shadow-[1px_1px_0px_#001D39]">
                +{subsidi}% kuota
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={subsidi}
              onChange={(e) => setSubsidi(Number(e.target.value))}
              className="w-full accent-[#F59E0B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#49769F] font-semibold">
              <span>Tanpa subsidi gawai</span>
              <span>Subsidi masif 3T (+50%)</span>
            </div>
          </div>
        </div>

        {/* Real-Time Impact Preview */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-white border-2 border-[#001D39] shadow-[4px_4px_0px_#001D39] flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-black text-[#001D39] uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              Proyeksi Dampak Simulasi Real-Time
            </div>

            {/* Impact Metric Cards */}
            <div className="grid grid-cols-2 gap-2.5 mb-3.5">
              <div className="p-3 rounded-2xl bg-[#EDF4F9] border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39]">
                <div className="text-[10px] font-bold text-[#49769F]">Penyusutan Jurang</div>
                <div className="text-xl font-black text-[#10B981]">
                  -{gapReduction} Poin
                </div>
                <div className="text-[10px] text-[#0A4174] font-semibold">
                  Dari 54,4 &rarr; <strong>{simulatedGap}</strong> poin
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#EDF4F9] border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39]">
                <div className="text-[10px] font-bold text-[#49769F]">Warga Terkoneksi Baru</div>
                <div className="text-xl font-black text-[#0284C7]">
                  +{citizensConnectedJuta} Juta
                </div>
                <div className="text-[10px] text-[#0A4174] font-semibold">Populasi terangkat</div>
              </div>
            </div>

            {/* Progress Bars per Cluster */}
            <div className="space-y-2.5 text-xs font-bold">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#EF4444]">Tertinggal Ekstrem</span>
                  <span className="font-mono text-[#001D39]">
                    24,7% &rarr; <span className="text-[#10B981]">{simEkstrem}%</span>
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#EDF4F9] border border-[#001D39] overflow-hidden p-[1px]">
                  <div
                    className="h-full bg-[#EF4444] rounded-full transition-all duration-300"
                    style={{ width: `${simEkstrem}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#F59E0B]">Tertinggal Sedang</span>
                  <span className="font-mono text-[#001D39]">
                    66,6% &rarr; <span className="text-[#10B981]">{simTertinggal}%</span>
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#EDF4F9] border border-[#001D39] overflow-hidden p-[1px]">
                  <div
                    className="h-full bg-[#F59E0B] rounded-full transition-all duration-300"
                    style={{ width: `${simTertinggal}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#0284C7]">Berkembang Menengah</span>
                  <span className="font-mono text-[#001D39]">
                    68,2% &rarr; <span className="text-[#10B981]">{simBerkembang}%</span>
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#EDF4F9] border border-[#001D39] overflow-hidden p-[1px]">
                  <div
                    className="h-full bg-[#7BBDE8] rounded-full transition-all duration-300"
                    style={{ width: `${simBerkembang}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#10B981]">Maju dan Terhubung</span>
                  <span className="font-mono text-[#001D39]">
                    79,1% &rarr; <span className="text-[#10B981]">{simMaju}%</span>
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#EDF4F9] border border-[#001D39] overflow-hidden p-[1px]">
                  <div
                    className="h-full bg-[#10B981] rounded-full transition-all duration-300"
                    style={{ width: `${simMaju}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#BDD8E9] border-2 border-[#001D39] text-[11px] text-[#001D39] leading-snug font-medium shadow-[2px_2px_0px_#001D39]">
            💡 <strong className="font-black">Rekomendasi SIGAP:</strong> Klaster Tertinggal Ekstrem memiliki elastisitas intervensi tertinggi. Kebijakan afirmatif terarah pada intensitas 25–35% mampu memangkas jurang kesenjangan digital nasional hingga lebih dari 30%.
          </div>
        </div>
      </div>
    </div>
  );
}
