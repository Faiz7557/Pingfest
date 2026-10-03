"use client";

import React from "react";
import Link from "next/link";
import { Radio, BookOpen, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t-2 border-[#001D39] text-[#001D39] py-8 px-4 sm:px-6 lg:px-8 mt-12 shadow-[0_-2px_0px_#001D39]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Brand & Team Credits */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-[#001D39]/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7BBDE8] border-2 border-[#001D39] flex items-center justify-center text-[#001D39] shadow-[2px_2px_0px_#001D39] flex-shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-[#001D39] tracking-tight">
                SIGAP Prototipe
              </div>
              <div className="text-[11px] sm:text-xs text-[#49769F] font-bold">
                Sistem Informasi Geospasial Akses Presisi • Pingfest UNS 2026
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-full bg-[#EDF4F9] border-1.5 border-[#001D39] text-[#001D39] font-bold shadow-[2px_2px_0px_#001D39]">
              Tim: IRIS Kehitaman 3 Angkatan
            </span>
            <span className="px-3 py-1.5 rounded-full bg-[#BDD8E9] border-1.5 border-[#001D39] text-[#001D39] font-black shadow-[2px_2px_0px_#001D39]">
              Universitas Sebelas Maret
            </span>
          </div>
        </div>

        {/* References Subpage Navigation Callout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#EDF4F9] border-2 border-[#001D39] shadow-[3px_3px_0px_#001D39] transition-all hover:translate-y-[-1px]">
          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-black text-[#001D39] flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#BDD8E9] border border-[#001D39] flex items-center justify-center text-[#001D39] flex-shrink-0">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span>Transparansi Riset, Sumber Data Resmi & Daftar Pustaka Lengkap</span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#0A4174] font-medium leading-relaxed max-w-3xl">
              Dokumentasi komprehensif data resmi BPS 2024, ekonometrika spasial (LISA, GWR), regulasi RPJPN 2045, dan sitasi ilmiah APA tersedia pada sub-halaman tersendiri.
            </p>
          </div>

          <Link
            href="/referensi"
            className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-[#7BBDE8] hover:bg-[#BDD8E9] text-[#001D39] text-xs font-black border-2 border-[#001D39] shadow-[2.5px_2.5px_0px_#001D39] active:translate-y-0.5 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <span>Buka Referensi & Pustaka</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Bottom Copyright & Quote */}
        <div className="border-t-2 border-[#001D39]/10 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-[#49769F] font-semibold gap-3 text-center sm:text-left">
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <span>&copy; 2026</span>
            <span className="font-black text-[#001D39]">Tim IRIS Kehitaman 3 Angkatan</span>
            <span>•</span>
            <span>IT-VENTURE P!NGFEST UNS 2026.</span>
          </div>
          <div className="italic font-bold text-[#0A4174] bg-[#EDF4F9] px-3.5 py-1 rounded-full border-1.5 border-[#001D39] shadow-[1.5px_1.5px_0px_#001D39]">
            &ldquo;AI memetakan kerentanan, manusia mengeksekusi keadilan.&rdquo;
          </div>
        </div>
      </div>
    </footer>
  );
}
