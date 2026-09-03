"use client";

import { useEffect, useRef, useCallback, ReactNode } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Point {
  x: number;
  y: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  born: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CELL_SIZE = 65; // Optimized cell size
const INFLUENCE_RADIUS = 260;
const MAX_WARP = 24;
const DOT_SPACING = 30;
const LERP_SPEED = 0.08;

const LINE_BASE_COLOR = "rgba(255, 255, 255, 0.11)";
const NODE_BASE_RADIUS = 1.5;
const NODE_ACTIVE_RADIUS = 3.0;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lerpN(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(
  base: { r: number; g: number; b: number; a: number },
  active: { r: number; g: number; b: number; a: number },
  t: number,
): string {
  const r = Math.round(lerpN(base.r, active.r, t));
  const g = Math.round(lerpN(base.g, active.g, t));
  const b = Math.round(lerpN(base.b, active.b, t));
  const a = lerpN(base.a, active.a, t);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function KineticGrid({
  children,
  className,
  globalColor = "default",
}: {
  children?: ReactNode;
  className?: string;
  globalColor?: "default" | "monochrome";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenDotsRef = useRef<HTMLCanvasElement | null>(null);

  const mouseRef = useRef<Point>({ x: -9999, y: -9999 });
  const targetMouseRef = useRef<Point>({ x: -9999, y: -9999 });
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const isRunningRef = useRef<boolean>(false);
  const idleFramesRef = useRef<number>(0);

  // ── Prerender Static Dots (Only runs on resize) ──────────────────────────────

  const prerenderDots = useCallback((w: number, h: number) => {
    if (!offscreenDotsRef.current) {
      offscreenDotsRef.current = document.createElement("canvas");
    }
    const off = offscreenDotsRef.current;
    off.width = w;
    off.height = h;
    const ctx = off.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.beginPath();
    for (let x = DOT_SPACING / 2; x < w; x += DOT_SPACING) {
      for (let y = DOT_SPACING / 2; y < h; y += DOT_SPACING) {
        ctx.moveTo(x + 0.7, y);
        ctx.arc(x, y, 0.7, 0, Math.PI * 2);
      }
    }
    ctx.fill();
  }, []);

  // ── Warp Point (Optimized distance check) ──────────────────────────────────

  const getWarpedPoint = useCallback(
    (
      gx: number,
      gy: number,
      col: number,
      row: number,
      mouse: Point,
      ripples: Ripple[],
      cols: number,
      rows: number,
    ): { pt: Point; proximity: number } => {
      const edgeMargin = 1.5;
      const colPin = Math.min(col / edgeMargin, (cols - 1 - col) / edgeMargin, 1);
      const rowPin = Math.min(row / edgeMargin, (rows - 1 - row) / edgeMargin, 1);
      const pinFactor = colPin * colPin * rowPin * rowPin;

      const dx = gx - mouse.x;
      const dy = gy - mouse.y;
      const distSq = dx * dx + dy * dy;
      const influenceRadiusSq = INFLUENCE_RADIUS * INFLUENCE_RADIUS;

      let proximity = 0;
      let rx = 0;
      let ry = 0;

      // Fast proximity calculation
      if (distSq < influenceRadiusSq && pinFactor > 0) {
        const dist = Math.sqrt(distSq);
        proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pinFactor;

        const t = dist / INFLUENCE_RADIUS;
        const eased = t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60);
        const warpAmt = eased * MAX_WARP * pinFactor;
        const angle = Math.atan2(dy, dx);
        rx -= Math.cos(angle) * warpAmt;
        ry -= Math.sin(angle) * warpAmt;
      }

      // Ripple displacement (only calculate if ripples exist)
      if (ripples.length > 0 && pinFactor > 0) {
        for (let i = 0; i < ripples.length; i++) {
          const r = ripples[i];
          const rdx = gx - r.x;
          const rdy = gy - r.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          const waveWidth = 55;
          const diff = rdist - r.radius;
          if (Math.abs(diff) < waveWidth) {
            const strength =
              (1 - Math.abs(diff) / waveWidth) * r.opacity * 18 * pinFactor;
            const angle = Math.atan2(rdy, rdx);
            const sign = diff < 0 ? -1 : 1;
            rx += Math.cos(angle) * strength * sign * -1;
            ry += Math.sin(angle) * strength * sign * -1;
          }
        }
      }

      return { pt: { x: gx + rx, y: gy + ry }, proximity };
    },
    [],
  );

  // ── Draw (High performance batched paths) ───────────────────────────────────

  const draw = useCallback(
    (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const { w: W, h: H } = sizeRef.current;
      const mouse = mouseRef.current;
      const ripples = ripplesRef.current;

      const theme = {
        default: {
          bg: "#000000",
          lineBase: { r: 255, g: 255, b: 255, a: 0.11 },
          lineActive: { r: 56, g: 189, b: 248, a: 0.9 },
          nodeActive: { r: 56, g: 189, b: 248, a: 1.0 },
          glow: "56,189,248",
          ripple: "100,210,255",
        },
        monochrome: {
          bg: "#000000",
          lineBase: { r: 255, g: 255, b: 255, a: 0.11 },
          lineActive: { r: 255, g: 255, b: 255, a: 0.9 },
          nodeActive: { r: 255, g: 255, b: 255, a: 1.0 },
          glow: "255,255,255",
          ripple: "255,255,255",
        },
      }[globalColor ?? "default"];

      // 1. Clear background
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, W, H);

      // 2. Draw prerendered background dots in 1 single call!
      if (offscreenDotsRef.current) {
        ctx.drawImage(offscreenDotsRef.current, 0, 0);
      }

      // 3. Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const age = (now - r.born) / 1000;
        r.radius = Math.max(0, age * 400);
        r.opacity = Math.max(0, 1 - age * 1.2);
        if (r.opacity <= 0) ripples.splice(i, 1);
      }

      // 4. Build warped grid
      const cols = Math.max(2, Math.ceil(W / CELL_SIZE)) + 1;
      const rows = Math.max(2, Math.ceil(H / CELL_SIZE)) + 1;
      const cellW = W / (cols - 1);
      const cellH = H / (rows - 1);

      const pts: Point[][] = [];
      const prox: number[][] = [];

      for (let row = 0; row < rows; row++) {
        pts[row] = [];
        prox[row] = [];
        for (let col = 0; col < cols; col++) {
          const { pt, proximity } = getWarpedPoint(
            col * cellW,
            row * cellH,
            col,
            row,
            mouse,
            ripples,
            cols,
            rows,
          );
          pts[row][col] = pt;
          prox[row][col] = proximity;
        }
      }

      // 5. Batched Inactive Lines vs Dynamic Active Lines
      // Batch all inactive lines into one single stroke call
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = LINE_BASE_COLOR;
      ctx.beginPath();

      const activeSegments: Array<{ p1: Point; p2: Point; avg: number }> = [];

      // Horizontal segments
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols - 1; col++) {
          const pr1 = prox[row][col];
          const pr2 = prox[row][col + 1];
          const avg = (pr1 + pr2) * 0.5;
          const p1 = pts[row][col];
          const p2 = pts[row][col + 1];

          if (avg > 0.02) {
            activeSegments.push({ p1, p2, avg });
          } else {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }

      // Vertical segments
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows - 1; row++) {
          const pr1 = prox[row][col];
          const pr2 = prox[row + 1][col];
          const avg = (pr1 + pr2) * 0.5;
          const p1 = pts[row][col];
          const p2 = pts[row + 1][col];

          if (avg > 0.02) {
            activeSegments.push({ p1, p2, avg });
          } else {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }

      // Single stroke for 95% of grid lines!
      ctx.stroke();

      // Render only active segments
      for (let i = 0; i < activeSegments.length; i++) {
        const seg = activeSegments[i];
        const t = seg.avg * seg.avg * (3 - 2 * seg.avg);
        ctx.beginPath();
        ctx.moveTo(seg.p1.x, seg.p1.y);
        ctx.lineTo(seg.p2.x, seg.p2.y);
        ctx.strokeStyle = lerpColor(theme.lineBase, theme.lineActive, t);
        ctx.lineWidth = lerpN(0.8, 1.6, t);
        ctx.stroke();
      }

      // 6. Batched Inactive Nodes vs Active Glowing Nodes
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.beginPath();

      const activeNodes: Array<{ p: Point; t: number; r: number }> = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const pr = prox[row][col];
          const p = pts[row][col];

          if (pr > 0.03) {
            const t = pr * pr * (3 - 2 * pr);
            const r = lerpN(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, t);
            activeNodes.push({ p, t, r });
          } else {
            ctx.moveTo(p.x + NODE_BASE_RADIUS, p.y);
            ctx.arc(p.x, p.y, NODE_BASE_RADIUS, 0, Math.PI * 2);
          }
        }
      }

      // Single fill for all inactive nodes!
      ctx.fill();

      // Render active nodes with glowing gradients
      for (let i = 0; i < activeNodes.length; i++) {
        const node = activeNodes[i];
        if (node.t > 0.3) {
          const glowR = node.r + lerpN(0, 6, (node.t - 0.3) / 0.7);
          const grd = ctx.createRadialGradient(
            node.p.x,
            node.p.y,
            node.r * 0.5,
            node.p.x,
            node.p.y,
            glowR,
          );
          grd.addColorStop(0, `rgba(${theme.glow},${(node.t * 0.3).toFixed(3)})`);
          grd.addColorStop(1, `rgba(${theme.glow},0)`);
          ctx.beginPath();
          ctx.arc(node.p.x, node.p.y, glowR, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.p.x, node.p.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = lerpColor(
          { r: 255, g: 255, b: 255, a: 0.2 },
          theme.nodeActive,
          node.t,
        );
        ctx.fill();
      }

      // 7. Ripple rings
      for (let i = 0; i < ripples.length; i++) {
        const r = ripples[i];
        const safeRadius = Math.max(0, r.radius);
        ctx.beginPath();
        ctx.arc(r.x, r.y, safeRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${theme.ripple},${(r.opacity * 0.28).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    },
    [getWarpedPoint, globalColor],
  );

  // ── Idle-Aware Animation Loop ───────────────────────────────────────────────

  const requestTick = useCallback(() => {
    idleFramesRef.current = 0;
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      const loop = (now: number) => {
        const m = mouseRef.current;
        const t = targetMouseRef.current;

        const dx = t.x - m.x;
        const dy = t.y - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        m.x = lerpN(m.x, t.x, LERP_SPEED);
        m.y = lerpN(m.y, t.y, LERP_SPEED);

        draw(now);

        // Check if mouse is stationary and ripples are done
        if (dist < 0.2 && ripplesRef.current.length === 0) {
          idleFramesRef.current++;
          if (idleFramesRef.current > 30) {
            // Settle to stationary state and sleep loop
            isRunningRef.current = false;
            return;
          }
        } else {
          idleFramesRef.current = 0;
        }

        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }
  }, [draw]);

  // ── Setup Listeners ─────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      sizeRef.current = { w, h };
      prerenderDots(w, h);
      requestTick();
    };

    setSize();
    window.addEventListener("resize", setSize);

    const onMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = { x: e.clientX, y: e.clientY };
      requestTick();
    };

    const onClick = (e: MouseEvent) => {
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        opacity: 1,
        born: performance.now(),
      });
      requestTick();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    requestTick();

    return () => {
      window.removeEventListener("resize", setSize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      isRunningRef.current = false;
    };
  }, [requestTick, prerenderDots]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        "relative w-full min-h-screen bg-black text-white",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      />

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
