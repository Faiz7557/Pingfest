"use client";

import React from "react";
import { AlertCircle, Flame, GraduationCap, Mountain, HelpCircle } from "lucide-react";

interface ParadoxAlertProps {
  onSelectProvinceByName: (name: string) => void;
}

export default function ParadoxAlert({ onSelectProvinceByName }: ParadoxAlertProps) {
  const anomalies = [
    {
      title: "Kaya Sumber Daya, Tertinggal Sinyal",
      provinsi: "Papua Tengah",
      icon: Flame,
      statHighlight: "PDRB #8 tapi Ponsel #37",
      color: "#EF4444",
      bgColor: "#EF4444",
      description:
        "PDRB per kapita mencapai Rp 118,8 juta/tahun (peringkat 8 nasional berkat sektor pertambangan Grasberg), namun kepemilikan ponsel hanya 33,7% (peringkat ke-37 dari 38 provinsi). Bukti nyata bahwa kekayaan komoditas tidak otomatis melahirkan kesiapan digital tanpa intervensi afirmatif terarah."
    },
    {
      title: "Pusat Pendidikan, Monetisasi Tertahan",
      provinsi: "DI Yogyakarta",
      icon: GraduationCap,
      statHighlight: "IPM #2 tapi PDRB #28",
      color: "#0284C7",
      bgColor: "#7BBDE8",
      description:
        "Memiliki IPM 81,55 (tertinggi kedua nasional setelah DKI Jakarta) dan RLS 9,92 tahun, namun PDRB per kapita hanya Rp 51,5 juta (peringkat 28). Talenta digital berpendidikan tinggi melimpah, namun ekosistem industri teknologi lokal perlu diperkuat agar potensi ekonomi terserap di daerah."
    },
    {
      title: "Wilayah Terisolasi Ekstrem Nasional",
      provinsi: "Papua Pegunungan",
      icon: Mountain,
      statHighlight: "15,8% Akses Ponsel",
      color: "#F59E0B",
      bgColor: "#F59E0B",
      description:
        "Provinsi dengan kesiapan terendah nasional: hanya 15,76% penduduk memiliki ponsel dengan indeks kerentanan tertinggi (0,843). Selisih dengan DKI Jakarta mencapai 67,67 poin persentase, menuntut solusi lompatan teknologi non-terestrial langsung (VHTS SATRIA-1 dan terminal bertenaga surya)."
    }
  ];

  return (
    <div className="pingfest-card p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#001D39]/10 pb-3">
        <div>
          <h3 className="text-base font-black text-[#001D39] flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#EF4444]" />
            Detektor Paradoks Spasial & Anomali Pembangunan
          </h3>
          <p className="text-xs text-[#49769F] font-medium">
            Bukti empiris mengapa kebijakan pembangunan digital tidak boleh seragam (*one-size-fits-all*).
          </p>
        </div>
        <div className="text-[11px] px-3 py-1 rounded-full bg-[#EDF4F9] border-1.5 border-[#001D39] text-[#001D39] font-bold flex items-center gap-1 self-start sm:self-auto shadow-[1px_1px_0px_#001D39]">
          <HelpCircle className="w-3.5 h-3.5 text-[#4E8EA2]" />
          <span>Klik kartu untuk inspeksi provinsi</span>
        </div>
      </div>

      {/* Grid of Paradox Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {anomalies.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => onSelectProvinceByName(item.provinsi)}
              className="p-4 rounded-2xl bg-[#EDF4F9] border-2 border-[#001D39] shadow-[3px_3px_0px_#001D39] transition-all cursor-pointer hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#001D39] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-xl border border-[#001D39] flex items-center justify-center shadow-[1px_1px_0px_#001D39]"
                      style={{ backgroundColor: `${item.bgColor}40`, color: item.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-[#001D39]">{item.provinsi}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-[#001D39] text-[#001D39]">
                    {item.statHighlight}
                  </span>
                </div>

                <div className="text-[11px] font-black text-[#001D39] mb-1.5">
                  &ldquo;{item.title}&rdquo;
                </div>

                <p className="text-[11px] text-[#0A4174] leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#001D39]/20 text-[10px] font-black text-[#001D39] flex items-center justify-end">
                Lihat di Peta &rarr;
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
