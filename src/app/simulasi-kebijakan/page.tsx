"use client";

import React from "react";
import TopNav from "@/components/layout/TopNav";
import WhatIfSimulator from "@/components/dashboard/WhatIfSimulator";
import BudgetAllocator from "@/components/dashboard/BudgetAllocator";

export default function SimulasiKebijakanPage() {
  return (
    <div className="space-y-8 pb-10">
      <TopNav
        title="Simulator Kebijakan Intervensi & Anggaran Presisi"
        subtitle="Uji skenario intervensi infrastruktur vs SDM serta kalkulator efisiensi alokasi anggaran USO/APBN untuk memangkas kesenjangan digital."
      />

      {/* Simulator Tuas Geser */}
      <WhatIfSimulator />

      {/* Kalkulator Alokasi Anggaran Presisi */}
      <BudgetAllocator />
    </div>
  );
}
