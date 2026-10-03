"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface TopNavProps {
  title: string;
  subtitle: string;
}

export default function TopNav({ title, subtitle }: TopNavProps) {
  return (
    <header className="w-full pb-4 sm:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#001D39] tracking-tight leading-snug">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-[#49769F] font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex items-center flex-wrap gap-2 pt-1 sm:pt-0 self-start sm:self-auto flex-shrink-0">
          <div className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] text-[11px] sm:text-xs font-bold text-[#001D39] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#4E8EA2]" />
            <span>RPJPN 2025–2045</span>
          </div>

          <Link
            href="/simulasi-kebijakan"
            className="pingfest-btn px-3.5 py-1 sm:px-4 sm:py-1.5 bg-[#7BBDE8] text-[#001D39] text-[11px] sm:text-xs font-black shadow-[2px_2px_0px_#001D39] hover:bg-[#BDD8E9]"
          >
            <span>Simulasi Cepat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
