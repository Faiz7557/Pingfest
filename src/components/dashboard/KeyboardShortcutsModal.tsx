"use client";

import React from "react";
import {
  Keyboard,
  X,
  Compass,
  Layers,
  Share2,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({
  isOpen,
  onClose
}: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#001D39]/50 backdrop-blur-xs">
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border-2 border-[#001D39] rounded-2xl shadow-[6px_6px_0px_#001D39] p-4 sm:p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#001D39]/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#7BBDE8] border-2 border-[#001D39] flex items-center justify-center text-[#001D39] shadow-[2px_2px_0px_#001D39]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#001D39] tracking-tight">
                Pintasan Keyboard Peta SIGAP
              </h3>
              <p className="text-xs text-[#49769F] font-medium">
                Kendalikan eksplorasi spasial secara seamless tanpa harus selalu mengklik
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#EDF4F9] hover:bg-[#EF4444]/20 hover:text-[#EF4444] border-1.5 border-[#001D39] text-[#001D39] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts Categories */}
        <div className="space-y-4 text-xs">
          {/* Category 1: Navigation */}
          <div className="space-y-2">
            <div className="text-[11px] font-black text-[#001D39] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#0A4174]" />
              <span>1. Navigasi Geografis Spasial</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#EDF4F9] border border-[#001D39]/20 flex items-center justify-between">
                <span className="text-[#001D39] font-medium">Geser Barat / Timur</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 rounded bg-white border border-[#001D39] font-mono font-black text-[11px] shadow-[1px_1px_0px_#001D39]">
                    ←
                  </kbd>
                  <kbd className="px-2 py-1 rounded bg-white border border-[#001D39] font-mono font-black text-[11px] shadow-[1px_1px_0px_#001D39]">
                    →
                  </kbd>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#EDF4F9] border border-[#001D39]/20 flex items-center justify-between">
                <span className="text-[#001D39] font-medium">Geser Utara / Selatan</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 rounded bg-white border border-[#001D39] font-mono font-black text-[11px] shadow-[1px_1px_0px_#001D39]">
                    ↑
                  </kbd>
                  <kbd className="px-2 py-1 rounded bg-white border border-[#001D39] font-mono font-black text-[11px] shadow-[1px_1px_0px_#001D39]">
                    ↓
                  </kbd>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#EDF4F9] border border-[#001D39]/20 flex items-center justify-between sm:col-span-2">
                <span className="text-[#001D39] font-medium">Kunci / Pilih Wilayah Sorotan</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2.5 py-1 rounded bg-white border border-[#001D39] font-mono font-black text-[11px] shadow-[1px_1px_0px_#001D39]">
                    Enter
                  </kbd>
                  <span className="text-[#49769F] text-[10px]">atau</span>
                  <kbd className="px-2.5 py-1 rounded bg-white border border-[#001D39] font-mono font-black text-[11px] shadow-[1px_1px_0px_#001D39]">
                    Space
                  </kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Category 2: Layers */}
          <div className="space-y-2">
            <div className="text-[11px] font-black text-[#001D39] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#0A4174]" />
              <span>2. Ganti Cepat Lapisan Analitik</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2 rounded-xl bg-[#EDF4F9] border border-[#001D39]/20 flex flex-col items-center justify-center text-center space-y-1">
                <kbd className="px-2.5 py-1 rounded bg-white border border-[#001D39] font-mono font-black text-xs shadow-[1px_1px_0px_#001D39]">
                  1
                </kbd>
                <span className="text-[10px] font-bold text-[#001D39]">Klaster</span>
              </div>

              <div className="p-2 rounded-xl bg-[#EDF4F9] border border-[#001D39]/20 flex flex-col items-center justify-center text-center space-y-1">
                <kbd className="px-2.5 py-1 rounded bg-white border border-[#001D39] font-mono font-black text-xs shadow-[1px_1px_0px_#001D39]">
                  2
                </kbd>
                <span className="text-[10px] font-bold text-[#001D39]">Kerentanan</span>
              </div>

              <div className="p-2 rounded-xl bg-[#EDF4F9] border border-[#001D39]/20 flex flex-col items-center justify-center text-center space-y-1">
                <kbd className="px-2.5 py-1 rounded bg-white border border-[#001D39] font-mono font-black text-xs shadow-[1px_1px_0px_#001D39]">
                  3
                </kbd>
                <span className="text-[10px] font-bold text-[#001D39]">LISA Spasial</span>
              </div>

              <div className="p-2 rounded-xl bg-[#EDF4F9] border border-[#001D39]/20 flex flex-col items-center justify-center text-center space-y-1">
                <kbd className="px-2.5 py-1 rounded bg-white border border-[#001D39] font-mono font-black text-xs shadow-[1px_1px_0px_#001D39]">
                  4
                </kbd>
                <span className="text-[10px] font-bold text-[#001D39]">GWR (IPM)</span>
              </div>
            </div>
          </div>

          {/* Category 3: Map Utilities */}
          <div className="space-y-2">
            <div className="text-[11px] font-black text-[#001D39] uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-[#0A4174]" />
              <span>3. Kontrol & Fitur Tambahan</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-[#EDF4F9] border border-[#001D39]/20 flex items-center justify-between">
                <span className="text-[#001D39] font-medium text-[11px]">Garis Spasial</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-[#001D39] font-mono font-black text-xs shadow-[1px_1px_0px_#001D39]">
                  P
                </kbd>
              </div>

              <div className="p-2.5 rounded-xl bg-[#EDF4F9] border border-[#001D39]/20 flex items-center justify-between">
                <span className="text-[#001D39] font-medium text-[11px]">Reset Peta</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-[#001D39] font-mono font-black text-xs shadow-[1px_1px_0px_#001D39]">
                  R
                </kbd>
              </div>

              <div className="p-2.5 rounded-xl bg-[#EDF4F9] border border-[#001D39]/20 flex items-center justify-between">
                <span className="text-[#001D39] font-medium text-[11px]">Zoom In / Out</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#001D39] font-mono font-black text-xs shadow-[1px_1px_0px_#001D39]">
                    +
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#001D39] font-mono font-black text-xs shadow-[1px_1px_0px_#001D39]">
                    -
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="border-t border-[#001D39]/10 pt-3 flex items-center justify-between text-[11px]">
          <span className="text-[#49769F] flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            Tekan <kbd className="px-1 rounded bg-[#EDF4F9] border font-mono">?</kbd> kapan saja untuk membuka panduan ini
          </span>

          <button
            onClick={onClose}
            className="pingfest-btn px-4 py-1.5 bg-[#7BBDE8] text-[#001D39] text-xs font-black"
          >
            Mengerti, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}
