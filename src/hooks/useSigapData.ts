"use client";

import { useEffect, useState } from "react";
import { ProvinceData, QrisForecastData, ClusterProjectionItem } from "@/lib/types";

// In-memory cache across pages during navigation
let cachedProvinces: ProvinceData[] | null = null;
let cachedGeoData: any = null;
let cachedQrisData: QrisForecastData | null = null;
let cachedClusterProj: ClusterProjectionItem[] | null = null;

export function useSigapData() {
  const [provinces, setProvinces] = useState<ProvinceData[]>(cachedProvinces || []);
  const [geoData, setGeoData] = useState<any>(cachedGeoData);
  const [qrisData, setQrisData] = useState<QrisForecastData | null>(cachedQrisData);
  const [clusterProjData, setClusterProjData] = useState<ClusterProjectionItem[]>(cachedClusterProj || []);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(null);
  const [loading, setLoading] = useState(!cachedProvinces);

  useEffect(() => {
    if (cachedProvinces && cachedGeoData && cachedQrisData && cachedClusterProj) {
      setProvinces(cachedProvinces);
      setGeoData(cachedGeoData);
      setQrisData(cachedQrisData);
      setClusterProjData(cachedClusterProj);
      if (!selectedProvince) {
        const defaultProv = cachedProvinces.find(p => p.Provinsi === "Papua Pegunungan") || cachedProvinces[0];
        setSelectedProvince(defaultProv);
      }
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const [provRes, geoRes, qrisRes, clusterRes] = await Promise.all([
          fetch("/data/provinces.json"),
          fetch("/data/indonesia_38prov.json"),
          fetch("/data/qris_forecast.json"),
          fetch("/data/cluster_projection_2030.json")
        ]);

        const provJson = await provRes.json();
        const geoJson = await geoRes.json();
        const qrisJson = await qrisRes.json();
        const clusterJson = await clusterRes.json();

        cachedProvinces = provJson;
        cachedGeoData = geoJson;
        cachedQrisData = qrisJson;
        cachedClusterProj = clusterJson;

        setProvinces(provJson);
        setGeoData(geoJson);
        setQrisData(qrisJson);
        setClusterProjData(clusterJson);

        const defaultProv = provJson.find((p: ProvinceData) => p.Provinsi === "Papua Pegunungan") || provJson[0];
        setSelectedProvince(defaultProv);
      } catch (e) {
        console.error("Error loading SIGAP data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedProvince]);

  return {
    provinces,
    geoData,
    qrisData,
    clusterProjData,
    selectedProvince,
    setSelectedProvince,
    loading
  };
}
