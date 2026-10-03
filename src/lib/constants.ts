export const COLORS = {
  navyMidnight: "#001D39",
  navyDeep: "#0A4174",
  steelBlue: "#49769F",
  tealOcean: "#4E8EA2",
  mutedTeal: "#6EA2B3",
  skyBlue: "#7BBDE8",
  iceBlue: "#BDD8E9",

  // Semantic Cluster Colors
  clusterMaju: "#10B981",       // Emerald Green
  clusterBerkembang: "#7BBDE8", // Sky Blue
  clusterTertinggal: "#F59E0B", // Amber
  clusterEkstrem: "#EF4444",    // Crimson Red

  // LISA Categories
  lisaHighHigh: "#DC2626",      // Merah tua (Hotspot)
  lisaLowLow: "#2563EB",        // Biru tua (Coldspot)
  lisaHighLow: "#F97316",       // Oranye (Outlier Spasial)
  lisaLowHigh: "#8B5CF6",       // Ungu (Outlier Spasial)
  lisaNotSig: "#475569",        // Slate
};

export const CLUSTER_NAMES: Record<number, string> = {
  2: "Maju dan Terhubung",
  3: "Berkembang Menengah",
  1: "Tertinggal Sedang",
  0: "Tertinggal Ekstrem",
};

export const CLUSTER_COLORS: Record<string, string> = {
  "Maju dan Terhubung": COLORS.clusterMaju,
  "Berkembang Menengah": COLORS.clusterBerkembang,
  "Tertinggal Sedang": COLORS.clusterTertinggal,
  "Tertinggal Ekstrem": COLORS.clusterEkstrem,
};

export const CLUSTER_DESCRIPTIONS: Record<string, { label: string; count: number; desc: string; icon: string }> = {
  "Maju dan Terhubung": {
    label: "Sang Juara Digital",
    count: 6,
    desc: "Infrastruktur prima, penetrasi ponsel 72–84%, IPM >74, dan kapasitas fiskal tinggi. Berperan sebagai lokomotif ekonomi digital nasional.",
    icon: "Crown"
  },
  "Berkembang Menengah": {
    label: "Pengejar yang Menjanjikan",
    count: 8,
    desc: "Konektivitas stabil (64–71%) dan modal manusia kompeten, namun akselerasi ekonomi digital produktif masih perlu dipacu.",
    icon: "TrendingUp"
  },
  "Tertinggal Sedang": {
    label: "Mayoritas yang Tertahan",
    count: 22,
    desc: "Kelompok mayoritas (22 provinsi). Sinyal 4G tersedia namun kualitas fluktuatif serta daya beli perangkat masyarakat masih terbatas.",
    icon: "ShieldAlert"
  },
  "Tertinggal Ekstrem": {
    label: "Terputus dari Sinyal",
    count: 2,
    desc: "Papua Tengah & Papua Pegunungan. Penetrasi ponsel sangat rendah (15–34%) akibat isolasi geografis dan keterbatasan jaringan terestrial.",
    icon: "AlertOctagon"
  }
};

export const NATIONAL_BASELINE = {
  hp_seluler: 66.7,
  ipm: 74.0,
  rls: 8.85,
  pdrb_kapita: 75000,
  tpt: 4.5,
  populasi_rentan_juta: 57.2,
  qris_des_2026_triliun: 114.82
};

export const CLUSTER_SENSITIVITY = {
  "Tertinggal Ekstrem": { infra: 0.45, sdm: 0.20, device: 0.35, maxImpact: 26 },
  "Tertinggal Sedang":  { infra: 0.28, sdm: 0.32, device: 0.22, maxImpact: 16 },
  "Berkembang Menengah": { infra: 0.18, sdm: 0.38, device: 0.12, maxImpact: 10 },
  "Maju dan Terhubung": { infra: 0.10, sdm: 0.25, device: 0.08, maxImpact: 5 },
};

export const ROI_EFFICIENCY = {
  "Tertinggal Ekstrem": 4.26, // Poin kenaikan kepemilikan ponsel per Rp 1 Triliun
  "Tertinggal Sedang": 1.57,
  "Berkembang Menengah": 1.15,
  "Maju dan Terhubung": 0.80,
};
