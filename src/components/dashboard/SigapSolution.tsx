"use client";

import React from "react";
import {
  Map,
  ListOrdered,
  Send,
  RefreshCw,
  Building2,
  FileSpreadsheet,
  Radio,
  CheckCircle,
  AlertTriangle,
  Compass,
  Sparkles
} from "lucide-react";

export default function SigapSolution() {
  const steps = [
    {
      num: "01",
      title: "MAP (Petakan)",
      actor: "AI Analitik Spasial",
      icon: Map,
      color: "#0284C7",
      desc: "Menyerap data resmi BPS/APJII, menjalankan partisi K-Means, autokorelasi Moran's I, dan GWR untuk memetakan kantong kerentanan secara objektif."
    },
    {
      num: "02",
      title: "PRIORITIZE (Tetapkan)",
      actor: "Bappenas & Pembuat Kebijakan",
      icon: ListOrdered,
      color: "#10B981",
      desc: "Menetapkan zona prioritas intervensi berbasis skor kerentanan presisi SIGAP untuk mengeliminasi bias subjektivitas alokasi."
    },
    {
      num: "03",
      title: "DEPLOY (Eksekusi)",
      actor: "BAKTI & Operator Seluler",
      icon: Send,
      color: "#F59E0B",
      desc: "Mengeksekusi paket intervensi spesifik: terminal satelit SATRIA-1 & PLTS mikro di Klaster Ekstrem, pelatihan digital di Klaster Sedang."
    },
    {
      num: "04",
      title: "MONITOR (Pantau)",
      actor: "Kolaborasi Hibrida",
      icon: RefreshCw,
      color: "#001D39",
      desc: "Memperbarui indeks secara berkala berbasis rilis data Susenas/Podes baru sebagai mekanisme evaluasi berkelanjutan menuju Indonesia Emas 2045."
    }
  ];

  const stakeholders = [
    {
      name: "Kemkomdigi & BAKTI",
      role: "Infrastruktur & Konektivitas 3T",
      desc: "Penyediaan menara BTS 4G USO dan alokasi kapasitas transponder satelit VHTS SATRIA-1.",
      icon: Radio
    },
    {
      name: "Bappenas",
      role: "Perencanaan & Sinkronisasi Anggaran",
      desc: "Penyelarasan target penutupan kesenjangan digital ke dalam dokumen RPJMN dan RKP nasional.",
      icon: Building2
    },
    {
      name: "Badan Pusat Statistik (BPS)",
      role: "Penyedia Data Resmi Nasional",
      desc: "Pemutakhiran berkala indikator TIK, Susenas, Podes, IPM, dan PDRB per provinsi.",
      icon: FileSpreadsheet
    },
    {
      name: "Operator Telekomunikasi",
      role: "Penyelenggara Jaringan Komersial",
      desc: "Perluasan jaringan transmisi fiber optik, efisiensi paket data, dan kemitraan ekosistem perdesaan.",
      icon: Sparkles
    }
  ];

  return (
    <section className="w-full space-y-6">
      {/* Solution Banner */}
      <div className="pingfest-card p-6 relative overflow-hidden bg-white border-2 border-[#001D39] shadow-[4px_4px_0px_#001D39]">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#001D39] px-3 py-1 rounded-full bg-[#BDD8E9] border border-[#001D39] inline-block shadow-[1px_1px_0px_#001D39]">
            Arsitektur Solusi & Inovasi Kebijakan
          </span>
          <h2 className="text-2xl font-black text-[#001D39] tracking-tight">
            SIGAP: Sistem Informasi Geospasial Akses Presisi
          </h2>
          <p className="text-xs sm:text-sm text-[#0A4174] leading-relaxed font-medium">
            Platform sistem pendukung keputusan (*decision support system*) berbasis kecerdasan buatan spasial yang mengolah data resmi BPS menjadi kompas pembangunan digital yang presisi, adil, dan terukur. Mengusung filosofi utama: <strong>&ldquo;AI Memetakan, Manusia Memutuskan&rdquo;</strong>.
          </p>
        </div>
      </div>

      {/* 4-Step Workflow: Map - Prioritize - Deploy - Monitor */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-[#001D39] flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#4E8EA2]" />
          Alur Kerja Hibrida: Map &rarr; Prioritize &rarr; Deploy &rarr; Monitor
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="pingfest-card p-5 flex flex-col justify-between space-y-3 border-2 border-[#001D39] shadow-[3px_3px_0px_#001D39]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-black text-[#49769F]">{step.num}</span>
                    <div
                      className="w-8 h-8 rounded-xl border border-[#001D39] flex items-center justify-center shadow-[1px_1px_0px_#001D39]"
                      style={{ backgroundColor: `${step.color}25`, color: step.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-sm font-black text-[#001D39]">{step.title}</h4>
                  <span className="text-[10px] font-bold text-[#0284C7] block mb-1">
                    Aktor: {step.actor}
                  </span>
                  <p className="text-[11px] text-[#0A4174] leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SWOT Matrix & Sinergi Stakeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* SWOT 2x2 Matrix */}
        <div className="lg:col-span-7 pingfest-card p-5 space-y-3">
          <div className="border-b-2 border-[#001D39]/10 pb-2">
            <h3 className="text-sm font-black text-[#001D39]">
              Analisis S.W.O.T Kelayakan Solusi SIGAP
            </h3>
            <p className="text-[11px] text-[#49769F] font-medium">
              Evaluasi kekuatan, kelemahan, peluang, dan tantangan implementasi skala nasional
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Strengths */}
            <div className="p-3 rounded-2xl bg-[#10B981]/10 border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] space-y-1">
              <div className="font-black text-[#10B981] flex items-center gap-1.5 text-xs">
                <CheckCircle className="w-3.5 h-3.5" />
                Strengths (Kekuatan)
              </div>
              <ul className="text-[11px] text-[#0A4174] font-medium space-y-1 list-disc list-inside">
                <li>Berbasis data resmi BPS 2024 & pemodelan spasial empiris</li>
                <li>Rekomendasi presisi per klaster, mencegah inefisiensi anggaran</li>
                <li>Sistem analitik transparan dan dapat diuji (*explainable AI*)</li>
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-3 rounded-2xl bg-[#F59E0B]/10 border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] space-y-1">
              <div className="font-black text-[#F59E0B] flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                Weaknesses (Kelemahan)
              </div>
              <ul className="text-[11px] text-[#0A4174] font-medium space-y-1 list-disc list-inside">
                <li>Tergantung pada siklus pemutakhiran survei BPS tahunan</li>
                <li>Belum mencakup mikrografik tingkat desa secara waktu nyata (*real-time*)</li>
                <li>Membutuhkan standarisasi kapasitas analitik di pemerintah daerah</li>
              </ul>
            </div>

            {/* Opportunities */}
            <div className="p-3 rounded-2xl bg-[#7BBDE8]/20 border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] space-y-1">
              <div className="font-black text-[#0284C7] flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Opportunities (Peluang)
              </div>
              <ul className="text-[11px] text-[#0A4174] font-medium space-y-1 list-disc list-inside">
                <li>Selaras mandat UU No. 59/2024 (RPJPN 2025–2045) & SATRIA-1</li>
                <li>Mendukung percepatan pencapaian SDGs 9, 10, dan 11</li>
                <li>Potensi integrasi penuh ke portal Satu Data Indonesia & INA Digital</li>
              </ul>
            </div>

            {/* Threats */}
            <div className="p-3 rounded-2xl bg-[#EF4444]/10 border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] space-y-1">
              <div className="font-black text-[#EF4444] flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                Threats (Tantangan)
              </div>
              <ul className="text-[11px] text-[#0A4174] font-medium space-y-1 list-disc list-inside">
                <li>Tantangan geografis dan logistik medan pegunungan di wilayah 3T</li>
                <li>Kebutuhan mitigasi keamanan fisik perangkat infrastruktur pedalaman</li>
                <li>Tantangan koordinasi birokrasi lintas kementerian dan lembaga</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stakeholder Synergy */}
        <div className="lg:col-span-5 pingfest-card p-5 space-y-3">
          <div className="border-b-2 border-[#001D39]/10 pb-2">
            <h3 className="text-sm font-black text-[#001D39]">
              Sinergi Multi-Stakeholder
            </h3>
            <p className="text-[11px] text-[#49769F] font-medium">
              Kolaborasi lintas sektor penggerak ekosistem digital
            </p>
          </div>

          <div className="space-y-2">
            {stakeholders.map((stk, idx) => {
              const Icon = stk.icon;
              return (
                <div
                  key={idx}
                  className="p-2.5 rounded-2xl bg-[#EDF4F9] border-1.5 border-[#001D39] flex items-start gap-2.5 text-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#BDD8E9] border border-[#001D39] flex items-center justify-center text-[#001D39] flex-shrink-0 mt-0.5 shadow-[1px_1px_0px_#001D39]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-black text-[#001D39] text-xs">{stk.name}</div>
                    <span className="text-[10px] text-[#0284C7] font-bold block">
                      Peran: {stk.role}
                    </span>
                    <p className="text-[10px] text-[#0A4174] leading-snug mt-0.5 font-medium">
                      {stk.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Indonesia Emas 2045 Timeline */}
      <div className="pingfest-card p-5 space-y-3 border-2 border-[#001D39] shadow-[4px_4px_0px_#001D39]">
        <div className="flex items-center justify-between border-b-2 border-[#001D39]/10 pb-2">
          <h3 className="text-sm font-black text-[#001D39] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            Garis Waktu Kesiapan Digital Menuju Indonesia Emas 2045
          </h3>
          <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-[#10B981]/20 border border-[#001D39] text-[#001D39]">
            UU No. 59 Tahun 2024
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-2xl bg-[#EDF4F9] border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39]">
            <span className="font-mono font-black text-[#0284C7]">2025 - 2029</span>
            <div className="font-black text-[#001D39] mt-1">Penguatan Fondasi</div>
            <p className="text-[10px] text-[#0A4174] mt-0.5 leading-snug font-medium">
              Penuntasan blankspot 3T, migrasi SATRIA-1, dan eliminasi jurang kepemilikan gawai dasar.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#EDF4F9] border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39]">
            <span className="font-mono font-black text-[#0284C7]">2030 - 2034</span>
            <div className="font-black text-[#001D39] mt-1">Akselerasi Ekonomi</div>
            <p className="text-[10px] text-[#0A4174] mt-0.5 leading-snug font-medium">
              Ekspansi 5G ke kota sekunder, 30+ juta UMKM go digital, inklusi fintech QRIS menyeluruh.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#EDF4F9] border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39]">
            <span className="font-mono font-black text-[#0284C7]">2035 - 2039</span>
            <div className="font-black text-[#001D39] mt-1">Pemantapan Sistem</div>
            <p className="text-[10px] text-[#0A4174] mt-0.5 leading-snug font-medium">
              Penerapan AI dalam tata kelola SPBE dan otomatisasi rantai pasok industri 4.0 nasional.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#10B981]/20 border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39]">
            <span className="font-mono font-black text-[#10B981]">2040 - 2045</span>
            <div className="font-black text-[#001D39] mt-1">Indonesia Emas 2045</div>
            <p className="text-[10px] text-[#0A4174] mt-0.5 leading-snug font-medium">
              Ekonomi digital 20% PDB, konektivitas 100% universal dinikmati seluruh warga, bukan sebagian.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
