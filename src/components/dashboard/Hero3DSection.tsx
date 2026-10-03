"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { 
  ArrowRight, 
  Layers, 
  RotateCw, 
  Radio, 
  Sparkles,
  Maximize2,
  Compass,
  Satellite,
  Wifi,
  Eye,
  Activity,
  X,
  Sliders,
  MapPin,
  Globe,
  Zap,
  TrendingUp,
  BarChart3,
  ChevronDown,
  MousePointerClick,
  Info
} from "lucide-react";
import { ProvinceData } from "@/lib/types";

interface Hero3DSectionProps {
  provinces?: ProvinceData[];
  onSelectProvince?: (prov: ProvinceData) => void;
  embedded?: boolean;
}

interface Prov3DFeature {
  name: string;
  klaster: number;
  lat: number;
  lon: number;
  hp_seluler: number;
  ipm: number;
  lisa: string;
  polys: [number, number][][];
}

interface RegionTelemetry {
  id: string;
  name: string;
  subtitle: string;
  category: "province" | "satellite";
  clusterName: string;
  clusterColor: string;
  penetration: string;
  ipm: string;
  lisaStatus: string;
  highlightText: string;
  recommendation: string;
  cameraPos: [number, number, number];
  lookAtPos: [number, number, number];
  relatedProvName?: string;
}

const CLUSTER_COLORS: Record<number, number> = {
  2: 0x10b981, // Emerald Green (Maju & Terhubung)
  3: 0x7bbde8, // Sky Blue (Berkembang Menengah)
  1: 0xf59e0b, // Amber (Tertinggal Sedang)
  0: 0xef4444, // Crimson Red (Tertinggal Ekstrem)
};

const CLUSTER_HEX: Record<number, string> = {
  2: "#10B981",
  3: "#7BBDE8",
  1: "#F59E0B",
  0: "#EF4444",
};

const CLUSTER_LABELS: Record<number, string> = {
  2: "Maju dan Terhubung (Klaster 2)",
  3: "Berkembang Menengah (Klaster 3)",
  1: "Tertinggal Sedang (Klaster 1)",
  0: "Tertinggal Ekstrem (Klaster 0)",
};

type LensMode = "cluster" | "backbone" | "satellite" | "vision2045";

