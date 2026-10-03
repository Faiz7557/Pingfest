const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../Penyisihan/Analisis_Pingfest');
const outDir = path.resolve(__dirname, '../public/data');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function parseCSV(content) {
  const lines = content.trim().split(/\r?\n/).filter(line => line.trim() && !line.startsWith('#'));
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    // Basic CSV splitting handling commas
    const values = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    values.push(cur.trim());
    
    const obj = {};
    headers.forEach((h, idx) => {
      const val = values[idx] !== undefined ? values[idx] : '';
      const num = Number(val);
      obj[h] = !isNaN(num) && val !== '' ? num : val;
    });
    return obj;
  });
}

console.log('Processing data files...');

// 1. Process hasil_analisis_kesiapan_digital.csv
const rawAnalisis = fs.readFileSync(path.join(srcDir, '1_Clustering_Spasial/output/hasil_analisis_kesiapan_digital.csv'), 'utf8');
const listAnalisis = parseCSV(rawAnalisis);

// Add paradox flags & metadata to provinces
const provinces = listAnalisis.map(p => {
  const isPapuaTengah = p.Provinsi === 'Papua Tengah';
  const isJogja = p.Provinsi === 'DI Yogyakarta';
  const isPapuaPegunungan = p.Provinsi === 'Papua Pegunungan';
  
  let paradox = null;
  if (isPapuaTengah) {
    paradox = {
      is_paradox: true,
      title: "Kaya Sumber Daya, Terputus dari Sinyal",
      description: "PDRB per kapita Rp118,8 juta/tahun (peringkat 8 nasional), namun kepemilikan ponsel hanya 33,7% (peringkat 37 dari 38). Kaya tambang dan SDA, namun tertinggal infrastruktur telekomunikasi."
    };
  } else if (isJogja) {
    paradox = {
      is_paradox: true,
      title: "Tinggi SDM, Moderat Ekonomi",
      description: "IPM 81,55 (peringkat 2 nasional) dan RLS 9,92 tahun, namun PDRB per kapita Rp51,5 juta (peringkat 28). Potensi talenta digital melimpah yang siap menggerakkan ekonomi berbasis pengetahuan."
    };
  } else if (isPapuaPegunungan) {
    paradox = {
      is_paradox: true,
      title: "Titik Paling Terisolasi",
      description: "Kepemilikan ponsel terendah nasional (15,76%) dengan indeks kerentanan tertinggi (0,843). Memerlukan lompatan teknologi non-terestrial langsung (satelit VHTS SATRIA-1 / LEO)."
    };
  }

  // Determine DDI Quadrant (Infrastruktur vs SDM)
  // Median nasional HP: ~68.4%, Median IPM: ~73.4%
  const infraHigh = p.hp_seluler_2024 >= 68.4;
  const sdmHigh = p.ipm_2024 >= 73.4;
  let ddiQuadrant = 1;
  let ddiLabel = 'Fokus Infrastruktur';
  if (infraHigh && sdmHigh) {
    ddiQuadrant = 2;
    ddiLabel = 'Siap Digital (Pemimpin)';
  } else if (infraHigh && !sdmHigh) {
    ddiQuadrant = 3;
    ddiLabel = 'Fokus Literasi & SDM';
  } else if (!infraHigh && sdmHigh) {
    ddiQuadrant = 1;
    ddiLabel = 'Fokus Infrastruktur Jaringan';
  } else {
    ddiQuadrant = 4;
    ddiLabel = 'Intervensi Total (Prioritas Kritis)';
  }

  return {
    ...p,
    paradox,
    ddi: {
      quadrant: ddiQuadrant,
      label: ddiLabel,
      infraScore: p.hp_seluler_2024,
      sdmScore: p.ipm_2024
    }
  };
});

fs.writeFileSync(path.join(outDir, 'provinces.json'), JSON.stringify(provinces, null, 2));
console.log(`Saved provinces.json (${provinces.length} provinces)`);

