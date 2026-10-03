"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type GridPulseProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Cell size in px. The hairlines and the lit cells share it. Defaults to 24px. */
  cell?: number;
  /** How far from the pointer a cell can still catch light, in cells. */
  reach?: number;
  /** How many cells light on their own each beat, so the grid is never dead. */
  ambient?: number;
  /** A lid, so a fast sweep cannot light the whole field at once. */
  maxLit?: number;
  /**
   * Elements whose lines of text the light holds back from, looked up
   * inside the grid's parent.
   */
  avoid?: string;
  /** Color theme mode: "sigap" (custom navy/ocean/sky/emerald palette) or "spectrum" (original rainbow) */
  palette?: "sigap" | "spectrum";
  /** Optional bottom fade mask. Defaults to false for full-screen coverage. */
  fadeBottom?: boolean;
};

/**
 * SIGAP / PINGFEST COLOR PALETTE
 * Tailored to match Midnight Navy (#001D39), Steel Blue (#49769F),
 * Ocean Teal (#4E8EA2), Sky Blue (#7BBDE8), and Emerald Green (#10B981).
 * Top: Sky Blue (212°) -> Mid: Ocean Teal (185°) -> Bottom: Emerald Green (155°)
 */
const SIGAP_HUE_TOP = 215;
const SIGAP_HUE_SPAN = 65; // Transitions from 215° (Sky Blue) down to 150° (Emerald)

// Original spectrum fallback constants
const HUE_TOP = 60;
const HUE_SPAN = 270;

/**
 * Tints for light backgrounds (like #EDF4F9) and dark grounds.
 * Lightness calibrated for clear luminescence on #EDF4F9.
 */
const TINTS = [55, 62, 70, 78, 84];
const TINTS_DARK = [68, 60, 52, 45, 38];

/** How faint a cell goes right behind a line of text. */
const FAINT = 0.15;
/** How many cells it takes to come back up to full strength. */
const FADE = 2.2;
/** Clearing kept around each line of text, in px. */
const PAD = 6;
const FADE_IN = 160;
const FADE_OUT = 750;

type Cell = {
  col: number;
  row: number;
  colour: string;
  /** How much of its colour the cell is allowed, 0 to 1. */
  dim: number;
  born: number;
  /** When it starts to fade out. */
  until: number;
};

const easeOut = (t: number) => 1 - (1 - t) ** 2;
const easeIn = (t: number) => t * t;

/**
 * GridPulse: An interactive fine grid background that lights up cells in SIGAP's
 * signature colour palette as the cursor moves over it, with gentle ambient pulses.
 */
