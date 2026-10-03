"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  TrendingUp,
  Sliders,
  Sparkles,
  BookOpen,
  Compass,
  Radio,
  Menu,
  X,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navItems = [
    {
      name: "Dashboard",
      shortName: "Beranda",
      href: "/",
      icon: LayoutDashboard
    },
    {
      name: "Peta & Spasial",
      shortName: "Peta",
      href: "/peta-analisis",
      icon: MapPin
    },
    {
      name: "Proyeksi 2030",
      shortName: "Proyeksi",
      href: "/proyeksi",
      icon: TrendingUp
    },
    {
      name: "Simulasi Kebijakan",
      shortName: "Simulasi",
      href: "/simulasi-kebijakan",
      icon: Sliders
    },
    {
      name: "Solusi & 2045",
      shortName: "Solusi",
      href: "/solusi-sigap",
      icon: Sparkles
    },
    {
      name: "Referensi & Pustaka",
      shortName: "Pustaka",
      href: "/referensi",
      icon: BookOpen
    }
  ];

  return (
    <>
      {/* =========================================================================
          1. MOBILE TOP APP BAR (< lg)
         ========================================================================= */}
      <header className="lg:hidden sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b-2 border-[#001D39] px-4 py-2.5 flex items-center justify-between shadow-[0_2px_0px_#001D39]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#7BBDE8] border-2 border-[#001D39] flex items-center justify-center shadow-[2px_2px_0px_#001D39] group-active:scale-95 transition-transform flex-shrink-0">
            <Radio className="w-4 h-4 text-[#001D39]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-[#001D39] tracking-wider leading-none">
                SIGAP
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-black rounded bg-[#BDD8E9] border border-[#001D39] text-[#001D39]">
                v1.0
              </span>
            </div>
            <span className="text-[10px] text-[#49769F] font-bold tracking-tight">
              P!NGFEST 2026 • UNS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Quick Simulation Link */}
          <Link
            href="/simulasi-kebijakan"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#7BBDE8] border-1.5 border-[#001D39] text-[11px] font-black text-[#001D39] shadow-[1.5px_1.5px_0px_#001D39] active:translate-y-0.5 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Simulasi</span>
          </Link>

          {/* Hamburger Drawer Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            className="w-9 h-9 rounded-xl bg-[#EDF4F9] hover:bg-[#BDD8E9] active:scale-95 border-2 border-[#001D39] flex items-center justify-center text-[#001D39] shadow-[2px_2px_0px_#001D39] transition-all cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* =========================================================================
          2. MOBILE DRAWER (OFF-CANVAS MENU) (< lg)
         ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#001D39]/50 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-white border-l-2 border-[#001D39] p-5 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200 z-50">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b-2 border-[#001D39]/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#7BBDE8] border-2 border-[#001D39] flex items-center justify-center shadow-[2px_2px_0px_#001D39]">
                    <Radio className="w-4 h-4 text-[#001D39]" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-[#001D39]">Menu Navigasi</div>
                    <div className="text-[10px] text-[#49769F] font-bold">
                      Prototipe Analitik SIGAP
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-xl bg-[#EDF4F9] hover:bg-[#EF4444]/20 hover:text-[#EF4444] border-1.5 border-[#001D39] text-[#001D39] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Tutup menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-[#BDD8E9] text-[#001D39] border-2 border-[#001D39] shadow-[2.5px_2.5px_0px_#001D39]"
                          : "text-[#49769F] hover:text-[#001D39] hover:bg-[#BDD8E9]/40 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isActive
                              ? "bg-[#7BBDE8] text-[#001D39] border border-[#001D39]"
                              : "text-[#49769F]"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black">{item.name}</span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 ${isActive ? "text-[#001D39]" : "text-[#49769F]/50"}`}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Drawer Section: Philosophy & Team Card */}
            <div className="space-y-3 pt-4 border-t-2 border-[#001D39]/10 mt-6">
              {/* Philosophy Badge */}
              <div className="p-2.5 rounded-xl bg-[#EDF4F9] border-1.5 border-[#001D39] text-[11px] text-[#0A4174] font-medium flex items-center gap-2 shadow-[2px_2px_0px_#001D39]">
                <Compass className="w-4 h-4 text-[#4E8EA2] flex-shrink-0" />
                <span className="leading-snug">
                  &ldquo;AI Memetakan, Manusia Memutuskan&rdquo;
                </span>
              </div>

              {/* User Card */}
              <div className="p-2.5 rounded-2xl bg-white border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-[#7BBDE8] border-2 border-[#001D39] text-[#001D39] font-black text-xs flex items-center justify-center flex-shrink-0">
                    F
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-black text-[#001D39] truncate">
                      Faiz Iqbal Itishom
                    </div>
                    <div className="text-[10px] text-[#49769F] font-semibold truncate">
                      IRIS Kehitaman 3 Angkatan
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. MOBILE BOTTOM NAVIGATION BAR (< lg)
         ========================================================================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-[#001D39] px-2 py-1.5 flex items-center justify-around shadow-[0_-2px_4px_rgba(0,29,57,0.06)]">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? "text-[#001D39] font-black"
                  : "text-[#49769F] hover:text-[#001D39] font-semibold"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-[#7BBDE8] border border-[#001D39] shadow-[1px_1px_0px_#001D39] scale-105"
                    : "bg-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[9px] mt-0.5 tracking-tight">{item.shortName}</span>
            </Link>
          );
        })}

        {/* Menu toggle shortcut on bottom nav */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[#49769F] hover:text-[#001D39] font-semibold cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#EDF4F9] border border-[#001D39]/30">
            <Menu className="w-4 h-4 text-[#001D39]" />
          </div>
          <span className="text-[9px] mt-0.5 tracking-tight">Menu</span>
        </button>
      </nav>

      {/* =========================================================================
          4. DESKTOP PERMANENT SIDEBAR (>= lg)
         ========================================================================= */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-white border-r-2 border-[#001D39] min-h-screen flex-col justify-between p-4 z-40 sticky top-0 h-screen">
        {/* Top Brand Logo */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3 px-2 pt-2 group">
            <div className="w-10 h-10 rounded-xl bg-[#7BBDE8] border-2 border-[#001D39] flex items-center justify-center shadow-[2px_2px_0px_#001D39] group-hover:scale-105 transition-all flex-shrink-0">
              <Radio className="w-5 h-5 text-[#001D39]" />
            </div>
            <div className="relative inline-flex items-center">
              <span className="relative z-10 text-2xl font-black text-[#001D39] tracking-wider">
                SIGAP
              </span>
              <span className="absolute bottom-0.5 -inset-x-1.5 h-3.5 bg-[#7BBDE8] -rotate-1 rounded-sm -z-0 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all" />
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#BDD8E9] text-[#001D39] border-2 border-[#001D39] shadow-[3px_3px_0px_#001D39]"
                      : "text-[#49769F] hover:text-[#001D39] hover:bg-[#BDD8E9]/40 border-2 border-transparent"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isActive
                        ? "bg-[#7BBDE8] text-[#001D39] border border-[#001D39]"
                        : "text-[#49769F]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Philosophy Pill & Participant Profile */}
        <div className="space-y-3 pt-4 border-t-2 border-[#001D39]/10">
          {/* Philosophy Badge */}
          <div className="p-2.5 rounded-xl bg-[#EDF4F9] border-1.5 border-[#001D39] text-[11px] text-[#0A4174] font-medium flex items-center gap-2 shadow-[2px_2px_0px_#001D39]">
            <Compass className="w-4 h-4 text-[#4E8EA2] flex-shrink-0" />
            <span className="leading-snug">
              &ldquo;AI Memetakan, Manusia Memutuskan&rdquo;
            </span>
          </div>

          {/* User Card */}
          <div className="p-2.5 rounded-2xl bg-white border-2 border-[#001D39] shadow-[3px_3px_0px_#001D39] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-[#7BBDE8] border-2 border-[#001D39] text-[#001D39] font-black text-xs flex items-center justify-center flex-shrink-0">
                F
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-black text-[#001D39] truncate">
                  Faiz Iqbal Itishom
                </div>
                <div className="text-[10px] text-[#49769F] font-semibold truncate">
                  IRIS Kehitaman 3 Angkatan
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
