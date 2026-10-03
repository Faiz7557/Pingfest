"use client";

import React, { useState } from "react";
import TopNav from "@/components/layout/TopNav";
import {
  Database,
  BookOpen,
  Scale,
  Cpu,
  ExternalLink,
  Copy,
  Check,
  Search,
  Filter,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  Bookmark
} from "lucide-react";

interface ReferenceItem {
  id: string;
  category: "data" | "academic" | "policy" | "software";
  categoryLabel: string;
  title: string;
  authorsOrSource: string;
  year: string;
  publisherOrOrg: string;
  description: string;
  roleInSigap: string;
  url?: string;
  apaCitation: string;
  tags: string[];
}

const referencesData: ReferenceItem[] = [
  // Sumber Data Resmi (Datasets)
  {
    id: "bps-hp-2024",
    category: "data",
    categoryLabel: "Sumber Data Resmi",
    title: "Persentase Penduduk yang Memiliki/Menguasai Telepon Seluler Menurut Provinsi dan Klasifikasi Daerah 2024",
    authorsOrSource: "Badan Pusat Statistik (BPS) Republik Indonesia",
    year: "2024",
    publisherOrOrg: "BPS RI (Publikasi Statistik Telekomunikasi)",
    description: "Data primer pengukuran akses perangkat telekomunikasi di 38 provinsi Indonesia, mencakup disparitas wilayah perkotaan dan perdesaan.",
    roleInSigap: "Variabel dependen utama (Y) pada model regresi spasial serta indikator pilar akses fisik kesiapan digital (skala 15,76% - 83,90%).",
    url: "https://www.bps.go.id/en/statistics-table/2/Mzk1IzI=/persentase-penduduk-yang-memiliki-menguasai-telepon-seluler-menurut-provinsi-dan-klasifikasi-daerah.html",
    apaCitation: "Badan Pusat Statistik. (2024). Persentase penduduk yang memiliki/menguasai telepon seluler menurut provinsi dan klasifikasi daerah 2024. Jakarta: Badan Pusat Statistik RI.",
    tags: ["BPS", "Akses Ponsel", "38 Provinsi", "Variabel Dependen"]
  },
  {
    id: "bps-ipm-rls-2024",
    category: "data",
    categoryLabel: "Sumber Data Resmi",
    title: "Indeks Pembangunan Manusia (Metode Baru) dan Rata-rata Lama Sekolah (RLS) Menurut Provinsi 2024",
    authorsOrSource: "Badan Pusat Statistik (BPS) Republik Indonesia",
    year: "2024",
    publisherOrOrg: "BPS RI (Berita Resmi Statistik IPM)",
    description: "Ukuran komposit pencapaian pembangunan manusia (kesehatan, pengetahuan, dan standar hidup layak) beserta modal dasar literasi.",
    roleInSigap: "Indikator kesiapan sumber daya manusia (SDM) dan daya serap teknologi digital dalam klasterisasi K-Means dan matriks kuadran DDI.",
    url: "https://www.bps.go.id",
    apaCitation: "Badan Pusat Statistik. (2024). Indeks pembangunan manusia dan indikator pendidikan provinsi 2024. Jakarta: BPS RI.",
    tags: ["BPS", "IPM", "RLS", "Modal Manusia"]
  },
  {
    id: "bps-pdrb-tpt-2024",
    category: "data",
    categoryLabel: "Sumber Data Resmi",
    title: "Produk Domestik Regional Bruto (PDRB) ADHB per Kapita dan Tingkat Pengangguran Terbuka (TPT) 2024",
    authorsOrSource: "Badan Pusat Statistik (BPS) Republik Indonesia",
    year: "2024",
    publisherOrOrg: "BPS RI (Statistik Ekonomi Regional & Ketenagakerjaan)",
    description: "Pendapatan rata-rata per kapita nominal tahunan serta persentase angkatan kerja yang belum terserap pada pasar tenaga kerja.",
    roleInSigap: "Mengungkap paradoks ekonomi-akses (Papua Tengah PDRB #8 tapi akses #37) serta variabel penjelas regresi spasial.",
    url: "https://www.bps.go.id",
    apaCitation: "Badan Pusat Statistik. (2024). Produk domestik regional bruto dan ketenagakerjaan provinsi 2024. Jakarta: BPS RI.",
    tags: ["BPS", "PDRB", "Pengangguran", "Paradoks Ekonomi"]
  },
  {
    id: "apjii-survei-2024",
    category: "data",
    categoryLabel: "Sumber Data Resmi",
    title: "Survei Penetrasi & Perilaku Pengguna Internet Indonesia 2024: Menembus 221,5 Juta Jiwa",
    authorsOrSource: "Asosiasi Penyelenggara Jasa Internet Indonesia (APJII)",
    year: "2024",
    publisherOrOrg: "Pusat Kajian APJII & Databoks Katadata",
    description: "Laporan komprehensif tingkat adopsi internet nasional (penetrasi 79,5%) dan estimasi ±57 juta penduduk yang belum tersentuh jaringan.",
    roleInSigap: "Dasar penentuan baseline jurang digital nasional dan perumusan latar belakang urgensi sistem pendukung keputusan presisi.",
    url: "https://apjii.or.id/berita/d/apjii-jumlah-pengguna-internet-indonesia-tembus-221-juta-orang",
    apaCitation: "Asosiasi Penyelenggara Jasa Internet Indonesia. (2024). Laporan survei penetrasi internet Indonesia 2024. Jakarta: APJII.",
    tags: ["APJII", "Penetrasi Internet", "57 Juta Jiwa", "Makro Nasional"]
  },
  {
    id: "bi-qris-2024",
    category: "data",
    categoryLabel: "Sumber Data Resmi",
    title: "Statistik Sistem Pembayaran dan Deret Waktu Transaksi Bulanan QRIS Nasional (2020–2024)",
    authorsOrSource: "Bank Indonesia (BI)",
    year: "2024",
    publisherOrOrg: "Departemen Kebijakan Sistem Pembayaran Bank Indonesia",
    description: "Data historis bulanan volume dan nominal transaksi Quick Response Code Indonesian Standard (QRIS) dengan 54,1 juta pengguna aktif.",
    roleInSigap: "Data deret waktu (time-series) untuk peramalan horizon 2025–2026 menggunakan model SARIMA, Holt-Winters ETS, dan Prophet.",
    url: "https://www.bi.go.id",
    apaCitation: "Bank Indonesia. (2024). Perkembangan transaksi pembayaran digital dan QRIS nasional 2020-2024. Jakarta: Bank Indonesia.",
    tags: ["Bank Indonesia", "QRIS", "Fintech", "Time Series"]
  },
  {
    id: "bakti-kominfo-2024",
    category: "data",
    categoryLabel: "Sumber Data Resmi",
    title: "Laporan Capaian Infrastruktur Digital 3T: BTS 4G dan Utilisasi Kapasitas Satelit SATRIA-1",
    authorsOrSource: "Badan Aksesibilitas Telekomunikasi dan Informasi (BAKTI) Kominfo",
    year: "2024",
    publisherOrOrg: "Kementerian Komunikasi dan Informatika RI",
    description: "Dokumentasi penyebaran 6.747 BTS 4G di wilayah Terdepan, Terluar, dan Tertinggal (3T) serta pemetaan 2.000 titik desa blankspot.",
    roleInSigap: "Rujukan formulasi pilar solusi konektivitas fisik non-terestrial dan simulator alokasi efisiensi dana Universal Service Obligation (USO).",
    url: "https://www.baktikominfo.id",
    apaCitation: "BAKTI Kominfo. (2024). Laporan operasionalisasi satelit SATRIA-1 dan penggelaran BTS 3T. Jakarta: Kementerian Komunikasi dan Informatika.",
    tags: ["BAKTI", "BTS 4G", "SATRIA-1", "Daerah 3T"]
  },

  // Pustaka Akademik (Academic Bibliography)
  {
    id: "anselin-1995-lisa",
    category: "academic",
    categoryLabel: "Pustaka Akademik",
    title: "Local Indicators of Spatial Association—LISA",
    authorsOrSource: "Anselin, Luc",
    year: "1995",
    publisherOrOrg: "Geographical Analysis, Vol. 27(2), pp. 93–115",
    description: "Karya monumental yang memperkenalkan dekomposisi statistik autokorelasi spasial global ke dalam indikator asosiasi lokal.",
    roleInSigap: "Dasar teoritis pemetaan kuadran LISA (Moran's I = 0,406; p = 0,001) untuk mengidentifikasi kantong spasial Low-Low (Papua, NTB) dan High-High (Kalimantan).",
    url: "https://doi.org/10.1111/j.1538-4632.1995.tb00338.x",
    apaCitation: "Anselin, L. (1995). Local Indicators of Spatial Association—LISA. Geographical Analysis, 27(2), 93–115. https://doi.org/10.1111/j.1538-4632.1995.tb00338.x",
    tags: ["Autokorelasi Spasial", "LISA", "Moran's I", "Klaster Lokal"]
  },
  {
    id: "brunsdon-1996-gwr",
    category: "academic",
    categoryLabel: "Pustaka Akademik",
    title: "Geographically Weighted Regression: A Method for Exploring Spatial Nonstationarity",
    authorsOrSource: "Brunsdon, Chris, Fotheringham, A. Stewart, & Charlton, Martin E.",
    year: "1996",
    publisherOrOrg: "Geographical Analysis, Vol. 28(4), pp. 281–298",
    description: "Metodologi regresi berbobot geografis yang mengizinkan koefisien parameter bervariasi secara kontinu melintasi ruang geografis.",
    roleInSigap: "Fondasi matematis model utama GWR (R² = 0,915; AICc = 229,6) yang membuktikan faktor determinan kesiapan digital bersifat heterogen antarwilayah.",
    url: "https://doi.org/10.1111/j.1538-4632.1996.tb00936.x",
    apaCitation: "Brunsdon, C., Fotheringham, A. S., & Charlton, M. E. (1996). Geographically weighted regression: A method for exploring spatial nonstationarity. Geographical Analysis, 28(4), 281–298. https://doi.org/10.1111/j.1538-4632.1996.tb00936.x",
    tags: ["GWR", "Nonstasioneritas", "Regresi Spasial", "Koefisien Lokal"]
  },
  {
    id: "fotheringham-2017-mgwr",
    category: "academic",
    categoryLabel: "Pustaka Akademik",
    title: "Multiscale Geographically Weighted Regression (MGWR)",
    authorsOrSource: "Fotheringham, A. Stewart, Yang, Wenbai, & Kang, Wei",
    year: "2017",
    publisherOrOrg: "Annals of the American Association of Geographers, Vol. 107(6), pp. 1247–1265",
    description: "Pengembangan GWR dengan bandwidth bervariasi per kovariat, membedakan pengaruh variabel berskala global vs pengaruh berskala sangat lokal.",
    roleInSigap: "Menganalisis elastisitas spesifik provinsi pada intervensi pendidikan vs ekonomi terhadap penyerapan digital.",
    url: "https://doi.org/10.1080/24694452.2017.1352480",
    apaCitation: "Fotheringham, A. S., Yang, W., & Kang, W. (2017). Multiscale geographically weighted regression (MGWR). Annals of the American Association of Geographers, 107(6), 1247–1265. https://doi.org/10.1080/24694452.2017.1352480",
    tags: ["MGWR", "Bandwidth", "Ekonometrika Spasial"]
  },
  {
    id: "macqueen-1967-kmeans",
    category: "academic",
    categoryLabel: "Pustaka Akademik",
    title: "Some Methods for Classification and Analysis of Multivariate Observations",
    authorsOrSource: "MacQueen, James",
    year: "1967",
    publisherOrOrg: "Proc. 5th Berkeley Symp. on Math. Statist. and Prob., Vol. 1, pp. 281–297",
    description: "Algoritma partisi klaster tak-terawasi (unsupervised) berbasis minimisasi varians kuadrat jarak Euclidean terhadap centroid.",
    roleInSigap: "Algoritma pengelompokan 38 provinsi ke dalam 4 klaster strategis (Maju, Berkembang, Tertinggal Sedang, Tertinggal Ekstrem).",
    apaCitation: "MacQueen, J. (1967). Some methods for classification and analysis of multivariate observations. Proceedings of the 5th Berkeley Symposium on Mathematical Statistics and Probability, 1(14), 281–297.",
    tags: ["K-Means", "Unsupervised AI", "Segmentasi Wilayah"]
  },
  {
    id: "rousseeuw-1987-silhouette",
    category: "academic",
    categoryLabel: "Pustaka Akademik",
    title: "Silhouettes: A Graphical Aid to the Interpretation and Validation of Cluster Analysis",
    authorsOrSource: "Rousseeuw, Peter J.",
    year: "1987",
    publisherOrOrg: "Journal of Computational and Applied Mathematics, Vol. 20, pp. 53–65",
    description: "Metode kuantitatif pengujian separabilitas dan kohesi klaster untuk menentukan jumlah klaster k optimal secara objektif.",
    roleInSigap: "Validasi konfigurasi 4 klaster SIGAP dengan Silhouette Coefficient sebesar 0,424 dan Davies-Bouldin Index 0,678.",
    url: "https://doi.org/10.1016/0377-0427(87)90125-7",
    apaCitation: "Rousseeuw, P. J. (1987). Silhouettes: A graphical aid to the interpretation and validation of cluster analysis. Journal of Computational and Applied Mathematics, 20, 53–65. https://doi.org/10.1016/0377-0427(87)90125-7",
    tags: ["Silhouette Score", "Evaluasi Model", "Validasi Klaster"]
  },
  {
    id: "taylor-letham-2018-prophet",
    category: "academic",
    categoryLabel: "Pustaka Akademik",
    title: "Forecasting at Scale",
    authorsOrSource: "Taylor, Sean J., & Letham, Benjamin",
    year: "2018",
    publisherOrOrg: "The American Statistician, Vol. 72(1), pp. 37–45",
    description: "Model deret waktu aditif modular yang menggabungkan komponen tren non-linear, efek musiman jamak, dan dampak libur nasional.",
    roleInSigap: "Salah satu ensemble model peramalan transaksi QRIS nasional hingga 2026 bersama SARIMA dan ETS (akurasi ensemble MAPE: 3,97%).",
    url: "https://doi.org/10.1080/00031305.2017.1380080",
    apaCitation: "Taylor, S. J., & Letham, B. (2018). Forecasting at scale. The American Statistician, 72(1), 37–45. https://doi.org/10.1080/00031305.2017.1380080",
    tags: ["Prophet", "Time Series", "Machine Learning", "QRIS Forecast"]
  },
  {
    id: "vandijk-2020-digital-divide",
    category: "academic",
    categoryLabel: "Pustaka Akademik",
    title: "The Digital Divide",
    authorsOrSource: "Van Dijk, Jan A. G. M.",
    year: "2020",
    publisherOrOrg: "Cambridge: Polity Press / John Wiley & Sons",
    description: "Kerangka teoritis komprehensif evolusi jurang digital: dari kesenjangan tingkat pertama (akses fisik) menuju tingkat kedua (literasi/keahlian) dan ketiga (hasil sosial-ekonomi).",
    roleInSigap: "Fondasi konseptual pembagian matrik DDI kuadran 2x2 (Akses Fisik vs Kapasitas SDM) untuk mencegah pendekatan seragam infrastruktur saja.",
    apaCitation: "Van Dijk, J. A. (2020). The digital divide. Cambridge: Polity Press.",
    tags: ["Digital Divide", "Teori Sosiologi Digital", "Akses vs Literasi"]
  },

  // Landasan Kebijakan & Regulasi Hukum
  {
    id: "uu-59-2024-rpjpn",
    category: "policy",
    categoryLabel: "Regulasi & Kebijakan",
    title: "Undang-Undang Republik Indonesia Nomor 59 Tahun 2024 tentang Rencana Pembangunan Jangka Panjang Nasional (RPJPN) 2025–2045",
    authorsOrSource: "Pemerintah Republik Indonesia & DPR RI",
    year: "2024",
    publisherOrOrg: "Lembaran Negara Republik Indonesia Tahun 2024 No. 182",
    description: "Pedoman induk arah pembangunan 20 tahun menuju visi 'Indonesia Emas 2045' dengan pilar transformasi sosial, ekonomi, dan tata kelola berbasis digital.",
    roleInSigap: "Penyelarasan target horizon 2030 & 2045, indikator pemerataan wilayah Sasaran Pokok 4, serta pemenuhan transformasi digital inklusif.",
    apaCitation: "Republik Indonesia. (2024). Undang-Undang Nomor 59 Tahun 2024 tentang Rencana Pembangunan Jangka Panjang Nasional 2025–2045. Jakarta: Sekretariat Negara.",
    tags: ["UU No. 59/2024", "RPJPN", "Indonesia Emas 2045", "Regulasi Induk"]
  },
  {
    id: "perpres-95-2018-spbe",
    category: "policy",
    categoryLabel: "Regulasi & Kebijakan",
    title: "Peraturan Presiden Nomor 95 Tahun 2018 tentang Sistem Pemerintahan Berbasis Elektronik (SPBE)",
    authorsOrSource: "Presiden Republik Indonesia",
    year: "2018",
    publisherOrOrg: "Lembaran Negara Republik Indonesia Tahun 2018 No. 182",
    description: "Kerangka hukum tata kelola pemerintahan digital yang mewajibkan interoperabilitas layanan, keterpaduan data, dan arsitektur SPBE nasional.",
    roleInSigap: "Arsitektur integrasi sistem SIGAP sebagai modul pendukung keputusan (*decision support system*) terhubung ke pusat data nasional Bappenas.",
    apaCitation: "Republik Indonesia. (2018). Peraturan Presiden Nomor 95 Tahun 2018 tentang Sistem Pemerintahan Berbasis Elektronik. Jakarta: Sekretariat Negara.",
    tags: ["Perpres SPBE", "Government Tech", "Decision Support System"]
  },
  {
    id: "peta-jalan-digital-kominfo",
    category: "policy",
    categoryLabel: "Regulasi & Kebijakan",
    title: "Peta Jalan Indonesia Digital 2021–2024 & Kerangka Transformasi Digital Daerah",
    authorsOrSource: "Kementerian Komunikasi dan Informatika RI",
    year: "2021",
    publisherOrOrg: "Kemenkominfo RI",
    description: "Dokumen strategis 4 pilar transformasi digital nasional: Infrastruktur Digital, Tata Kelola Pemerintahan Digital, Ekonomi Digital, dan Masyarakat Digital.",
    roleInSigap: "Penyelarasan matriks rekomendasi kebijakan pada modul 'Solusi & 2045' dan targeting pendanaan program USO.",
    apaCitation: "Kementerian Komunikasi dan Informatika. (2021). Peta jalan Indonesia digital 2021-2024. Jakarta: Kementerian Kominfo RI.",
    tags: ["Kominfo", "Roadmap Digital", "Pilar Pembangunan"]
  },
  {
    id: "un-sdgs-2030",
    category: "policy",
    categoryLabel: "Regulasi & Kebijakan",
    title: "The 2030 Agenda for Sustainable Development Goals (SDGs)",
    authorsOrSource: "United Nations (PBB)",
    year: "2015",
    publisherOrOrg: "United Nations Department of Economic and Social Affairs",
    description: "Agenda pembangunan global 17 tujuan keberlanjutan menuju tahun 2030 yang diadopsi oleh seluruh negara anggota PBB termasuk Indonesia.",
    roleInSigap: "Penyelarasan target SDG 9 (Infrastruktur & Inovasi, target 9.c akses TIK), SDG 10 (Berkurangnya Kesenjangan), dan SDG 11 (Kota/Permukiman Berkelanjutan).",
    url: "https://sdgs.un.org/goals",
    apaCitation: "United Nations. (2015). Transforming our world: The 2030 agenda for sustainable development. New York: UN Publishing.",
    tags: ["SDGs", "SDG 9.c", "SDG 10", "PBB", "Pembangunan Global"]
  },

  // Perangkat Lunak & Algoritma Komputasi
  {
    id: "pysal-esda-spreg",
    category: "software",
    categoryLabel: "Komputasi & Software",
    title: "PySAL: Python Spatial Analysis Library (ESDA, Spreg, & Libpysal)",
    authorsOrSource: "Rey, Sergio J., Anselin, Luc, et al.",
    year: "2022",
    publisherOrOrg: "Journal of Open Source Software / PySAL Consortium",
    description: "Ekosistem open-source komputasi analisis data spasial mutakhir untuk perhitungan autokorelasi spasial dan model ekonometrika spasial.",
    roleInSigap: "Library komputasi pembentukan spatial weights matrix (Queen Contiguity & KNN), uji Moran's I, LISA, serta Spatial Error Model (SEM).",
    url: "https://pysal.org",
    apaCitation: "Rey, S. J., Anselin, L., et al. (2022). The PySAL ecosystem: Geospatial analysis in Python. Journal of Open Source Software.",
    tags: ["PySAL", "ESDA", "Spreg", "Python"]
  },
  {
    id: "mgwr-python-package",
    category: "software",
    categoryLabel: "Komputasi & Software",
    title: "mgwr: A Python Package for Multiscale Geographically Weighted Regression",
    authorsOrSource: "Oshan, Taylor M., Li, Ziqi, Kang, Wei, Wolf, Levi J., & Fotheringham, A. Stewart",
    year: "2019",
    publisherOrOrg: "ISPRS International Journal of Geo-Information, Vol. 8(6), 269",
    description: "Paket Python berkinerja tinggi untuk kalibrasi model GWR, pemilihan bandwidth adaptif menggunakan Golden Section Search, dan diagnostik AICc.",
    roleInSigap: "Mesin estimasi koefisien lokal GWR 38 provinsi dengan kernel bobot adaptif bisquare.",
    url: "https://doi.org/10.3390/ijgi8060269",
    apaCitation: "Oshan, T. M., Li, Z., Kang, W., Wolf, L. J., & Fotheringham, A. S. (2019). mgwr: A Python package for multiscale geographically weighted regression. ISPRS International Journal of Geo-Information, 8(6), 269.",
    tags: ["MGWR", "Python Library", "Golden Section Search"]
  },
  {
    id: "scikit-learn-package",
    category: "software",
    categoryLabel: "Komputasi & Software",
    title: "Scikit-Learn: Machine Learning in Python",
    authorsOrSource: "Pedregosa, Fabian, et al.",
    year: "2011",
    publisherOrOrg: "Journal of Machine Learning Research, Vol. 12, pp. 2825–2830",
    description: "Pustaka standar industri untuk algoritma pembelajaran mesin terawasi dan tak-terawasi yang efisien dan andal.",
    roleInSigap: "Eksekusi normalisasi StandardScaler, algoritma partisi K-Means, dan pengujian metrik Silhouette & Davies-Bouldin.",
    url: "https://scikit-learn.org",
    apaCitation: "Pedregosa, F., et al. (2011). Scikit-learn: Machine learning in Python. Journal of Machine Learning Research, 12, 2825–2830.",
    tags: ["Scikit-Learn", "Machine Learning", "StandardScaler"]
  },
  {
    id: "nextjs-react-leaflet",
    category: "software",
    categoryLabel: "Komputasi & Software",
    title: "Next.js 16, React 19, Leaflet, & Tailwind CSS Web Framework",
    authorsOrSource: "Vercel & Open Source Community",
    year: "2026",
    publisherOrOrg: "Vercel Inc. & Leaflet Contributors",
    description: "Arsitektur frontend modern berkemampuan SSR/CSR untuk visualisasi peta spasial interaktif Leaflet dan rendering grafik analitik dinamis.",
    roleInSigap: "Fondasi pengembangan antarmuka prototipe SIGAP yang responsif, neobrutalis, interaktif, dan mudah diakses oleh pengambil kebijakan.",
    url: "https://nextjs.org",
    apaCitation: "Vercel. (2026). Next.js: The React framework for the Web. Vercel Inc.",
    tags: ["Next.js", "React", "Leaflet", "Tailwind CSS"]
  }
];

