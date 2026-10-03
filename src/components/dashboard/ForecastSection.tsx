"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { QrisForecastData, ClusterProjectionItem } from "@/lib/types";
import { CLUSTER_COLORS } from "@/lib/constants";
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface ForecastSectionProps {
  qrisData: QrisForecastData;
  clusterProjData: ClusterProjectionItem[];
}

function CustomQrisTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  const isTransition = item.tanggal === "2024-12";
  const isHistorical = item.aktual !== null && !isTransition;

  return (
    <div className="bg-white border-2 border-[#001D39] rounded-xl shadow-[3px_3px_0px_#001D39] p-3 text-xs text-[#001D39] space-y-1.5 min-w-[220px]">
      <div className="font-black border-b border-[#001D39]/15 pb-1 flex items-center justify-between">
        <span>Periode: {item.tanggal}</span>
        {isTransition ? (
          <span className="text-[10px] bg-[#001D39] text-white px-2 py-0.5 rounded-full font-bold">
            Titik Sambung (Transisi)
          </span>
        ) : isHistorical ? (
          <span className="text-[10px] bg-[#EDF4F9] text-[#49769F] px-2 py-0.5 rounded-full font-bold">
            Data Historis BI
          </span>
        ) : (
          <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded-full font-bold">
            Peramalan SARIMA
          </span>
        )}
      </div>

      {item.aktual !== null && (
        <div className="flex items-center justify-between text-[#001D39]">
          <span className="font-semibold text-[#49769F]">
            {isTransition ? "Realisasi Akhir BI:" : "Nilai Transaksi:"}
          </span>
          <span className="font-black font-mono">Rp {Number(item.aktual).toFixed(2)} Triliun</span>
        </div>
      )}

      {item.proyeksi !== null && !isTransition && (
        <div className="flex items-center justify-between text-[#10B981]">
          <span className="font-semibold text-[#001D39]">Proyeksi Peramalan:</span>
          <span className="font-black font-mono">Rp {Number(item.proyeksi).toFixed(2)} Triliun</span>
        </div>
      )}

      {item.ci80_bawah !== null && item.ci80_atas !== null && !isTransition && (
        <div className="pt-1.5 border-t border-[#001D39]/10 text-[10px] text-[#49769F]">
          <div className="flex items-center justify-between font-bold">
            <span>Rentang Keyakinan 80%:</span>
          </div>
          <div className="font-mono font-bold text-[#001D39] text-right mt-0.5">
            Rp {Number(item.ci80_bawah).toFixed(2)} T – Rp {Number(item.ci80_atas).toFixed(2)} T
          </div>
        </div>
      )}

      {isTransition && (
        <div className="text-[10px] text-[#49769F] italic pt-1 border-t border-[#001D39]/10">
          Titik temu data realisasi historis Bank Indonesia menuju lintasan peramalan 2025–2026.
        </div>
      )}
    </div>
  );
}