export function GridPulse({
  cell = 24,
  reach = 2.6,
  ambient = 2,
  maxLit = 180,
  avoid = "[data-grid-avoid]",
  palette = "sigap",
  fadeBottom = false,
  className,
  style,
  ...props
}: GridPulseProps) {
  const box = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const el = box.current;
    const paper = canvas.current;
    const ctx = paper?.getContext("2d");
    if (!el || !paper || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cols = 1;
    let rows = 1;
    let width = 0;
    let height = 0;
    let clear: DOMRect[] = [];
    let tints = TINTS;
    const cells = new Map<string, Cell>();

    // Detect light or dark ground from inherited text color
    const probe = document.createElement("canvas").getContext("2d", {
      willReadFrequently: true,
    });
    const readTheme = () => {
      if (!probe) return;
      probe.clearRect(0, 0, 1, 1);
      probe.fillStyle = getComputedStyle(el).color;
      probe.fillRect(0, 0, 1, 1);
      const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
      const light = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.5;
      tints = light ? TINTS_DARK : TINTS;
    };

    // Protect lines of text inside elements marked with avoid selector
    const measureText = () => {
      const bounds = el.getBoundingClientRect();
      const scope = el.parentElement ?? document;
      clear = [...scope.querySelectorAll(avoid)].flatMap((node) => {
        const range = document.createRange();
        range.selectNodeContents(node);
        const lines = [...range.getClientRects()].filter(
          (r) => r.width > 0 && r.height > 0,
        );
        const boxes = lines.length > 0 ? lines : [node.getBoundingClientRect()];
        return boxes.map(
          (r) =>
            new DOMRect(
              r.left - bounds.left - PAD,
              r.top - bounds.top - PAD,
              r.width + PAD * 2,
              r.height + PAD * 2,
            ),
        );
      });
    };

    const measure = () => {
      width = el.clientWidth;
      height = el.clientHeight;
      cols = Math.max(1, Math.ceil(width / cell));
      rows = Math.max(1, Math.ceil(height / cell));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      paper.width = Math.round(width * dpr);
      paper.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readTheme();
      measureText();
      wake();
    };

    const brightness = (col: number, row: number) => {
      const x = col * cell + cell / 2;
      const y = row * cell + cell / 2;
      let nearest = Number.POSITIVE_INFINITY;
      for (const r of clear) {
        const dx = Math.max(r.left - x, 0, x - r.right);
        const dy = Math.max(r.top - y, 0, y - r.bottom);
        nearest = Math.min(nearest, Math.hypot(dx, dy));
        if (nearest === 0) break;
      }
      if (nearest === Number.POSITIVE_INFINITY) return 1;
      return FAINT + (1 - FAINT) * Math.min(1, nearest / (FADE * cell));
    };

    /**
     * Compute cell ink based on SIGAP / Pingfest palette:
     * - Geospatial ocean & terrain gradient (Sky Blue -> Ocean Teal -> Emerald Green)
     * - Occasional Amber (#F59E0B) radar ping or electric ice pulse
     */
    const ink = (row: number) => {
      const tint = tints[Math.floor(Math.random() * tints.length)];

      if (palette === "sigap") {
        const rand = Math.random();
        // 8% chance of Radar Alert Amber (#F59E0B) pulse
        if (rand < 0.08) {
          return `hsl(38 92% ${Math.min(tint, 62)}%)`;
        }
        // 12% chance of Ice Sky highlight (#7BBDE8)
        if (rand < 0.20) {
          return `hsl(203 76% ${Math.min(tint + 5, 80)}%)`;
        }

        // Standard SIGAP vertical geospatial spectrum: Sky Blue -> Teal -> Emerald
        const t = rows > 1 ? Math.min(1, row / (rows - 1)) : 0;
        const hue = SIGAP_HUE_TOP - t * SIGAP_HUE_SPAN;
        return `hsl(${Math.round(hue)} 82% ${tint}%)`;
      }

      // Classic spectrum
      const t = rows > 1 ? Math.min(1, row / (rows - 1)) : 0;
      const hue = (((HUE_TOP - t * HUE_SPAN) % 360) + 360) % 360;
      return `hsl(${Math.round(hue)} 94% ${tint}%)`;
    };

    let frame = 0;
    const draw = (now: number) => {
      frame = 0;
      ctx.clearRect(0, 0, width, height);
      for (const [key, c] of cells) {
        let alpha: number;
        if (now < c.until) {
          alpha = easeOut(Math.min(1, (now - c.born) / FADE_IN));
        } else {
          const t = (now - c.until) / FADE_OUT;
          if (t >= 1) {
            cells.delete(key);
            continue;
          }
          alpha = 1 - easeIn(t);
        }
        ctx.globalAlpha = alpha * c.dim;
        ctx.fillStyle = c.colour;
        // Inset by the hairline, so the grid still shows between lit cells
        ctx.fillRect(c.col * cell + 1, c.row * cell + 1, cell - 1, cell - 1);
      }
      ctx.globalAlpha = 1;
      if (cells.size > 0) frame = requestAnimationFrame(draw);
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const light = (col: number, row: number, hold: number) => {
      if (col < 0 || row < 0 || col >= cols || row >= rows) return;
      if (cells.size >= maxLit) return;
      const key = `${col},${row}`;
      const now = performance.now();
      const lit = cells.get(key);
      if (lit && now < lit.until) return;

      let born = now;
      if (lit) {
        const faded = 1 - easeIn(Math.min(1, (now - lit.until) / FADE_OUT));
        born = now - (1 - Math.sqrt(1 - faded)) * FADE_IN;
      }
      cells.set(key, {
        col,
        row,
        colour: lit?.colour ?? ink(row),
        dim: brightness(col, row),
        born,
        until: now + hold,
      });
      wake();
    };

    let pending = 0;
    let at: { x: number; y: number } | null = null;
    const paint = () => {
      pending = 0;
      if (!at) return;
      const cx = Math.floor(at.x / cell);
      const cy = Math.floor(at.y / cell);
      const span = Math.ceil(reach);
      for (let dy = -span; dy <= span; dy++) {
        for (let dx = -span; dx <= span; dx++) {
          const away = Math.hypot(dx, dy);
          if (away > reach) continue;
          if (Math.random() > 1 - away / (reach + 0.6)) continue;
          light(cx + dx, cy + dy, 260 + Math.random() * 900);
        }
      }
    };

    const onMove = (event: PointerEvent) => {
      const bounds = el.getBoundingClientRect();
      at = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      if (!pending) pending = requestAnimationFrame(paint);
    };

    let visible = true;
    let beat = 0;
    const drift = () => {
      beat = window.setTimeout(drift, 1400 + Math.random() * 1800);
      if (!visible || document.hidden) return;
      for (let i = 0; i < ambient; i++) {
        light(
          Math.floor(Math.random() * cols),
          Math.floor(Math.random() * rows),
          900 + Math.random() * 1600,
        );
      }
    };
    beat = window.setTimeout(drift, 500);

    const sight = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    sight.observe(el);

    const resize = new ResizeObserver(measure);
    resize.observe(el);

    let recheck = 0;
    const copy = new MutationObserver(() => {
      if (!recheck) {
        recheck = requestAnimationFrame(() => {
          recheck = 0;
          measureText();
        });
      }
    });
    copy.observe(el.parentElement ?? document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    const theme = new MutationObserver(readTheme);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", readTheme);

    measure();
    document.fonts?.ready.then(measureText).catch(() => {});
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      sight.disconnect();
      resize.disconnect();
      copy.disconnect();
      cancelAnimationFrame(recheck);
      theme.disconnect();
      scheme.removeEventListener("change", readTheme);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      clearTimeout(beat);
      window.removeEventListener("pointermove", onMove);
    };
  }, [cell, reach, ambient, maxLit, avoid, palette]);

  return (
    <div
      ref={box}
      aria-hidden
      data-slot="grid-pulse"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        // Pingfest Grid Hairlines: subtle midnight navy lines matching the 24px layout
        "[--grid-pulse-line:rgba(73,118,159,0.18)]",
        // Soft fade out at bottom if requested
        fadeBottom && "[mask-image:linear-gradient(to_bottom,#000_90%,transparent)]",
        className,
      )}
      style={
        {
          "--grid-pulse-cell": `${cell}px`,
          backgroundImage:
            "linear-gradient(to right, var(--grid-pulse-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-pulse-line) 1px, transparent 1px)",
          backgroundSize: "var(--grid-pulse-cell) var(--grid-pulse-cell)",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <canvas ref={canvas} className="absolute inset-0 size-full" />
    </div>
  );
}
