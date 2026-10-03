"use client";

import React from "react";
import { Radio, Sparkles, MapPin, Compass, ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-[#001D39]/90 border-b border-[#49769F]/30 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0A4174] to-[#7BBDE8] flex items-center justify-center shadow-lg shadow-[#001D39]/50 border border-[#7BBDE8]/30">
            <Radio className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                SIGAP
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#7BBDE8]/20 text-[#7BBDE8] border border-[#7BBDE8]/40">
                  v1.0 Prototipe
                </span>
              </span>
              <span className="hidden sm:inline-block text-xs font-medium text-[#6EA2B3] border-l border-[#49769F]/50 pl-2">
                P!NGFEST 2026 • UNS
              </span>
            </div>
            <p className="text-xs text-[#BDD8E9]/80 font-medium line-clamp-1">
              Sistem Informasi Geospasial Akses Presisi • Memetakan Kesenjangan Kesiapan Digital 38 Provinsi
            </p>
          </div>
        </div>

        {/* Competition Badge & Philosophy Pill */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0A4174]/70 border border-[#49769F]/40 text-xs text-[#BDD8E9]">
            <Compass className="w-3.5 h-3.5 text-[#7BBDE8]" />
            <span>&ldquo;AI Memetakan, Manusia Memutuskan&rdquo;</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0A4174] to-[#001D39] border border-[#7BBDE8]/30 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#7BBDE8]" />
            <span className="font-semibold text-white">IRIS Kehitaman 3 Angkatan</span>
          </div>

          <a
            href="#simulator-section"
            className="px-3.5 py-1.5 rounded-xl bg-[#7BBDE8] hover:bg-[#6EA2B3] text-[#001D39] font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Simulasi Kebijakan</span>
          </a>
        </div>
      </div>
    </header>
  );
}