export default function ForecastSection({ qrisData, clusterProjData }: ForecastSectionProps) {
  const [activeTab, setActiveTab] = useState<"klaster" | "qris">("klaster");

  const combinedQris: any[] = [];
  qrisData.historical.forEach((h, idx) => {
    if (idx % 2 === 0 || idx === qrisData.historical.length - 1) {
      const isLastHistorical = idx === qrisData.historical.length - 1;
      combinedQris.push({
        tanggal: h.tanggal.substring(0, 7),
        aktual: h.nilai_transaksi_triliun,
        // Seamlessly bridge historical actuals to projection at the final observed month (2024-12)
        proyeksi: isLastHistorical ? h.nilai_transaksi_triliun : null,
        ci80_bawah: isLastHistorical ? h.nilai_transaksi_triliun : null,
        ci80_atas: isLastHistorical ? h.nilai_transaksi_triliun : null
      });
    }
  });

  qrisData.projection.forEach((p) => {
    combinedQris.push({
      tanggal: p.tanggal.substring(0, 7),
      aktual: null,
      proyeksi: p.nilai_transaksi_triliun,
      ci80_bawah: p.ci80_bawah,
      ci80_atas: p.ci80_atas
    });
  });

  return (
    <section className="w-full space-y-4">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#001D39]/10 pb-3">
        <div>
          <h2 className="text-xl font-black text-[#001D39] tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#4E8EA2]" />
            Proyeksi Masa Depan Kesiapan & Adopsi Digital
          </h2>
          <p className="text-xs text-[#49769F] font-medium">
            Peramalan deret waktu berbasis SARIMA, ETS Holt-Winters, dan Prophet dengan horizon 2026 s.d 2030
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("klaster")}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeTab === "klaster"
                ? "bg-[#BDD8E9] text-[#001D39] shadow-[1px_1px_0px_#001D39]"
                : "text-[#49769F] hover:text-[#001D39]"
            }`}
          >
            Jurang Klaster 2030
          </button>
          <button
            onClick={() => setActiveTab("qris")}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeTab === "qris"
                ? "bg-[#BDD8E9] text-[#001D39] shadow-[1px_1px_0px_#001D39]"
                : "text-[#49769F] hover:text-[#001D39]"
            }`}
          >
            Fan Chart QRIS 2026
          </button>
        </div>
      </div>

      {/* Tab 1: Cluster 2030 Projection */}
      {activeTab === "klaster" && (
        <div className="pingfest-card p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-[#001D39]/10 pb-3">
            <div>
              <div className="text-sm font-black text-[#001D39]">
                Proyeksi Kepemilikan Ponsel per Klaster Menuju 2030 (%)
              </div>
              <div className="text-xs text-[#49769F] font-medium">
                Apakah kesenjangan akan menutup dengan sendirinya tanpa intervensi afirmatif?
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-[#EF4444]/15 border-2 border-[#001D39] text-xs text-[#EF4444] font-black flex items-center gap-2 shadow-[2px_2px_0px_#001D39]">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Jurang 2024: 54,4 poin &rarr; Jurang 2030: 45,7 poin (Kesenjangan Tetap Lebar!)</span>
            </div>
          </div>

          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={clusterProjData} margin={{ top: 20, right: 15, left: 0, bottom: 10 }}>
                <CartesianGrid stroke="#001D39" strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="tahun" tick={{ fill: "#001D39", fontSize: 11, fontWeight: 700 }} />
                <YAxis
                  domain={[15, 95]}
                  tick={{ fill: "#001D39", fontSize: 10, fontWeight: 700 }}
                  width={38}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#001D39",
                    borderWidth: "2px",
                    borderRadius: "0.75rem",
                    boxShadow: "3px 3px 0px #001D39",
                    color: "#001D39",
                    fontSize: "12px",
                    fontWeight: 700
                  }}
                  formatter={(val: any) => [`${val}%`, ""]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  formatter={(value) => <span className="text-[#001D39] font-bold">{value}</span>}
                />
                <Line
                  type="monotone"
                  dataKey="Maju dan Terhubung"
                  stroke={CLUSTER_COLORS["Maju dan Terhubung"]}
                  strokeWidth={3.5}
                  dot={{ r: 4, stroke: "#001D39", strokeWidth: 1.5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Berkembang Menengah"
                  stroke={CLUSTER_COLORS["Berkembang Menengah"]}
                  strokeWidth={3}
                  dot={{ r: 4, stroke: "#001D39", strokeWidth: 1.5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Tertinggal Sedang"
                  stroke={CLUSTER_COLORS["Tertinggal Sedang"]}
                  strokeWidth={3}
                  dot={{ r: 4, stroke: "#001D39", strokeWidth: 1.5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Tertinggal Ekstrem"
                  stroke={CLUSTER_COLORS["Tertinggal Ekstrem"]}
                  strokeWidth={4}
                  strokeDasharray="4 4"
                  dot={{ r: 5, fill: "#EF4444", stroke: "#001D39", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2">
            <div className="p-3 rounded-2xl bg-[#10B981]/10 border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39]">
              <span className="font-black text-[#10B981]">Maju dan Terhubung</span>
              <div className="text-base font-black text-[#001D39] mt-1">79,1% &rarr; 85,3%</div>
              <div className="text-[10px] text-[#49769F] font-bold mt-0.5">+6,2 poin (Mendekati saturasi)</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#7BBDE8]/20 border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39]">
              <span className="font-black text-[#0284C7]">Berkembang Menengah</span>
              <div className="text-base font-black text-[#001D39] mt-1">68,2% &rarr; 78,7%</div>
              <div className="text-[10px] text-[#49769F] font-bold mt-0.5">+10,5 poin (Akselerasi cepat)</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F59E0B]/10 border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39]">
              <span className="font-black text-[#F59E0B]">Tertinggal Sedang</span>
              <div className="text-base font-black text-[#001D39] mt-1">66,6% &rarr; 77,6%</div>
              <div className="text-[10px] text-[#49769F] font-bold mt-0.5">+11,0 poin (Peningkatan organik)</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#EF4444]/10 border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39]">
              <span className="font-black text-[#EF4444]">Tertinggal Ekstrem</span>
              <div className="text-base font-black text-[#EF4444] mt-1">24,7% &rarr; 39,6%</div>
              <div className="text-[10px] text-[#EF4444] font-black mt-0.5">Tetap &lt;40% (Butuh SIGAP!)</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: QRIS 2026 Fan Chart */}
      {activeTab === "qris" && (
        <div className="pingfest-card p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-2 border-[#001D39]/10 pb-3">
            <div>
              <div className="text-sm font-black text-[#001D39]">
                Fan Chart Proyeksi Transaksi QRIS Nasional Menuju Desember 2026
              </div>
              <div className="text-xs text-[#49769F] font-medium">
                Nilai Transaksi Bulanan (Rp Triliun) • Data Historis BI 2020-2024 & Pita Keyakinan 80%
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-white border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] text-[#001D39] font-mono font-bold">
                MAPE 3-Bulan: 3,97%
              </span>
              <span className="px-3 py-1 rounded-full bg-[#10B981]/20 border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] text-[#10B981] font-black">
                Target 2026: ~Rp 114,8 T/bln
              </span>
            </div>
          </div>

          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={combinedQris} margin={{ top: 20, right: 15, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="qrisHistLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7BBDE8" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#7BBDE8" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="qrisCiLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#001D39" strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="tanggal" tick={{ fill: "#001D39", fontSize: 9, fontWeight: 700 }} />
                <YAxis tick={{ fill: "#001D39", fontSize: 10, fontWeight: 700 }} width={42} unit=" T" />
                <Tooltip content={<CustomQrisTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  formatter={(val) => (
                    <span className="text-[#001D39] font-bold">
                      {val === "aktual"
                        ? "Historis Aktual (2020-2024)"
                        : val === "proyeksi"
                        ? "Proyeksi SARIMA (2025-2026)"
                        : "Rentang Keyakinan 80%"}
                    </span>
                  )}
                />
                <ReferenceLine
                  x="2024-12"
                  stroke="#001D39"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  opacity={0.35}
                />
                <Area
                  type="monotone"
                  dataKey="ci80_atas"
                  stroke="#10B981"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  fill="url(#qrisCiLight)"
                  name="ci"
                />
                <Area
                  type="monotone"
                  dataKey="ci80_bawah"
                  stroke="#10B981"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  fill="transparent"
                  legendType="none"
                  name="ci_low"
                />
                <Area
                  type="monotone"
                  dataKey="aktual"
                  stroke="#001D39"
                  strokeWidth={2.5}
                  fill="url(#qrisHistLight)"
                  name="aktual"
                />
                <Line
                  type="monotone"
                  dataKey="proyeksi"
                  stroke="#10B981"
                  strokeWidth={3}
                  strokeDasharray="4 4"
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    if (!cx || !cy) return null;
                    if (payload.tanggal === "2024-12") {
                      return (
                        <circle
                          key={`dot-${payload.tanggal}`}
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill="#001D39"
                          stroke="#7BBDE8"
                          strokeWidth={2.5}
                        />
                      );
                    }
                    return (
                      <circle
                        key={`dot-${payload.tanggal}`}
                        cx={cx}
                        cy={cy}
                        r={3}
                        fill="#10B981"
                        stroke="#001D39"
                        strokeWidth={1.5}
                      />
                    );
                  }}
                  name="proyeksi"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EDF4F9] border-2 border-[#001D39] shadow-[2px_2px_0px_#001D39] text-xs text-[#001D39] flex items-start gap-2.5 font-medium">
            <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-black">Analisis Pembayaran Digital &amp; Kebijakan:</strong> Transaksi QRIS terproyeksi tumbuh kontinu dari realisasi akhir Bank Indonesia Rp 53,83 T (Desember 2024) menuju proyeksi model SARIMA Rp 114,82 T (Desember 2026). Penurunan musiman pada Januari 2025 mencerminkan siklus normal pasca-libur akhir tahun, sebelum kembali melonjak pada periode Ramadan–Idulfitri. Saat ini &gt;75% volume transaksi terkonsentrasi di Jawa–Bali, menegaskan urgensi pemerataan infrastruktur digital SIGAP agar inklusi keuangan digital menyentuh seluruh pelosok Indonesia.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
