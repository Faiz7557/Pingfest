"use client";

import React from "react";
import TopNav from "@/components/layout/TopNav";
import SigapSolution from "@/components/dashboard/SigapSolution";

export default function SolusiSigapPage() {
  return (
    <div className="space-y-6 sm:space-y-8 pb-6 sm:pb-10">
      <TopNav
        title="Arsitektur Solusi SIGAP & Roadmap Indonesia Emas 2045"
        subtitle="Kerangka kebijakan terpadu: 'AI Memetakan, Manusia Memutuskan'. Menyelaraskan pembangunan infrastruktur digital nasional dengan RPJPN 2025–2045."
      />

      <SigapSolution />
    </div>
  );
}