export default function Hero3DSection({ provinces = [], onSelectProvince, embedded = false }: Hero3DSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Interactive States
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeLens, setActiveLens] = useState<LensMode>("cluster");
  const [selectedRegion, setSelectedRegion] = useState<RegionTelemetry | null>(null);
  const [visionYear, setVisionYear] = useState<number>(2026);
  const [radarScannerText, setRadarScannerText] = useState<string>("Inisialisasi Pemetaan Digital Twin 38 Provinsi...");
  const [hoveredProvName, setHoveredProvName] = useState<string | null>(null);

  // Control handlers ref for Three.js
  const controlsRef = useRef<{
    focusRegion: (key: string) => void;
    focusProvince: (provName: string) => void;
    resetView: () => void;
    toggleRotate: () => void;
    setLens: (lens: LensMode) => void;
    setYear: (yr: number) => void;
  }>({
    focusRegion: () => {},
    focusProvince: () => {},
    resetView: () => {},
    toggleRotate: () => {},
    setLens: () => {},
    setYear: () => {},
  });

  const activeLensRef = useRef<LensMode>("cluster");
  activeLensRef.current = activeLens;
  const visionYearRef = useRef<number>(visionYear);
  visionYearRef.current = visionYear;

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // SCENE SETUP
    const scene = new THREE.Scene();

    // CAMERA (Isometric angle with low FOV for architectural miniature look)
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(34, aspect, 0.1, 1000);
    const defaultCamPos = new THREE.Vector3(15, 17, 16);
    const defaultLookAt = new THREE.Vector3(0, 0.4, 0);
    camera.position.copy(defaultCamPos);
    camera.lookAt(defaultLookAt);

    const targetCamPos = defaultCamPos.clone();
    const currentLookAt = defaultLookAt.clone();
    const targetLookAt = defaultLookAt.clone();

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // LIGHTING (Studio illumination for architectural clay/resin diorama)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(16, 26, 14);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x7bbde8, 1.2);
    fillLight.position.set(-16, 14, -14);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    rimLight.position.set(0, 10, -18);
    scene.add(rimLight);

    // ROOT DIORAMA GROUP
    const dioramaGroup = new THREE.Group();
    scene.add(dioramaGroup);

    // 1. FLOATING OCEAN PEDESTAL BASIN
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x001d39,
      roughness: 0.5,
      metalness: 0.2,
    });
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0a3b68,
      roughness: 0.15,
      metalness: 0.3,
      transparent: true,
      opacity: 0.95,
    });
    const shelfMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });

    // Outer Dark Navy Beveled Pedestal
    const pedestalBottom = new THREE.Mesh(
      new THREE.CylinderGeometry(10.6, 11.0, 1.2, 48),
      baseMat
    );
    pedestalBottom.position.y = -0.6;
    pedestalBottom.receiveShadow = true;
    dioramaGroup.add(pedestalBottom);

    // Dark Pedestal Rim
    const pedestalRim = new THREE.Mesh(
      new THREE.CylinderGeometry(10.8, 10.8, 0.2, 48),
      new THREE.MeshStandardMaterial({ color: 0x001428, roughness: 0.6 })
    );
    pedestalRim.position.y = 0.05;
    dioramaGroup.add(pedestalRim);

    // Deep Ocean Water Top Disk
    const oceanPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(10.5, 10.5, 0.12, 48),
      waterMat
    );
    oceanPlate.position.y = 0.1;
    oceanPlate.receiveShadow = true;
    dioramaGroup.add(oceanPlate);

    // Shallow Coastal Shelf Layer (Turquoise Lagoon Glow)
    const shelfDisk = new THREE.Mesh(
      new THREE.CircleGeometry(10.3, 48),
      shelfMat
    );
    shelfDisk.rotation.x = -Math.PI / 2;
    shelfDisk.position.y = 0.17;
    dioramaGroup.add(shelfDisk);

    // Hydrographic GIS Coordinate Rings
    const gridGroup = new THREE.Group();
    dioramaGroup.add(gridGroup);
    for (let r = 2.8; r <= 9.6; r += 2.2) {
      const ringGeo = new THREE.RingGeometry(r - 0.02, r + 0.02, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x49769f,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.18;
      gridGroup.add(ringMesh);
    }

    // 2. LOAD & RENDER REAL 3D PROVINCE MESHES
    const provinceGroup = new THREE.Group();
    dioramaGroup.add(provinceGroup);

    const clickableObjects: THREE.Object3D[] = [];
    const provMeshMap: Record<string, { meshes: THREE.Mesh[]; data: Prov3DFeature }> = {};
    const provMaterials: { mat: THREE.MeshStandardMaterial; defaultColor: number; prov: Prov3DFeature }[] = [];

    // Helper to build realistic province telemetry info
    const buildProvTelemetry = (p: Prov3DFeature): RegionTelemetry => {
      const x = Number(((p.lon - 118.0) * 0.38).toFixed(2));
      const z = Number((-(p.lat - (-2.5)) * 0.42).toFixed(2));

      let recommendation = "Optimasi pemerataan akses digital intra-provinsi.";
      if (p.klaster === 0) {
        recommendation = "Intervensi Prioritas 1: Satelit SATRIA-1 Direct-to-Cell, BTS USO Tenaga Surya, & Subsidi Gawai Edukasi.";
      } else if (p.klaster === 1) {
        recommendation = "Intervensi Prioritas 2: Perluasan BTS 4G USO, stabilitas pasokan listrik, dan pelatihan literasi digital dasar.";
      } else if (p.klaster === 3) {
        recommendation = "Intervensi Akselerasi: Penuntasan jaringan serat optik last-mile & program adopsi UMKM digital.";
      } else {
        recommendation = "Inovasi Terdepan: Pilot project 5G, Smart City, & hilirisasi talenta AI berdaya saing global.";
      }

      return {
        id: p.name.toLowerCase().replace(/\s+/g, "-"),
        name: p.name,
        subtitle: `Provinsi di Indonesia • ${CLUSTER_LABELS[p.klaster]}`,
        category: "province",
        clusterName: CLUSTER_LABELS[p.klaster],
        clusterColor: CLUSTER_HEX[p.klaster] || "#10B981",
        penetration: `${p.hp_seluler ? p.hp_seluler.toFixed(1) : "68.5"}%`,
        ipm: `${p.ipm ? p.ipm.toFixed(1) : "72.4"}`,
        lisaStatus: p.lisa || "Tidak signifikan",
        highlightText: `Terpetakan dalam basis data spasial SIGAP dengan karakteristik klaster ${p.klaster}.`,
        recommendation,
        cameraPos: [x + 3.0, 7.5, z + 5.5],
        lookAtPos: [x, 0.4, z],
        relatedProvName: p.name,
      };
    };

    fetch("/data/indonesia_3d_geom.json")
      .then((res) => res.json())
      .then((data: Prov3DFeature[]) => {
        data.forEach((prov) => {
          const defaultColor = CLUSTER_COLORS[prov.klaster] || 0x10b981;
          const mat = new THREE.MeshStandardMaterial({
            color: defaultColor,
            roughness: 0.35,
            metalness: 0.08,
          });
          provMaterials.push({ mat, defaultColor, prov });

          const meshes: THREE.Mesh[] = [];

          prov.polys.forEach((ring) => {
            if (ring.length < 3) return;

            const shape = new THREE.Shape();
            shape.moveTo(ring[0][0], -ring[0][1]);
            for (let i = 1; i < ring.length; i++) {
              shape.lineTo(ring[i][0], -ring[i][1]);
            }
            shape.closePath();

            // Height variation based on cluster: Maju is slightly higher, creating an architectural relief!
            const depth = prov.klaster === 2 ? 0.44 : prov.klaster === 3 ? 0.38 : 0.32;

            try {
              const geom = new THREE.ExtrudeGeometry(shape, {
                depth,
                bevelEnabled: true,
                bevelSegments: 2,
                steps: 1,
                bevelSize: 0.035,
                bevelThickness: 0.04,
              });
              geom.rotateX(-Math.PI / 2);

              const mesh = new THREE.Mesh(geom, mat);
              mesh.position.y = 0.16;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              mesh.userData = { provName: prov.name, provData: prov };

              provinceGroup.add(mesh);
              clickableObjects.push(mesh);
              meshes.push(mesh);
            } catch (err) {
              // Ignore invalid degenerate polygons
            }
          });

          provMeshMap[prov.name] = { meshes, data: prov };
        });
      })
      .catch((err) => console.error("Error loading 3D geom:", err));

    // 3. TOPOGRAPHIC VOLCANIC MOUNTAIN PEAKS (RING OF FIRE & JAYAWIJAYA)
    const mountainGroup = new THREE.Group();
    dioramaGroup.add(mountainGroup);

    const mountainLocs = [
      { name: "Gunung Kerinci (Sumatera)", x: -5.8, z: -0.4, h: 0.8 },
      { name: "Gunung Gede (Jawa)", x: -3.8, z: 1.5, h: 0.7 },
      { name: "Gunung Merapi (Jawa)", x: -2.3, z: 1.9, h: 0.75 },
      { name: "Gunung Semeru (Jawa)", x: -1.2, z: 2.1, h: 0.85 },
      { name: "Gunung Rinjani (Lombok)", x: -0.5, z: 2.4, h: 0.75 },
      { name: "Pegunungan Schwaner (Kalimantan)", x: -2.2, z: -0.8, h: 0.65 },
      { name: "Gunung Lokon (Sulawesi)", x: 2.5, z: -1.7, h: 0.7 },
      { name: "Puncak Jaya / Cartensz (Papua)", x: 7.2, z: 0.8, h: 1.05 },
    ];

    mountainLocs.forEach((m) => {
      const coneGeo = new THREE.ConeGeometry(0.2, m.h, 6);
      const coneMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.7,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(m.x, 0.45 + m.h / 2, m.z);
      cone.castShadow = true;
      mountainGroup.add(cone);

      // Snow / Rocky peak tip
      const tipGeo = new THREE.ConeGeometry(0.08, m.h * 0.25, 6);
      const tipMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.set(m.x, 0.45 + m.h - (m.h * 0.25) / 2, m.z);
      mountainGroup.add(tip);
    });

    // 4. BTS TELECOM TOWERS & SIGNAL RIPPLE RINGS
    const btsGroup = new THREE.Group();
    dioramaGroup.add(btsGroup);

    const btsCoords = [
      { name: "Medan", x: -7.0, y: 0.5, z: -1.7, color: 0x10b981 },
      { name: "DKI Jakarta", x: -4.2, y: 0.55, z: 1.55, color: 0x10b981 },
      { name: "Surabaya", x: -2.0, y: 0.55, z: 1.95, color: 0x10b981 },
      { name: "IKN Nusantara", x: -0.35, y: 0.5, z: -0.85, color: 0x7bbde8 },
      { name: "Makassar", x: 0.55, y: 0.5, z: 1.1, color: 0x7bbde8 },
      { name: "Kupang (3T)", x: 2.1, y: 0.45, z: 3.2, color: 0xf59e0b },
      { name: "Jayapura (3T)", x: 8.5, y: 0.5, z: 0.0, color: 0xef4444 },
    ];

    interface PulsingRing {
      mesh: THREE.Mesh;
      scale: number;
      maxScale: number;
      speed: number;
    }
    const pulsingRings: PulsingRing[] = [];
    const beaconLeds: THREE.Mesh[] = [];

    btsCoords.forEach((b) => {
      const towerObj = new THREE.Group();
      towerObj.position.set(b.x, b.y, b.z);

      // Lattice Tower Mast
      const mastGeo = new THREE.CylinderGeometry(0.04, 0.1, 0.85, 4);
      const mastMat = new THREE.MeshStandardMaterial({
        color: 0x001d39,
        metalness: 0.8,
        roughness: 0.2,
      });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.y = 0.42;
      mast.castShadow = true;
      towerObj.add(mast);

      // Parabolic Dish
      const dishGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 8);
      const dishMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const dish = new THREE.Mesh(dishGeo, dishMat);
      dish.position.y = 0.85;
      towerObj.add(dish);

      // Blinking Beacon
      const beaconGeo = new THREE.SphereGeometry(0.07, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({ color: b.color });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 0.96;
      towerObj.add(beacon);
      beaconLeds.push(beacon);

      btsGroup.add(towerObj);

      for (let i = 0; i < 2; i++) {
        const rGeo = new THREE.RingGeometry(0.08, 0.18, 32);
        const rMat = new THREE.MeshBasicMaterial({
          color: b.color,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
        });
        const rMesh = new THREE.Mesh(rGeo, rMat);
        rMesh.rotation.x = -Math.PI / 2;
        rMesh.position.set(b.x, b.y + 0.02, b.z);
        scene.add(rMesh);

        pulsingRings.push({
          mesh: rMesh,
          scale: 0.2 + i * 0.8,
          maxScale: 2.2,
          speed: 0.015,
        });
      }
    });

    // 5. PALAPA RING FIBER OPTIC ARCS
    const fiberGroup = new THREE.Group();
    dioramaGroup.add(fiberGroup);

    const connectionPairs = [
      [btsCoords[0], btsCoords[1]], // Medan -> Jakarta
      [btsCoords[1], btsCoords[2]], // Jakarta -> Surabaya
      [btsCoords[1], btsCoords[3]], // Jakarta -> IKN
      [btsCoords[3], btsCoords[4]], // IKN -> Makassar
      [btsCoords[2], btsCoords[5]], // Surabaya -> Kupang
      [btsCoords[4], btsCoords[6]], // Makassar -> Jayapura
      [btsCoords[5], btsCoords[6]], // Kupang -> Jayapura
    ];

    interface DataPacket {
      mesh: THREE.Mesh;
      curve: THREE.CatmullRomCurve3;
      t: number;
      speed: number;
    }
    const dataPackets: DataPacket[] = [];
    const fiberMaterials: THREE.MeshBasicMaterial[] = [];

    connectionPairs.forEach(([start, end]) => {
      const midX = (start.x + end.x) / 2;
      const midZ = (start.z + end.z) / 2;
      const dist = Math.hypot(end.x - start.x, end.z - start.z);
      const archHeight = Math.max(start.y, end.y) + dist * 0.22;

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(start.x, start.y + 0.5, start.z),
        new THREE.Vector3(midX, archHeight, midZ),
        new THREE.Vector3(end.x, end.y + 0.5, end.z),
      ]);

      const tubeGeo = new THREE.TubeGeometry(curve, 28, 0.025, 6, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0x7bbde8,
        transparent: true,
        opacity: 0.5,
      });
      fiberMaterials.push(tubeMat);

      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      fiberGroup.add(tubeMesh);

      const packetGeo = new THREE.SphereGeometry(0.07, 8, 8);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const packetMesh = new THREE.Mesh(packetGeo, packetMat);
      dioramaGroup.add(packetMesh);

      dataPackets.push({
        mesh: packetMesh,
        curve,
        t: Math.random(),
        speed: 0.007,
      });
    });

    // 6. ORBITING SATRIA-1 SATELLITE
    const satelliteGroup = new THREE.Group();
    satelliteGroup.userData = { isSatellite: true };
    dioramaGroup.add(satelliteGroup);

    const satBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.35, 0.35),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.9,
        roughness: 0.2,
      })
    );
    satelliteGroup.add(satBody);
    clickableObjects.push(satBody);

    const satFoil = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.36, 0.36),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.8,
        roughness: 0.3,
      })
    );
    satelliteGroup.add(satFoil);

    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x0a4174,
      roughness: 0.2,
      metalness: 0.7,
    });
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.5), wingMat);
    leftWing.position.x = -0.7;
    satelliteGroup.add(leftWing);

    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.5), wingMat);
    rightWing.position.x = 0.7;
    satelliteGroup.add(rightWing);

    // Downlink Spotlight Beam targeting 3T Papua region
    const beamGeo = new THREE.CylinderGeometry(0.04, 1.4, 7.5, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const downlinkBeam = new THREE.Mesh(beamGeo, beamMat);
    downlinkBeam.position.y = -3.75;
    satelliteGroup.add(downlinkBeam);

    // 7. SMART 3D PINS (OVER KEY HUBS)
    const pinsGroup = new THREE.Group();
    dioramaGroup.add(pinsGroup);

    const pinDefs = [
      { prov: "DKI Jakarta", x: -4.2, y: 1.2, z: 1.55, color: 0x10b981 },
      { prov: "Kalimantan Timur", label: "IKN Nusantara", x: -0.35, y: 1.2, z: -0.85, color: 0x7bbde8 },
      { prov: "Sulawesi Selatan", label: "Makassar", x: 0.55, y: 1.2, z: 1.1, color: 0x7bbde8 },
      { prov: "Papua Pegunungan", label: "Papua 3T", x: 7.2, y: 1.4, z: 0.8, color: 0xef4444 },
    ];

    const pinMeshes: THREE.Mesh[] = [];

    pinDefs.forEach((p) => {
      const pinObj = new THREE.Group();
      pinObj.position.set(p.x, p.y, p.z);
      pinObj.userData = { provName: p.prov };

      const coneGeo = new THREE.ConeGeometry(0.1, 0.35, 8);
      coneGeo.rotateX(Math.PI);
      const cone = new THREE.Mesh(
        coneGeo,
        new THREE.MeshStandardMaterial({ color: 0x001d39, metalness: 0.5 })
      );
      cone.position.y = 0.18;
      pinObj.add(cone);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 16, 16),
        new THREE.MeshStandardMaterial({
          color: p.color,
          emissive: p.color,
          emissiveIntensity: 0.6,
        })
      );
      head.position.y = 0.42;
      pinObj.add(head);

      dioramaGroup.add(pinObj);
      clickableObjects.push(head);
      pinMeshes.push(head);
    });

    // 8. HOLOGRAPHIC SCANNER PLANE
    const scannerGeo = new THREE.PlaneGeometry(0.12, 16);
    const scannerMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    });
    const scannerPlane = new THREE.Mesh(scannerGeo, scannerMat);
    scannerPlane.rotation.x = Math.PI / 2;
    scannerPlane.position.y = 0.35;
    dioramaGroup.add(scannerPlane);

    // MOUSE PARALLAX & RAYCASTING
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let previousMouseX = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let currentRotationY = 0;
    let currentRotationX = 0;
    let userHasRotated = false;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh: THREE.Mesh | null = null;
    let originalHoverColor: THREE.Color | null = null;

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      previousMouseX = e.clientX;
      userHasRotated = true;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        targetRotationY += deltaX * 0.008;
        previousMouseX = e.clientX;
      } else {
        targetRotationX = mouse.y * 0.08;
        if (!userHasRotated && !selectedRegion) {
          targetRotationY = mouse.x * 0.15;
        }

        // Hover raycast
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickableObjects, true);

        if (intersects.length > 0) {
          let cur: THREE.Object3D | null = intersects[0].object;
          let provName: string | null = null;
          while (cur && !provName) {
            if (cur.userData && cur.userData.provName) {
              provName = cur.userData.provName;
            } else if (cur.userData && cur.userData.isSatellite) {
              provName = "Satelit SATRIA-1";
            }
            cur = cur.parent;
          }
          setHoveredProvName(provName);
        } else {
          setHoveredProvName(null);
        }
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      isDragging = false;
      const moveDistance = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);

      if (moveDistance < 5) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickableObjects, true);

        if (intersects.length > 0) {
          let cur: THREE.Object3D | null = intersects[0].object;
          let provName: string | null = null;
          let isSat = false;

          while (cur && !provName && !isSat) {
            if (cur.userData && cur.userData.provName) {
              provName = cur.userData.provName;
            } else if (cur.userData && cur.userData.isSatellite) {
              isSat = true;
            }
            cur = cur.parent;
          }

          if (isSat) {
            focusSatelliteHandler();
          } else if (provName) {
            focusProvinceHandler(provName);
          }
        }
      }
    };

    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // FOCUS HANDLERS
    const focusProvinceHandler = (provName: string) => {
      const entry = provMeshMap[provName];
      if (!entry) return;

      const telemetry = buildProvTelemetry(entry.data);
      setSelectedRegion(telemetry);
      setAutoRotate(false);

      if (onSelectProvince && provinces.length > 0) {
        const p = provinces.find((item) => item.Provinsi === provName);
        if (p) onSelectProvince(p);
      }

      targetCamPos.set(...telemetry.cameraPos);
      targetLookAt.set(...telemetry.lookAtPos);
    };

    const focusSatelliteHandler = () => {
      const telemetry: RegionTelemetry = {
        id: "satria-1",
        name: "Satelit SATRIA-1 (146° BT)",
        subtitle: "Infrastruktur Langit Penembus Blankspot 3T",
        category: "satellite",
        clusterName: "Satelit Multifungsi GEO 150 Gbps",
        clusterColor: "#38BDF8",
        penetration: "Jangkauan 37.000 Titik Layanan Publik",
        ipm: "Kapasitas 150 Gbps (VHTS)",
        lisaStatus: "Infrastruktur Pemerataan Angkasa",
        highlightText: "Menghubungkan fasilitas pendidikan, kesehatan, dan pertahanan terluar yang mustahil dijangkau kabel serat optik darat.",
        recommendation: "Integrasi stasiun bumi gateway dengan BTS 4G USO daerah 3T di Papua, Maluku, dan NTT.",
        cameraPos: [6, 11, 13],
        lookAtPos: [4.0, 3.5, 3.5],
      };

      setSelectedRegion(telemetry);
      setAutoRotate(false);
      targetCamPos.set(...telemetry.cameraPos);
      targetLookAt.set(...telemetry.lookAtPos);
    };

    const resetViewHandler = () => {
      setSelectedRegion(null);
      targetCamPos.copy(defaultCamPos);
      targetLookAt.copy(defaultLookAt);
      targetRotationX = 0;
      targetRotationY = 0;
      userHasRotated = false;
    };

    controlsRef.current.focusProvince = focusProvinceHandler;
    controlsRef.current.focusRegion = (key: string) => {
      if (key === "satria") {
        focusSatelliteHandler();
      } else if (key === "jawa") {
        focusProvinceHandler("DKI Jakarta");
      } else if (key === "kalimantan") {
        focusProvinceHandler("Kalimantan Timur");
      } else if (key === "papua") {
        focusProvinceHandler("Papua Pegunungan");
      }
    };
    controlsRef.current.resetView = resetViewHandler;
    controlsRef.current.toggleRotate = () => setAutoRotate((prev) => !prev);
    controlsRef.current.setLens = (lens: LensMode) => setActiveLens(lens);
    controlsRef.current.setYear = (yr: number) => setVisionYear(yr);

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let scannerX = -9.0;
    let scannerDirection = 1;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Camera Fly-In Lerp
      camera.position.lerp(targetCamPos, 0.05);
      currentLookAt.lerp(targetLookAt, 0.05);
      camera.lookAt(currentLookAt);

      // Smooth Diorama Rotation Lerp
      if (autoRotate && !isDragging && !selectedRegion) {
        targetRotationY += 0.002;
      }
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      dioramaGroup.rotation.y = currentRotationY;
      dioramaGroup.rotation.x = currentRotationX;

      if (!selectedRegion) {
        dioramaGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
      }

      // Satellite Orbit
      const satAngle = elapsedTime * 0.45;
      const satRadius = 8.5;
      satelliteGroup.position.set(
        Math.cos(satAngle) * satRadius,
        5.2 + Math.sin(satAngle * 2) * 0.4,
        Math.sin(satAngle) * satRadius
      );
      satelliteGroup.rotation.y = -satAngle + Math.PI / 2;

      // Smart Pins Bobbing
      pinMeshes.forEach((pin, idx) => {
        pin.position.y = 0.42 + Math.sin(elapsedTime * 3 + idx) * 0.08;
      });

      // Pulse Radio Wave Rings
      pulsingRings.forEach((pr) => {
        pr.scale += pr.speed;
        if (pr.scale > pr.maxScale) pr.scale = 0.2;
        pr.mesh.scale.set(pr.scale, pr.scale, 1);
        (pr.mesh.material as THREE.MeshBasicMaterial).opacity =
          Math.max(0, 1 - pr.scale / pr.maxScale);
      });

      // Beacon LEDs blink
      const blink = (Math.sin(elapsedTime * 6) + 1) / 2;
      beaconLeds.forEach((led) => {
        led.scale.setScalar(0.8 + blink * 0.4);
      });

      // Palapa Ring data packets
      const curLens = activeLensRef.current;
      const speedMultiplier = curLens === "backbone" ? 2.5 : 1.0;
      dataPackets.forEach((dp) => {
        dp.t = (dp.t + dp.speed * speedMultiplier) % 1;
        const pos = dp.curve.getPoint(dp.t);
        dp.mesh.position.copy(pos);
      });

      // Holographic Scanner Sweep
      scannerX += 0.06 * scannerDirection;
      if (scannerX > 9.0) {
        scannerX = 9.0;
        scannerDirection = -1;
      } else if (scannerX < -9.0) {
        scannerX = -9.0;
        scannerDirection = 1;
      }
      scannerPlane.position.x = scannerX;

      // Update Ticker Text
      if (Math.floor(elapsedTime * 10) % 6 === 0) {
        if (scannerX < -3.5) {
          setRadarScannerText("SCAN 98.6° BT (Sumatera) • Penetrasi: 71.4% • Klaster Berkembang");
        } else if (scannerX >= -3.5 && scannerX < 1.0) {
          setRadarScannerText("SCAN 106.8° BT (Jawa) • Penetrasi: 87.8% • LISA: Hotspot High-High");
        } else if (scannerX >= 1.0 && scannerX < 4.5) {
          setRadarScannerText("SCAN 119.4° BT (IKN Nusantara & Sulawesi) • Koridor Baru • Backbone Aktif");
        } else {
          setRadarScannerText("ALERT 138.5° BT (Papua) • Penetrasi: 15.3% • Deteksi 57 Juta Jiwa 3T");
        }
      }

      // Lens Mode Dynamic Styling
      if (curLens === "backbone") {
        dirLight.intensity = 1.0;
        fiberMaterials.forEach((m) => {
          m.opacity = 0.95;
          m.color.setHex(0x00f0ff);
        });
        beamMat.opacity = 0.1;
      } else if (curLens === "satellite") {
        dirLight.intensity = 0.4;
        fillLight.intensity = 0.5;
        beamMat.opacity = 0.8;
        beamMat.color.setHex(0x38bdf8);
        fiberMaterials.forEach((m) => {
          m.opacity = 0.2;
        });
      } else if (curLens === "vision2045") {
        dirLight.intensity = 2.2;
        const yr = visionYearRef.current;
        const progress = (yr - 2026) / (2045 - 2026);
        provMaterials.forEach(({ mat, defaultColor, prov }) => {
          if (prov.klaster <= 1) {
            mat.color.lerp(
              new THREE.Color(progress > 0.5 ? 0x10b981 : 0x7bbde8),
              0.08
            );
          }
        });
        beamMat.opacity = 0.4;
      } else {
        dirLight.intensity = 2.2;
        fillLight.intensity = 1.2;
        beamMat.opacity = 0.3;
        fiberMaterials.forEach((m) => {
          m.opacity = 0.5;
          m.color.setHex(0x7bbde8);
        });
        provMaterials.forEach(({ mat, defaultColor }) => {
          mat.color.setHex(defaultColor);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      renderer.dispose();
    };
  }, [autoRotate]);

  return (
    <section className={`relative overflow-hidden bg-[#001D39] ${embedded ? "w-full h-full" : "rounded-[1.25rem] border-2 border-[#001D39] shadow-[6px_6px_0px_#001D39]"}`}>

      {/* ═══════════════════════════════════════════════════════════════
          IMMERSIVE 3D VIEWPORT — The full-bleed Digital Twin canvas
         ═══════════════════════════════════════════════════════════════ */}
      <div 
        ref={containerRef}
        className={`w-full ${embedded ? "h-full min-h-[440px]" : "h-[75vh] min-h-[480px] max-h-[820px]"} relative overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none`}
      >
        {/* Three.js Canvas */}
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Cinematic gradient overlays for readability */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#001D39]/70 via-transparent to-[#001D39]/80" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#001D39]/50 via-transparent to-transparent" />

        {/* ─── TOP-LEFT: SIGAP BRANDING HUD ─── */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 space-y-3 pointer-events-none max-w-sm sm:max-w-md">
          {/* Badges Row */}
          <div className="flex items-center gap-2 flex-wrap pointer-events-auto">
            <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[10px] font-black text-white shadow-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              P!NGFEST 2026 • UNS
            </span>
            <span className="text-[10px] font-black px-2 py-1 rounded-md bg-[#7BBDE8]/20 backdrop-blur-sm text-[#7BBDE8] border border-[#7BBDE8]/30">
              Infrastruktur & Kota Cerdas
            </span>
          </div>

          {/* SIGAP Title */}
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[0.85] select-none" style={{ textShadow: '4px 4px 0px #7BBDE8, 0 0 40px rgba(123,189,232,0.3)' }}>
              SIGAP
            </h1>
            <p className="text-sm sm:text-base font-black text-[#7BBDE8] tracking-tight mt-1">
              Sistem Informasi Geospasial Akses Presisi
            </p>
            <p className="text-[11px] sm:text-xs text-white/70 font-medium leading-relaxed mt-1.5 max-w-xs sm:max-w-sm">
              Digital Twin 3D kepulauan Indonesia — geometri riil 38 provinsi dengan analitik spasial GWR & LISA.
            </p>
          </div>

          {/* Radar Ticker Feed */}
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 shadow-lg max-w-xs sm:max-w-sm">
            <Activity className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse flex-shrink-0" />
            <span className="text-[10px] font-mono font-medium tracking-tight text-white/80 truncate">
              {radarScannerText}
            </span>
          </div>
        </div>

        {/* ─── TOP-RIGHT: CANVAS CONTROLS ─── */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => controlsRef.current.toggleRotate()}
              className={`p-2.5 rounded-xl backdrop-blur-md border shadow-lg transition-all ${
                autoRotate 
                  ? "bg-[#7BBDE8]/30 text-white border-[#7BBDE8]/50" 
                  : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
              }`}
              title={autoRotate ? "Jeda Rotasi" : "Mulai Rotasi"}
            >
              <RotateCw className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
            </button>

            <button
              onClick={() => controlsRef.current.resetView()}
              className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white/70 shadow-lg transition-all"
              title="Reset Kamera"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Live badge */}
          <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-[9px] font-black text-white/60 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-[#10B981] animate-pulse" />
            LIVE 3D
          </span>
        </div>

        {/* ─── BOTTOM-LEFT: FLOATING METRICS HUD ─── */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 flex items-end gap-2">
          <div className="flex gap-1.5">
            {[
              { value: "38", label: "Provinsi", icon: Globe, color: "#7BBDE8" },
              { value: "4", label: "Klaster", icon: Zap, color: "#10B981" },
              { value: "0.915", label: "R² GWR", icon: BarChart3, color: "#F59E0B" },
            ].map((m) => (
              <div key={m.label} className="px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-lg min-w-[70px]">
                <m.icon className="w-3 h-3 mb-0.5" style={{ color: m.color }} />
                <div className="text-base sm:text-lg font-black text-white leading-none">{m.value}</div>
                <div className="text-[9px] font-bold text-white/50 leading-tight mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── BOTTOM-CENTER: LENS SWITCHER TOOLBAR ─── */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl">
          {[
            { id: "cluster", label: "Klaster", icon: Eye },
            { id: "backbone", label: "Backbone", icon: Wifi },
            { id: "satellite", label: "Satelit", icon: Satellite },
            { id: "vision2045", label: "Visi 2045", icon: Sparkles },
          ].map((mode) => {
            const IconComponent = mode.icon;
            const isActive = activeLens === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveLens(mode.id as LensMode);
                  controlsRef.current.setLens(mode.id as LensMode);
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-white text-[#001D39] shadow-[2px_2px_0px_#7BBDE8]"
                    : "text-white/70 hover:bg-white/15 hover:text-white"
                }`}
              >
                <IconComponent className="w-3 h-3" />
                <span className="hidden lg:inline">{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─── BOTTOM-RIGHT: REGION QUICK-NAV ─── */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex flex-col items-end gap-1.5">
          <span className="text-[9px] font-black uppercase text-white/40 tracking-wider flex items-center gap-1">
            <Compass className="w-3 h-3" />
            Inspeksi Cepat
          </span>
          <div className="flex flex-col gap-1">
            {[
              { key: "jawa", label: "Jawa", icon: "🏙️" },
              { key: "kalimantan", label: "IKN", icon: "🏛️" },
              { key: "papua", label: "Papua 3T", icon: "⚠️" },
              { key: "satria", label: "SATRIA-1", icon: "🛰️" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => controlsRef.current.focusRegion(item.key)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1.5 transition-all backdrop-blur-md border shadow-lg ${
                  selectedRegion?.id === item.key
                    ? "bg-[#7BBDE8]/30 text-white border-[#7BBDE8]/50"
                    : "bg-white/10 text-white/70 border-white/15 hover:bg-white/20 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── HOVER: Province Name Tooltip ─── */}
        {hoveredProvName && !selectedRegion && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div className="px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 shadow-2xl text-center">
              <div className="flex items-center gap-1.5 justify-center">
                <MapPin className="w-3.5 h-3.5 text-[#7BBDE8]" />
                <span className="text-sm font-black text-white tracking-tight">{hoveredProvName}</span>
              </div>
              <span className="text-[9px] text-white/50 font-bold flex items-center justify-center gap-1 mt-0.5">
                <MousePointerClick className="w-2.5 h-2.5" />
                Klik untuk inspeksi
              </span>
            </div>
          </div>
        )}

        {/* ─── IDLE: Center Instruction ─── */}
        {!selectedRegion && !hoveredProvName && (
          <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="flex flex-col items-center gap-1 animate-bounce" style={{ animationDuration: '3s' }}>
              <span className="text-[10px] font-bold text-white/40">Geser, putar, dan klik provinsi</span>
              <ChevronDown className="w-4 h-4 text-white/30" />
            </div>
          </div>
        )}

        {/* ─── VISION 2045 SLIDER OVERLAY ─── */}
        {activeLens === "vision2045" && (
          <div className="absolute bottom-16 sm:bottom-20 left-4 sm:left-6 right-4 sm:right-auto sm:w-96 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-2xl z-20 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-black text-white">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                Indonesia Emas
              </span>
              <span className="text-[#10B981] font-mono text-sm">{visionYear}</span>
            </div>
            <input
              type="range"
              min="2026"
              max="2045"
              step="1"
              value={visionYear}
              onChange={(e) => {
                const yr = parseInt(e.target.value);
                setVisionYear(yr);
                controlsRef.current.setYear(yr);
              }}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
            />
            <div className="flex justify-between text-[9px] font-bold text-white/40">
              <span>2026</span>
              <span>2035</span>
              <span>2045</span>
            </div>
          </div>
        )}

        {/* ─── MOBILE LENS SWITCHER (visible on small screens) ─── */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex sm:hidden items-center gap-1 px-2 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl overflow-x-auto">
          {[
            { id: "cluster", label: "Klaster", icon: Eye },
            { id: "backbone", label: "Backbone", icon: Wifi },
            { id: "satellite", label: "Satelit", icon: Satellite },
            { id: "vision2045", label: "2045", icon: Sparkles },
          ].map((mode) => {
            const IconComponent = mode.icon;
            const isActive = activeLens === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveLens(mode.id as LensMode);
                  controlsRef.current.setLens(mode.id as LensMode);
                }}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-black flex items-center gap-1 transition-all flex-shrink-0 ${
                  isActive
                    ? "bg-white text-[#001D39] shadow-[2px_2px_0px_#7BBDE8]"
                    : "text-white/70 hover:bg-white/15"
                }`}
              >
                <IconComponent className="w-3 h-3" />
                {mode.label}
              </button>
            );
          })}
        </div>

        {/* ═══ TELEMETRY HUD CARD — Shown when province/satellite is clicked ═══ */}
        {selectedRegion && (
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bottom-4 sm:bottom-6 w-[300px] sm:w-[350px] bg-[#001D39]/90 backdrop-blur-xl rounded-2xl border border-white/15 shadow-2xl p-4 sm:p-5 flex flex-col justify-between z-30 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="space-y-3">
              {/* Card Header & Close */}
              <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span 
                      className="w-2.5 h-2.5 rounded-full border border-white/30" 
                      style={{ backgroundColor: selectedRegion.clusterColor }}
                    />
                    <span className="text-[10px] font-black uppercase text-white/50 tracking-wide">
                      Telemetri Geospasial
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white tracking-tight leading-tight">
                    {selectedRegion.name}
                  </h3>
                  <p className="text-[11px] font-bold text-[#7BBDE8] line-clamp-1">
                    {selectedRegion.subtitle}
                  </p>
                </div>
                <button
                  onClick={() => controlsRef.current.resetView()}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white border border-white/15 transition-all"
                  title="Tutup & Reset"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-white/8 border border-white/10">
                  <span className="text-[9px] font-bold text-white/40 block">Penetrasi Seluler</span>
                  <span className="text-sm font-black text-white">{selectedRegion.penetration}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/8 border border-white/10">
                  <span className="text-[9px] font-bold text-white/40 block">Indeks IPM 2024</span>
                  <span className="text-sm font-black text-[#7BBDE8] truncate block">{selectedRegion.ipm}</span>
                </div>
              </div>

              {/* Cluster & LISA Tag */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-black">
                  <span className="text-white/50">Tipologi:</span>
                  <span className="px-2 py-0.5 rounded-lg text-white text-[10px] font-black border border-white/20" style={{ backgroundColor: selectedRegion.clusterColor + '33' }}>
                    {selectedRegion.clusterName}
                  </span>
                </div>
                <p className="text-[10px] font-medium text-white/70 leading-snug">
                  {selectedRegion.highlightText}
                </p>
              </div>

              {/* AI Recommendation */}
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#7BBDE8]/15 to-[#10B981]/10 border border-[#7BBDE8]/20 space-y-1.5">
                <div className="flex items-center gap-1 text-[9px] font-black text-[#00f0ff] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  Rekomendasi AI:
                </div>
                <p className="text-[10px] font-medium text-white/80 leading-snug">
                  {selectedRegion.recommendation}
                </p>
              </div>
            </div>

            {/* Card Actions */}
            <div className="pt-3 flex items-center gap-2">
              <Link
                href="/peta-analisis"
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#7BBDE8] hover:bg-[#6EA2B3] text-[#001D39] text-xs font-black text-center border border-[#001D39] shadow-[2px_2px_0px_#001D39] flex items-center justify-center gap-1.5 transition-transform active:translate-x-0.5"
              >
                <span>Analisis Peta</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => controlsRef.current.resetView()}
                className="py-2.5 px-3 rounded-xl bg-white/10 border border-white/20 text-xs font-black text-white/70 hover:bg-white/20 hover:text-white transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          BOTTOM ACTION BAR — Legend, Info, CTAs (Compact)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="px-4 sm:px-6 py-3 bg-[#001D39] border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Left: Legend */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              {[
                { color: "#10B981", label: "Maju" },
                { color: "#7BBDE8", label: "Berkembang" },
                { color: "#F59E0B", label: "Tertinggal" },
                { color: "#EF4444", label: "Ekstrem 3T" },
              ].map((c) => (
                <span key={c.label} className="flex items-center gap-1 text-[10px] font-bold text-white/50">
                  <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: c.color }} />
                  {c.label}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-white/30 hidden md:inline">|</span>
            <span className="text-[10px] text-white/40 font-medium hidden md:inline flex items-center gap-1">
              <Info className="w-3 h-3 inline" /> 57 juta jiwa di 3T terisolasi sinyal — AI memetakan, manusia memutuskan.
            </span>
          </div>

          {/* Right: CTAs */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/peta-analisis"
              className="px-4 py-2 rounded-xl bg-[#7BBDE8] hover:bg-[#6EA2B3] text-[#001D39] text-xs font-black flex items-center gap-1.5 border border-[#001D39] shadow-[2px_2px_0px_#7BBDE8] transition-transform active:translate-x-0.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Peta Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/simulasi-kebijakan"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black flex items-center gap-1.5 border border-white/20 transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulasi</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
