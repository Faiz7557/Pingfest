"use client";

import React from "react";
import { ProvinceData } from "@/lib/types";
import { CLUSTER_COLORS } from "@/lib/constants";
import RadarProfile from "./RadarProfile";
import {
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Cpu,
  GraduationCap,
  Briefcase,
  DollarSign,
  Radio,
  CheckCircle2
} from "lucide-react";

interface ProvinceInspectorProps {
  province: ProvinceData | null;
  onClose?: () => void;
}

export default function ProvinceInspector({ province }: ProvinceInspectorProps) {
  if (!province) {
    return (
      <div className="pingfest-card p-8 w-full flex flex-col items-center justify-center text-center text-[#49769F] bg-white">
        <div className="w-12 h-12 rounded-2xl bg-[#BDD8E9] border-2 border-[#001D39] flex items-center justify-center text-[#001D39] mb-3 shadow-[2px_2px_0px_#001D39]">
          <MapPin className="w-6 h-6 animate-bounce" />
        </div>
        <h4 className="text-base font-black text-[#001D39] mb-1">Pilih Provinsi pada Peta</h4>
        <p className="text-xs max-w-sm text-[#49769F] font-medium leading-relaxed">
          Klik provinsi di peta choropleth atau pilih dari daftar untuk melihat profil 5 dimensi, sensitivitas GWR, dan rekomendasi intervensi preskriptif SIGAP.
        </p>
      </div>
    );
  }

  const clusterColor = CLUSTER_COLORS[province.nama_klaster] || "#7BBDE8";

  const getPrescriptiveActions = () => {
    switch (province.nama_klaster) {
      case "Tertinggal Ekstrem":
        return [
          {
            title: "Backhaul Non-Terestrial & Satelit",
            desc: "Pemanfaatan transponder satelit VHTS SATRIA-1 & stasiun bumi mikro untuk menembus isolasi topografi pegunungan.",
            icon: Radio
          },
          {
            title: "Subsidi Gawai & PLTS Komunal",
            desc: "Paket penyediaan gawai terjangkau yang dibundel dengan catu daya mandiri pembangkit listrik tenaga surya (PLTS) mikro.",
            icon: Cpu
          },
          {
            title: "Penguatan Literasi Komunitas Dasar",
            desc: "Integrasi modul literasi digital dasar pada puskesmas, balai desa, dan sekolah perintis pedalaman.",
            icon: GraduationCap
          }
        ];
      case "Tertinggal Sedang":
        return [
          {
            title: "Peningkatan Kualitas Jaringan (QoS 4G)",
            desc: "Peningkatan rasio fiberisasi menara BTS 4G dan penuntasan blankspot parsial di permukiman perdesaan.",
            icon: Radio
          },
          {
            title: "Digitalisasi UMKM & Onboarding QRIS",
            desc: "Pelatihan pemasaran digital dan adopsi pembayaran QRIS bagi pelaku UMKM pertanian, kelautan, dan kerajinan lokal.",
            icon: Briefcase
          },
          {
            title: "Integrasi Layanan Publik Desa (SPBE)",
            desc: "Digitalisasi administrasi kependudukan dan layanan kesehatan desa melalui akses internet BAKTI.",
            icon: Lightbulb
          }
        ];
      case "Berkembang Menengah":
        return [
          {
            title: "Akselerasi Ekonomi Nilai Tambah",
            desc: "Mendorong utilisasi internet dari konsumsi media sosial ke arah adopsi fintech, e-commerce produktif, dan logistik digital.",
            icon: DollarSign
          },
          {
            title: "Pengembangan Talenta & Inkubator Daerah",
            desc: "Pemberdayaan lulusan vokasi dan perguruan tinggi daerah untuk menciptakan solusi agritech dan edutech lokal.",
            icon: GraduationCap
          }
        ];
      case "Maju dan Terhubung":
      default:
        return [
          {
            title: "Hub Inovasi & Kemitraan Regional",
            desc: "Mengembangkan skema kemitraan daerah (*sister province*) sebagai mentor transfer teknologi bagi kawasan sekitar.",
            icon: Cpu
          },
          {
            title: "Penerapan Generasi Lanjut (5G & AI)",
            desc: "Ekspansi konektivitas 5G di koridor industri cerdas dan otomatisasi pelayanan publik berbasis kecerdasan buatan.",
            icon: Lightbulb
          }
        ];
    }
  };

  const recommendations = getPrescriptiveActions();

  return (
    <div className="pingfest-card p-4 sm:p-6 w-full space-y-5 sm:space-y-6 bg-white shadow-[4px_4px_0px_#001D39]">
      {/* Top Banner: Province Info & Vulnerability Bar */}
      <div className="border-b-2 border-[#001D39]/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-[11px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-full bg-[#EDF4F9] text-[#001D39] border-1.5 border-[#001D39]">
              Peringkat #{province.peringkat} Kerentanan Digital
            </span>
            <span
              className="text-[11px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-full text-[#001D39] border-1.5 border-[#001D39] shadow-[1px_1px_0px_#001D39]"
              style={{ backgroundColor: clusterColor }}
            >
              {province.nama_klaster}
            </span>
            <span className="text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full bg-[#BDD8E9] border-1.5 border-[#001D39] text-[#001D39]">
              LISA: {province.lisa}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#001D39] mt-2 tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#001D39] flex-shrink-0" />
            <span>Profil Lengkap & Intervensi: {province.Provinsi}</span>
          </h3>
        </div>

        {/* Vulnerability Index Progress Meter */}
        <div className="w-full md:w-64 space-y-1">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-[#49769F]">Indeks Kerentanan Spasial:</span>
            <span className="text-sm font-black text-[#001D39]">{province.indeks_kerentanan.toFixed(3)}</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#EDF4F9] border-2 border-[#001D39] overflow-hidden p-[1px]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(province.indeks_kerentanan * 100, 100)}%`,
                backgroundColor: province.indeks_kerentanan > 0.6 ? "#EF4444" : province.indeks_kerentanan > 0.4 ? "#F59E0B" : "#10B981"
              }}
            />
          </div>
        </div>
      </div>

      {/* 3-Column Cockpit Layout: 1 col on mobile, 2 cols on tablet, 12 cols on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
        {/* Column 1: Radar Chart (md: 2 cols full width, lg: 4 cols) */}
        <div className="md:col-span-2 lg:col-span-4 p-4 rounded-2xl bg-[#EDF4F9]/60 border-2 border-[#001D39] space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-[#001D39] uppercase tracking-wider">
              Profil 5 Dimensi vs Nasional
            </h4>
            <span className="text-[10px] font-bold text-[#4E8EA2]">Skala Normal 0-100</span>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-[260px]">
            <RadarProfile province={province} />
          </div>
          <p className="text-[10px] text-[#49769F] text-center font-medium">
            Membandingkan skor 5 dimensi {province.Provinsi} terhadap rata-rata 38 provinsi
          </p>
        </div>

        {/* Column 2: 4 Key Metrics & Paradox Callout (md: 1 col, lg: 4 cols) */}
        <div className="md:col-span-1 lg:col-span-4 space-y-3 flex flex-col justify-between">
          {/* Paradox Alert */}
          {province.paradox && province.paradox.is_paradox ? (
            <div className="p-3.5 rounded-2xl bg-[#EF4444]/10 border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] text-xs">
              <div className="flex items-center gap-1.5 text-[#EF4444] font-black mb-1">
                <AlertTriangle className="w-4 h-4 text-[#EF4444] flex-shrink-0" />
                <span>Paradoks: {province.paradox.title}</span>
              </div>
              <p className="text-[#001D39] text-[11px] leading-relaxed font-medium">
                {province.paradox.description}
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-[#EDF4F9] border-1.5 border-[#001D39] text-xs space-y-1">
              <div className="font-black text-[#001D39] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Karakteristik Klaster Wilayah</span>
              </div>
              <p className="text-[#49769F] text-[11px] leading-relaxed font-medium">
                Wilayah ini berada pada lintasan pembangunan klaster <strong>{province.nama_klaster}</strong> dengan tingkat keselarasan spasial yang stabil.
              </p>
            </div>
          )}

          {/* 4 Metric Boxes */}
          <div className="grid grid-cols-2 gap-2 text-xs flex-1">
            <div className="p-2.5 sm:p-3 rounded-xl bg-white border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] flex flex-col justify-between">
              <div className="text-[9px] sm:text-[10px] font-bold text-[#49769F] uppercase">Kepemilikan Ponsel</div>
              <div className="text-base sm:text-lg font-black text-[#001D39] mt-1">{province.hp_seluler_2024.toFixed(1)}%</div>
              <div className="text-[8px] sm:text-[9px] text-[#4E8EA2] font-semibold mt-0.5">Akses Fisik Jaringan</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-white border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] flex flex-col justify-between">
              <div className="text-[9px] sm:text-[10px] font-bold text-[#49769F] uppercase">IPM 2024</div>
              <div className="text-base sm:text-lg font-black text-[#001D39] mt-1">{province.ipm_2024.toFixed(2)}</div>
              <div className="text-[8px] sm:text-[9px] text-[#4E8EA2] font-semibold mt-0.5">Kapasitas Modal Insani</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-white border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] flex flex-col justify-between">
              <div className="text-[9px] sm:text-[10px] font-bold text-[#49769F] uppercase">Lama Sekolah (RLS)</div>
              <div className="text-base sm:text-lg font-black text-[#001D39] mt-1">{province.rls_2024.toFixed(2)} thn</div>
              <div className="text-[8px] sm:text-[9px] text-[#4E8EA2] font-semibold mt-0.5">Literasi & Pendidikan</div>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-white border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] flex flex-col justify-between">
              <div className="text-[9px] sm:text-[10px] font-bold text-[#49769F] uppercase">PDRB per Kapita</div>
              <div className="text-base sm:text-lg font-black text-[#001D39] mt-1">Rp {(province.pdrb_kapita_2024 / 1000).toFixed(1)} jt</div>
              <div className="text-[8px] sm:text-[9px] text-[#4E8EA2] font-semibold mt-0.5">Daya Beli Riil Tahunan</div>
            </div>
          </div>
        </div>

        {/* Column 3: GWR Insight & Prescriptive Interventions (md: 1 col, lg: 4 cols) */}
        <div className="md:col-span-1 lg:col-span-4 space-y-3 flex flex-col justify-between">
          {/* GWR Insight Box */}
          <div className="p-3.5 rounded-2xl bg-white border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-[#001D39] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#0A4174]" />
                Sensitivitas Geografis (GWR)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#BDD8E9] border border-[#001D39] text-[#001D39]">
                Koefisien: {province.gwr_ipm_2024.toFixed(2)}
              </span>
            </div>
            <p className="text-[11px] text-[#0A4174] leading-relaxed font-medium">
              Di {province.Provinsi}, setiap peningkatan 1 poin IPM menstimulasi pertumbuhan adopsi digital lokal sebesar <strong>+{province.gwr_ipm_2024.toFixed(1)} poin</strong> persentase.
            </p>
          </div>

          {/* Prescriptive Policy Actions */}
          <div className="p-3.5 rounded-2xl bg-[#EDF4F9]/60 border-2 border-[#001D39] space-y-2 flex-1">
            <h4 className="text-xs font-black text-[#001D39] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              Rekomendasi Preskriptif SIGAP
            </h4>
            <div className="space-y-2">
              {recommendations.map((rec, idx) => {
                const Icon = rec.icon;
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border-1.5 border-[#001D39] flex items-start gap-2.5 text-xs shadow-[1px_1px_0px_#001D39]"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#BDD8E9] border border-[#001D39] flex-shrink-0 flex items-center justify-center text-[#001D39] mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-black text-[#001D39] text-[11px]">{rec.title}</div>
                      <div className="text-[#49769F] text-[10px] leading-snug mt-0.5 font-medium">{rec.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