export default function ReferensiPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "Semua Referensi", count: referencesData.length, icon: Layers },
    { id: "data", label: "Sumber Data Resmi", count: referencesData.filter(r => r.category === "data").length, icon: Database },
    { id: "academic", label: "Pustaka Akademik", count: referencesData.filter(r => r.category === "academic").length, icon: BookOpen },
    { id: "policy", label: "Kebijakan & Regulasi", count: referencesData.filter(r => r.category === "policy").length, icon: Scale },
    { id: "software", label: "Paket & Algoritma", count: referencesData.filter(r => r.category === "software").length, icon: Cpu },
  ];

  const filteredReferences = referencesData.filter((item) => {
    const matchCategory = selectedCategory === "all" || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      query === "" ||
      item.title.toLowerCase().includes(query) ||
      item.authorsOrSource.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.roleInSigap.toLowerCase().includes(query) ||
      item.tags.some((t) => t.toLowerCase().includes(query));
    return matchCategory && matchSearch;
  });

  const handleCopyCitation = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleCopyAll = () => {
    const allCitations = filteredReferences
      .map((r, i) => `[${i + 1}] ${r.apaCitation}`)
      .join("\n\n");
    navigator.clipboard.writeText(allCitations);
    setCopiedId("all");
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Top Navigation */}
      <TopNav
        title="Dokumentasi Referensi & Daftar Pustaka"
        subtitle="Repositori transparansi data resmi, tinjauan literatur ilmiah ekonometrika spasial, dasar regulasi hukum, dan spesifikasi teknologi prototipe SIGAP."
      />

      {/* Hero Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="pingfest-card p-5 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#4E8EA2] uppercase tracking-wider">
              Sumber Data Resmi
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#7BBDE8]/30 border border-[#001D39] flex items-center justify-center text-[#001D39]">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#001D39]">6 Portal</div>
          <p className="text-xs text-[#49769F] font-medium leading-relaxed">
            Data primer agregat BPS 2024, APJII, Bank Indonesia, dan BAKTI Kominfo.
          </p>
        </div>

        <div className="pingfest-card p-5 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#4E8EA2] uppercase tracking-wider">
              Pustaka Akademik
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#BDD8E9]/60 border border-[#001D39] flex items-center justify-center text-[#001D39]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#001D39]">7 Jurnal/Buku</div>
          <p className="text-xs text-[#49769F] font-medium leading-relaxed">
            Metode terindeks peer-reviewed (Anselin 1995, Brunsdon 1996, Taylor 2018).
          </p>
        </div>

        <div className="pingfest-card p-5 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#4E8EA2] uppercase tracking-wider">
              Landasan Kebijakan
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#7BBDE8]/30 border border-[#001D39] flex items-center justify-center text-[#001D39]">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#001D39]">4 Regulasi</div>
          <p className="text-xs text-[#49769F] font-medium leading-relaxed">
            UU No. 59/2024 (RPJPN 2045), Perpres SPBE, Renstra Kominfo, dan SDGs PBB.
          </p>
        </div>

        <div className="pingfest-card p-5 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#4E8EA2] uppercase tracking-wider">
              Transparansi Riset
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 border border-[#001D39] flex items-center justify-center text-[#001D39]">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#001D39]">100% Terbuka</div>
          <p className="text-xs text-[#49769F] font-medium leading-relaxed">
            Dapat direplikasi penuh secara saintifik tanpa data sintesis tersembunyi.
          </p>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="pingfest-card p-5 bg-white space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#49769F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul pustaka, nama peneliti, instansi, metode (GWR, LISA, BPS)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#001D39] text-xs font-semibold text-[#001D39] placeholder-[#49769F]/70 focus:outline-none focus:bg-[#EDF4F9]/60 shadow-[2px_2px_0px_#001D39] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#001D39] hover:underline"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Action Copy All Button */}
          <button
            onClick={handleCopyAll}
            className="pingfest-btn px-4 py-2.5 bg-white hover:bg-[#EDF4F9] text-[#001D39] text-xs font-black self-start md:self-auto"
          >
            {copiedId === "all" ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Sitasi Tersalin ({filteredReferences.length})</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#001D39]" />
                <span>Salin Semua Daftar Pustaka (APA)</span>
              </>
            )}
          </button>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border-2 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-[#7BBDE8] text-[#001D39] border-[#001D39] shadow-[2px_2px_0px_#001D39]"
                    : "bg-white text-[#49769F] border-[#001D39]/30 hover:border-[#001D39] hover:text-[#001D39]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? "bg-[#001D39] text-white" : "bg-[#EDF4F9] text-[#001D39]"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reference Items List */}
      <div className="space-y-4">
        {filteredReferences.length === 0 ? (
          <div className="pingfest-card p-12 bg-white text-center space-y-3">
            <Bookmark className="w-10 h-10 text-[#49769F] mx-auto opacity-50" />
            <h4 className="text-base font-black text-[#001D39]">
              Tidak Ditemukan Referensi yang Sesuai
            </h4>
            <p className="text-xs text-[#49769F] max-w-md mx-auto">
              Kata kunci &ldquo;{searchQuery}&rdquo; tidak cocok dengan daftar pustaka kategori ini. Silakan bersihkan pencarian atau ubah kategori.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="pingfest-btn px-4 py-1.5 bg-[#7BBDE8] text-[#001D39] text-xs font-black mt-2"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          filteredReferences.map((item, idx) => (
            <div
              key={item.id}
              className="pingfest-card p-5 sm:p-6 bg-white space-y-4 hover:border-[#0A4174] transition-all"
            >
              {/* Card Top: Category Badge, Number, and Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#001D39]/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#EDF4F9] border border-[#001D39] text-[#001D39] font-black text-xs flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#001D39] ${
                      item.category === "data"
                        ? "bg-[#7BBDE8]/30 text-[#001D39]"
                        : item.category === "academic"
                        ? "bg-[#BDD8E9] text-[#001D39]"
                        : item.category === "policy"
                        ? "bg-[#F59E0B]/20 text-[#001D39]"
                        : "bg-[#10B981]/20 text-[#001D39]"
                    }`}
                  >
                    {item.categoryLabel}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#49769F]">
                    Tahun {item.year}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCitation(item.id, item.apaCitation)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#001D39] text-xs font-bold text-[#001D39] bg-white hover:bg-[#EDF4F9] shadow-[1.5px_1.5px_0px_#001D39] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                    title="Salin Sitasi APA"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        <span className="text-[#10B981]">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#001D39]" />
                        <span>Salin APA</span>
                      </>
                    )}
                  </button>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 rounded-lg border border-[#001D39] text-xs font-bold text-[#001D39] bg-[#7BBDE8] hover:bg-[#BDD8E9] shadow-[1.5px_1.5px_0px_#001D39] transition-all"
                    >
                      <span>Tautan Sumber</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Title & Authors */}
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-[#001D39] leading-snug">
                  {item.title}
                </h3>
                <div className="text-xs font-semibold text-[#0A4174] flex items-center flex-wrap gap-2">
                  <span>{item.authorsOrSource}</span>
                  <span className="text-[#49769F]">•</span>
                  <span className="italic text-[#49769F]">{item.publisherOrOrg}</span>
                </div>
              </div>

              {/* Content Grid: Description & Role in SIGAP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#EDF4F9]/70 border border-[#001D39]/20 space-y-1">
                  <span className="font-bold text-[#001D39] block uppercase tracking-wider text-[10px]">
                    Ringkasan Isi & Konteks:
                  </span>
                  <p className="text-[#001D39]/80 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#7BBDE8]/15 border border-[#001D39]/20 space-y-1">
                  <span className="font-bold text-[#0A4174] block uppercase tracking-wider text-[10px]">
                    Implementasi & Peran pada SIGAP:
                  </span>
                  <p className="text-[#001D39] leading-relaxed font-medium">
                    {item.roleInSigap}
                  </p>
                </div>
              </div>

              {/* APA Citation Box */}
              <div className="p-3 rounded-xl bg-white border border-[#001D39]/30 text-[11px] font-mono text-[#001D39] bg-grid-pattern flex items-start gap-2 overflow-hidden break-words">
                <FileText className="w-4 h-4 text-[#49769F] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed select-all break-words overflow-hidden">{item.apaCitation}</span>
              </div>

              {/* Tags */}
              <div className="flex items-center flex-wrap gap-1.5 pt-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-[#EDF4F9] text-[#001D39] text-[10px] font-bold border border-[#001D39]/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Methodology & Reproducibility Statement Card */}
      <div className="pingfest-card p-6 bg-[#001D39] text-white space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7BBDE8] border-2 border-white flex items-center justify-center text-[#001D39]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              Pernyataan Orisinalitas & Kepatuhan Integritas Ilmiah
            </h3>
            <p className="text-xs text-[#BDD8E9]">
              IT-VENTURE P!NGFEST 2026 • Universitas Sebelas Maret
            </p>
          </div>
        </div>

        <p className="text-xs text-[#BDD8E9]/90 leading-relaxed">
          Karya prototipe analitik dan sistem pendukung keputusan <strong>SIGAP (Sistem Informasi Geospasial Akses Presisi)</strong> disusun secara independen dan orisinal oleh <strong>Tim IRIS Kehitaman 3 Angkatan</strong>. Seluruh formulasi algoritma (K-Means, LISA Moran&apos;s I, GWR, SARIMA, ETS, Prophet) dan dataset 38 provinsi berakar langsung dari data publik resmi berlisensi terbuka Republik Indonesia tanpa rekayasa data sintesis.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-[#0A4174]/60 border border-[#7BBDE8]/30">
            <div className="font-bold text-white mb-0.5">Metodologi Teruji</div>
            <div className="text-[11px] text-[#BDD8E9]/80">
              Evaluasi statistik Silhouette 0,424; AICc GWR 229,6 (R² 0,915); MAPE Deret Waktu 3,97%.
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#0A4174]/60 border border-[#7BBDE8]/30">
            <div className="font-bold text-white mb-0.5">Bebas AI Generatif Gambar</div>
            <div className="text-[11px] text-[#BDD8E9]/80">
              Sesuai ketentuan guidebook lomba: seluruh visualisasi peta dan grafik dihasilkan murni via komputasi kode.
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#0A4174]/60 border border-[#7BBDE8]/30">
            <div className="font-bold text-white mb-0.5">Sinergi Kebijakan Nyata</div>
            <div className="text-[11px] text-[#BDD8E9]/80">
              Diselaraskan penuh dengan dokumen hukum UU No. 59/2024 (RPJPN 2025–2045 Indonesia Emas).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
