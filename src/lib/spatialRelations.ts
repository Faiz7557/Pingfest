import { ProvinceData } from "./types";

export interface SpatialNeighbor {
  provinsi: string;
  distanceKm: number;
  lat: number;
  lon: number;
  nama_klaster: string;
  lisa: string;
  hp_seluler_2024: number;
  ipm_2024: number;
  indeks_kerentanan: number;
  relationType: "knn" | "cluster" | "lisa";
}

export interface SpatialRelationsResult {
  source: ProvinceData;
  knnNeighbors: SpatialNeighbor[];
  clusterPeers: SpatialNeighbor[];
  lisaPeers: SpatialNeighbor[];
  allRelated: SpatialNeighbor[];
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function getSpatialRelations(
  target: ProvinceData,
  allProvinces: ProvinceData[],
  k: number = 4
): SpatialRelationsResult {
  const distances: (SpatialNeighbor & { d: number })[] = [];

  for (const p of allProvinces) {
    if (p.Provinsi === target.Provinsi) continue;
    const d = haversineDistance(target.lat, target.lon, p.lat, p.lon);
    distances.push({
      provinsi: p.Provinsi,
      distanceKm: d,
      lat: p.lat,
      lon: p.lon,
      nama_klaster: p.nama_klaster,
      lisa: p.lisa,
      hp_seluler_2024: p.hp_seluler_2024,
      ipm_2024: p.ipm_2024,
      indeks_kerentanan: p.indeks_kerentanan,
      relationType: "knn",
      d
    });
  }

  // Sort by distance ascending
  distances.sort((a, b) => a.d - b.d);

  // K=4 nearest spatial neighbors (representing spatial weights matrix W_ij)
  const knnNeighbors = distances.slice(0, k);

  // Same cluster peers
  const clusterPeers = distances
    .filter((d) => d.nama_klaster === target.nama_klaster)
    .map((d) => ({ ...d, relationType: "cluster" as const }));

  // Same LISA corridor peers (for significant LISA categories)
  const lisaPeers =
    target.lisa && target.lisa !== "Tidak signifikan"
      ? distances
          .filter((d) => d.lisa === target.lisa)
          .map((d) => ({ ...d, relationType: "lisa" as const }))
      : [];

  // Combine unique related provinces (priority: KNN first, then cluster peers)
  const seen = new Set<string>();
  const allRelated: SpatialNeighbor[] = [];

  for (const n of knnNeighbors) {
    if (!seen.has(n.provinsi)) {
      seen.add(n.provinsi);
      allRelated.push(n);
    }
  }

  for (const c of clusterPeers.slice(0, 3)) {
    if (!seen.has(c.provinsi)) {
      seen.add(c.provinsi);
      allRelated.push(c);
    }
  }

  return {
    source: target,
    knnNeighbors,
    clusterPeers,
    lisaPeers,
    allRelated
  };
}

/**
 * Generates points forming a smooth curved Bezier arc between two geographic coordinates
 */
export function getCurvedArc(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  numPoints: number = 20
): [number, number][] {
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const dist = Math.sqrt(dLat * dLat + dLon * dLon);
  if (dist === 0) return [[lat1, lon1]];

  // Perpendicular vector for arc bowing (curves slightly towards equator/north for elegance)
  const normalLat = -dLon / dist;
  const normalLon = dLat / dist;

  // Curvature amount based on distance
  const curveFactor = Math.min(dist * 0.16, 2.8);
  const midLat = (lat1 + lat2) / 2 + normalLat * curveFactor;
  const midLon = (lon1 + lon2) / 2 + normalLon * curveFactor;

  const points: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat =
      (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * midLat + t * t * lat2;
    const lon =
      (1 - t) * (1 - t) * lon1 + 2 * (1 - t) * t * midLon + t * t * lon2;
    points.push([lat, lon]);
  }
  return points;
}

export type NavigationDirection = "left" | "right" | "up" | "down";

/**
 * Seamlessly calculates the next province in the given compass/arrow direction.
 * Uses geographic lat/lon with distance weighting and seamless circular wrapping.
 */
export function getNextProvinceDirectional(
  current: ProvinceData,
  direction: NavigationDirection,
  allProvinces: ProvinceData[]
): ProvinceData {
  let candidates: ProvinceData[] = [];

  if (direction === "right") {
    // Moving East (Timur)
    candidates = allProvinces.filter((p) => p.lon > current.lon + 0.25);
  } else if (direction === "left") {
    // Moving West (Barat)
    candidates = allProvinces.filter((p) => p.lon < current.lon - 0.25);
  } else if (direction === "up") {
    // Moving North (Utara)
    candidates = allProvinces.filter((p) => p.lat > current.lat + 0.25);
  } else if (direction === "down") {
    // Moving South (Selatan)
    candidates = allProvinces.filter((p) => p.lat < current.lat - 0.25);
  }

  if (candidates.length === 0) {
    // Wrap around seamlessly across Indonesia
    if (direction === "right") {
      return [...allProvinces].sort((a, b) => a.lon - b.lon)[0] || current;
    } else if (direction === "left") {
      return [...allProvinces].sort((a, b) => b.lon - a.lon)[0] || current;
    } else if (direction === "up") {
      return [...allProvinces].sort((a, b) => a.lat - b.lat)[0] || current;
    } else if (direction === "down") {
      return [...allProvinces].sort((a, b) => b.lat - a.lat)[0] || current;
    }
  }

  // Weight by geodesic distance to choose the most natural neighboring province in that direction
  candidates.sort((a, b) => {
    const distA = haversineDistance(current.lat, current.lon, a.lat, a.lon);
    const distB = haversineDistance(current.lat, current.lon, b.lat, b.lon);
    return distA - distB;
  });

  return candidates[0] || current;
}

