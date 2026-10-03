"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import { ProvinceData } from "@/lib/types";
import { NATIONAL_BASELINE } from "@/lib/constants";

interface RadarProfileProps {
  province: ProvinceData;
}

export default function RadarProfile({ province }: RadarProfileProps) {
  const data = [
    {
      subject: "Akses HP",
      Provinsi: Math.min(100, Math.round(province.hp_seluler_2024)),
      Nasional: Math.round(NATIONAL_BASELINE.hp_seluler),
      fullMark: 100
    },
    {
      subject: "IPM",
      Provinsi: Math.min(100, Math.round(province.ipm_2024)),
      Nasional: Math.round(NATIONAL_BASELINE.ipm),
      fullMark: 100
    },
    {
      subject: "Lama Sekolah",
      Provinsi: Math.min(100, Math.round((province.rls_2024 / 12) * 100)),
      Nasional: Math.round((NATIONAL_BASELINE.rls / 12) * 100),
      fullMark: 100
    },
    {
      subject: "Ekonomi PDRB",
      Provinsi: Math.min(100, Math.round(((province.pdrb_log - 9.5) / 3.5) * 100)),
      Nasional: Math.round(((Math.log(NATIONAL_BASELINE.pdrb_kapita) - 9.5) / 3.5) * 100),
      fullMark: 100
    },
    {
      subject: "Penyerapan Kerja",
      Provinsi: Math.max(0, Math.min(100, Math.round(100 - province.tpt_2024 * 10))),
      Nasional: Math.round(100 - NATIONAL_BASELINE.tpt * 10),
      fullMark: 100
    }
  ];

  return (
    <div className="w-full h-56 relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#001D39" strokeOpacity={0.15} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#001D39", fontSize: 10, fontWeight: 700 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name={province.Provinsi}
            dataKey="Provinsi"
            stroke="#001D39"
            strokeWidth={2}
            fill="#7BBDE8"
            fillOpacity={0.65}
          />
          <Radar
            name="Rata-rata Nasional"
            dataKey="Nasional"
            stroke="#F59E0B"
            strokeWidth={2}
            fill="#F59E0B"
            fillOpacity={0.2}
            strokeDasharray="3 3"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderColor: "#001D39",
              borderWidth: "2px",
              borderRadius: "0.75rem",
              boxShadow: "3px 3px 0px #001D39",
              color: "#001D39",
              fontSize: "11px",
              fontWeight: 600
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "4px" }}
            formatter={(value) => <span className="text-[#001D39] font-bold">{value}</span>}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