// 2. Process Moran's I
const rawMoran = fs.readFileSync(path.join(srcDir, '1_Clustering_Spasial/output/hasil_moran.csv'), 'utf8');
const moranData = parseCSV(rawMoran);
fs.writeFileSync(path.join(outDir, 'moran.json'), JSON.stringify(moranData, null, 2));

// 3. Process Model Comparison
const rawModel = fs.readFileSync(path.join(srcDir, '1_Clustering_Spasial/output/hasil_perbandingan_model.csv'), 'utf8');
const modelData = parseCSV(rawModel);
fs.writeFileSync(path.join(outDir, 'model_comparison.json'), JSON.stringify(modelData, null, 2));

// 4. Process Cluster Grid Evaluation
const rawGrid = fs.readFileSync(path.join(srcDir, '1_Clustering_Spasial/output/hasil_grid_klaster.csv'), 'utf8');
const gridData = parseCSV(rawGrid);
fs.writeFileSync(path.join(outDir, 'cluster_evaluation.json'), JSON.stringify(gridData, null, 2));

// 5. Process SDM Impacts Decomposition
const rawImpacts = fs.readFileSync(path.join(srcDir, '1_Clustering_Spasial/output/dekomposisi_impacts_sdm.csv'), 'utf8');
const impactsData = parseCSV(rawImpacts);
fs.writeFileSync(path.join(outDir, 'spillover_impacts.json'), JSON.stringify(impactsData, null, 2));

// 6. Process QRIS Forecast (60 months historical + 24 months projection)
const rawQrisHist = fs.readFileSync(path.join(srcDir, '2_Forecasting/dataset_adopsi_digital_qris_60bulan.csv'), 'utf8');
const qrisHist = parseCSV(rawQrisHist);

const rawQrisProj = fs.readFileSync(path.join(srcDir, '2_Forecasting/output/hasil_proyeksi_24bulan.csv'), 'utf8');
const qrisLines = rawQrisProj.trim().split(/\r?\n/).slice(1);
const qrisProj = qrisLines.map(line => {
  const parts = line.split(',');
  return {
    tanggal: parts[0],
    nilai_transaksi_triliun: Number(parts[1]),
    ci80_bawah: Number(parts[2]),
    ci80_atas: Number(parts[3])
  };
});

// CV stats
const rawCv = fs.readFileSync(path.join(srcDir, '2_Forecasting/output/hasil_perbandingan_model_cv.csv'), 'utf8');
const cvStats = parseCSV(rawCv);

fs.writeFileSync(path.join(outDir, 'qris_forecast.json'), JSON.stringify({
  historical: qrisHist,
  projection: qrisProj,
  cv_comparison: cvStats
}, null, 2));
console.log('Saved qris_forecast.json');

// 7. Process Cluster Projection to 2030
const rawKlasterProj = fs.readFileSync(path.join(srcDir, '2_Forecasting/output/proyeksi_klaster_2030.csv'), 'utf8');
const klasterProj = parseCSV(rawKlasterProj);
fs.writeFileSync(path.join(outDir, 'cluster_projection_2030.json'), JSON.stringify(klasterProj, null, 2));
console.log('Saved cluster_projection_2030.json');

// 8. Copy and optimize GeoJSON
const geojsonPath = path.join(srcDir, '1_Clustering_Spasial/shp/indonesia_38prov.geojson');
const rawGeo = fs.readFileSync(geojsonPath, 'utf8');
const geoData = JSON.parse(rawGeo);

// Map cluster and metrics into GeoJSON feature properties for easy choropleth rendering
const provMap = new Map();
provinces.forEach(p => provMap.set(p.Provinsi, p));

geoData.features = geoData.features.map(f => {
  const provName = f.properties.PROVINSI;
  const pData = provMap.get(provName);
  return {
    ...f,
    properties: {
      ...f.properties,
      data: pData || null
    }
  };
});

fs.writeFileSync(path.join(outDir, 'indonesia_38prov.json'), JSON.stringify(geoData));
console.log(`Saved indonesia_38prov.json (${geoData.features.length} features with joined data)`);

console.log('All data processing complete!');
