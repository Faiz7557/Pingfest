"use client";

import React from "react";
import TopNav from "@/components/layout/TopNav";
import MapSection from "@/components/dashboard/MapSection";
import DdiMatrix from "@/components/dashboard/DdiMatrix";
import SpilloverViz from "@/components/dashboard/SpilloverViz";
import ParadoxAlert from "@/components/dashboard/ParadoxAlert";
import { useSigapData } from "@/hooks/useSigapData";
import { Radio } from "lucide-react";

export default function PetaAnalisisPage() {
  const {
    provinces,
    geoData,
    selectedProvince,
    setSelectedProvince,
    loading
  } = useSigapData();

  const handleSelectByName = (name: string) => {
    const found = provinces.find((p) => p.Provinsi === name);
    if (found) {
      setSelectedProvince(found);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-[#001D39] space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#BDD8E9] border-2 border-[#001D39] shadow-[3px_3px_0px_#001D39] flex items-center justify-center animate-bounce">
          <Radio className="w-7 h-7 text-[#001D39]" />
        </div>
        <div className="text-base font-black tracking-tight">Memuat Modul Peta & Spasial...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <TopNav
        title="Peta & Analisis Geospasial 38 Provinsi"
        subtitle="Eksplorasi spasial komprehensif: 4 klaster K-Means, autokorelasi Moran's I, matriks DDI dua sumbu, dan koefisien regresi lokal GWR."
      />

      {/* Interactive Map + Inspector */}
      <MapSection
        geoData={geoData}
        provinces={provinces}
        selectedProvince={selectedProvince}
        onSelectProvince={setSelectedProvince}
      />

      {/* DDI 2x2 Matrix */}
      <DdiMatrix
        provinces={provinces}
        selectedProvince={selectedProvince}
        onSelectProvince={setSelectedProvince}
      />

      {/* Spatial Spillover & Paradox Detector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          <SpilloverViz />
        </div>
        <div className="lg:col-span-6">
          <ParadoxAlert onSelectProvinceByName={handleSelectByName} />
        </div>
      </div>
    </div>
  );
}
