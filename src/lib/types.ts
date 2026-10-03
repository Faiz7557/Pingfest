export interface ParadoxInfo {
  is_paradox: boolean;
  title: string;
  description: string;
}

export interface DdiInfo {
  quadrant: number;
  label: string;
  infraScore: number;
  sdmScore: number;
}

export interface ProvinceData {
  Provinsi: string;
  ipm_2024: number;
  rls_2024: number;
  hp_seluler_2024: number;
  pdrb_kapita_2024: number;
  tpt_2024: number;
  lat: number;
  lon: number;
  klaster: number;
  nama_klaster: string;
  indeks_kerentanan: number;
  peringkat: number;
  pdrb_log: number;
  lisa: string;
  gwr_rls_2024: number;
  gwr_ipm_2024: number;
  gwr_pdrb_log: number;
  gwr_tpt_2024: number;
  paradox: ParadoxInfo | null;
  ddi: DdiInfo;
}

export interface MoranItem {
  variabel: string;
  "Moran's I": number;
  p: number;
  pola: string;
}

export interface ModelComparisonItem {
  Model: string;
  AICc: number;
  "R2/pseudo-R2": number;
}

export interface SpilloverImpactItem {
  variabel: string;
  langsung: number;
  "tak_langsung (spillover)": number;
  total: number;
  "spillover_%": number;
}

export interface QrisHistPoint {
  tanggal: string;
  nilai_transaksi_triliun: number;
  pengguna_qris_juta: number;
  merchant_qris_juta: number;
  volume_transaksi_juta: number;
}

export interface QrisProjPoint {
  tanggal: string;
  nilai_transaksi_triliun: number;
  ci80_bawah: number;
  ci80_atas: number;
}

export interface QrisForecastData {
  historical: QrisHistPoint[];
  projection: QrisProjPoint[];
  cv_comparison: Array<{
    model: string;
    h: number;
    mape: number;
    rmse: number;
    smape: number;
  }>;
}

export interface ClusterProjectionItem {
  tahun: number;
  "Maju dan Terhubung": number;
  "Berkembang Menengah": number;
  "Tertinggal Sedang": number;
  "Tertinggal Ekstrem": number;
}

export type MapLayerMode = "klaster" | "kerentanan" | "lisa" | "gwr";
