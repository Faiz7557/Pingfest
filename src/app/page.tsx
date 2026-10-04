"use client";

import React from "react";
import Link from "next/link";
import Hero3DSection from "@/components/dashboard/Hero3DSection";
import KpiCards from "@/components/dashboard/KpiCards";
import MapSection from "@/components/dashboard/MapSection";
import ClusterCards from "@/components/dashboard/ClusterCards";
import { useSigapData } from "@/hooks/useSigapData";
import { Radio, ArrowRight, MapPin, TrendingUp, Sliders, Sparkles, Compass } from "lucide-react";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function Home() {
  const {
    provinces,
    geoData,
    selectedProvince,
    setSelectedProvince,
    loading
  } = useSigapData();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-[#001D39] space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#BDD8E9] border-2 border-[#001D39] shadow-[3px_3px_0px_#001D39] flex items-center justify-center animate-bounce">
          <Radio className="w-7 h-7 text-[#001D39]" />
        </div>
        <div className="text-base font-black tracking-tight">Memuat Data Spasial SIGAP...</div>
        <p className="text-xs text-[#49769F] font-medium">Menyiapkan analitik 38 provinsi, autokorelasi, dan model proyeksi</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* 3D Interactive Diorama Hero Scroll Entrance Section */}
      <ContainerScroll
        containerHeight="h-[52rem] sm:h-[58rem] md:h-[68rem]"
        cardHeight="h-[33rem] sm:h-[38rem] md:h-[44rem]"
        titleComponent={
          <div className="space-y-3.5">
            <div className="flex items-center justify-center flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BDD8E9] border-2 border-[#001D39] text-xs font-black text-[#001D39] shadow-[2px_2px_0px_#001D39]">
                <Radio className="w-3.5 h-3.5 text-[#001D39] animate-pulse" />
                <span>PLATFORM GEOSPASIAL KESIAPAN DIGITAL INDONESIA</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border-2 border-[#001D39] text-xs font-bold text-[#001D39] shadow-[2px_2px_0px_#001D39]">
                <Sparkles className="w-3.5 h-3.5 text-[#4E8EA2]" />
                <span>RPJPN 2025–2045</span>
              </span>
            </div>

            <h1 data-grid-avoid className="text-3xl sm:text-5xl md:text-6xl font-black text-[#001D39] tracking-tight leading-[1.05]">
              Memetakan Kesenjangan Menuju <br />
              <span className="text-[#0A4174] drop-shadow-xs">Indonesia Emas 2045</span>
            </h1>

            <p data-grid-avoid className="text-xs sm:text-sm text-[#49769F] font-bold max-w-2xl mx-auto leading-relaxed">
              SIGAP: Sistem Informasi Geospasial Akses Presisi — Digital Twin 3D 38 provinsi, autokorelasi spasial Moran&apos;s I, serta model prediksi kesiapan digital presisi (*AI memetakan, manusia memutuskan*).
            </p>

            <div className="flex items-center justify-center gap-3 pt-1">
              <Link
                href="/peta-analisis"
                className="pingfest-btn px-3.5 py-1.5 sm:px-4 sm:py-2 bg-white hover:bg-[#EDF4F9] text-[#001D39] text-xs font-black shadow-[2px_2px_0px_#001D39]"
              >
                <span>Buka Peta GIS 38 Provinsi</span>
              </Link>
              <Link
                href="/simulasi-kebijakan"
                className="pingfest-btn px-3.5 py-1.5 sm:px-4 sm:py-2 bg-[#7BBDE8] hover:bg-[#BDD8E9] text-[#001D39] text-xs font-black shadow-[2px_2px_0px_#001D39]"
              >
                <span>Uji Simulasi Kebijakan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        }
      >
        <Hero3DSection provinces={provinces} onSelectProvince={setSelectedProvince} embedded={true} />
      </ContainerScroll>

      {/* Executive Summary Cards */}
      <KpiCards />

      {/* Interactive Map Section with Inspector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-[#001D39] tracking-tight">
              Peta Kesiapan Digital 38 Provinsi
            </h3>
            <p className="text-xs text-[#49769F] font-medium">
              Eksplorasi distribusi spasial 4 klaster, kerentanan, dan koefisien lokal GWR
            </p>
          </div>

          <Link
            href="/peta-analisis"
            className="text-xs font-black text-[#001D39] hover:text-[#4E8EA2] flex items-center gap-1"
          >
            <span>Buka Analisis Spasial Mendalam &rarr;</span>
          </Link>
        </div>

        <MapSection
          geoData={geoData}
          provinces={provinces}
          selectedProvince={selectedProvince}
          onSelectProvince={setSelectedProvince}
        />
      </div>

      {/* 4 Cluster Typologies */}
      <ClusterCards
        provinces={provinces}
        onSelectProvince={setSelectedProvince}
      />

      {/* Deep-Dive Navigation Cards (Multipage Gateway) */}
      <section className="space-y-3 pt-2">
        <h3 className="text-lg font-black text-[#001D39] tracking-tight">
          Eksplorasi Modul Analitik SIGAP
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <Link
            href="/peta-analisis"
            className="pingfest-card p-5 flex flex-col justify-between space-y-3 group hover:bg-[#EDF4F9]"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#BDD8E9] border-2 border-[#001D39] flex items-center justify-center text-[#001D39] mb-3 shadow-[2px_2px_0px_#001D39]">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-[#001D39]">Peta & Analisis Spasial</h4>
              <p className="text-[11px] text-[#49769F] font-medium mt-1 leading-snug">
                Matriks DDI dua sumbu, autokorelasi Moran&apos;s I, dekomposisi efek limpahan, dan detektor paradoks spasial.
              </p>
            </div>
            <div className="text-xs font-black text-[#001D39] flex items-center gap-1 group-hover:translate-x-1 transition-all">
              <span>Buka Modul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href="/proyeksi"
            className="pingfest-card p-5 flex flex-col justify-between space-y-3 group hover:bg-[#EDF4F9]"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#7BBDE8]/30 border-2 border-[#001D39] flex items-center justify-center text-[#001D39] mb-3 shadow-[2px_2px_0px_#001D39]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-[#001D39]">Proyeksi 2026 - 2030</h4>
              <p className="text-[11px] text-[#49769F] font-medium mt-1 leading-snug">
                Proyeksi transaksi QRIS hingga Rp 114,8 T dan kurva peramalan kepemilikan ponsel 4 klaster menuju 2030.
              </p>
            </div>
            <div className="text-xs font-black text-[#001D39] flex items-center gap-1 group-hover:translate-x-1 transition-all">
              <span>Buka Modul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            href="/simulasi-kebijakan"
            className="pingfest-card p-5 flex flex-col justify-between space-y-3 group hover:bg-[#EDF4F9]"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/20 border-2 border-[#001D39] flex items-center justify-center text-[#001D39] mb-3 shadow-[2px_2px_0px_#001D39]">
                <Sliders className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-[#001D39]">Simulator Kebijakan</h4>
              <p className="text-[11px] text-[#49769F] font-medium mt-1 leading-snug">
                Simulasi skenario intervensi infrastruktur vs SDM serta kalkulator efisiensi alokasi anggaran USO/APBN.
              </p>
            </div>
            <div className="text-xs font-black text-[#001D39] flex items-center gap-1 group-hover:translate-x-1 transition-all">
              <span>Buka Modul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 4 */}
          <Link
            href="/solusi-sigap"
            className="pingfest-card p-5 flex flex-col justify-between space-y-3 group hover:bg-[#EDF4F9]"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#10B981]/20 border-2 border-[#001D39] flex items-center justify-center text-[#001D39] mb-3 shadow-[2px_2px_0px_#001D39]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-[#001D39]">Solusi & Roadmap 2045</h4>
              <p className="text-[11px] text-[#49769F] font-medium mt-1 leading-snug">
                Alur kerja terpadu, analisis kelayakan SWOT, sinergi pemangku kepentingan, dan pentahapan RPJPN 2045.
              </p>
            </div>
            <div className="text-xs font-black text-[#001D39] flex items-center gap-1 group-hover:translate-x-1 transition-all">
              <span>Buka Modul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
