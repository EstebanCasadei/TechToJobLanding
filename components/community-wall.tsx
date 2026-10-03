"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { blobatar } from "blobatar/blob";
import { _layout } from "blobatar";
import { Blobatar } from "@blobatar/react";
import { AnimatedButtonLabel } from "@/components/animated-button-label";

const CELL = 76;
const FILL = 0.86;
const SPRITE_PX = 96;
const DRAG_SLOP = 5;
const EDGE_PAD = 2;
const SPOT: Cell = { x: 0, y: 0 };

type Cell = { x: number; y: number };

// Positions on the lattice, paired with `members` by index. Cell (0,0) is kept
// empty on purpose: it is the spot the visitor can claim.
const FIELD: ReadonlyArray<readonly [number, number]> = [
  // inner ring around the open spot
  [-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1],
  // second ring
  [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2], [-2, -1], [2, -1], [-2, 0],
  [2, 0], [-2, 1], [2, 1], [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2],
  // third ring, with gaps
  [-3, -2], [-3, -1], [-3, 0], [-3, 1], [3, -2], [3, -1], [3, 1], [3, 2],
  [-2, -3], [-1, -3], [0, -3], [1, -3], [2, -3], [-2, 3], [-1, 3], [0, 3],
  [1, 3], [2, 3],
  // scattered edges, so the field is wider than the panel and panning matters
  [-5, -4], [-6, -2], [-8, -1], [-9, 2], [-5, 4], [-3, 5], [-1, 6], [1, 6],
  [3, 5], [5, 4], [9, 1], [8, -2], [6, -3], [4, -5], [2, -5], [0, -6],
  [-2, -6], [-4, -4],
];

type Sprite = { source: CanvasImageSource | null; ready: boolean };
const sprites = new Map<string, Sprite>();
const colours = new Map<string, string>();

function colourOf(name: string): string {
  const known = colours.get(name);
  if (known) return known;
  const colour = _layout(name).palette.head ?? "#84c0bf";
  colours.set(name, colour);
  return colour;
}

function spriteOf(name: string, onReady: () => void): CanvasImageSource | null {
  const known = sprites.get(name);
  if (known) return known.ready ? known.source : null;
  const sprite: Sprite = { source: null, ready: false };
  sprites.set(name, sprite);
  const image = new Image();
  image.onload = () => {
    if (typeof createImageBitmap !== "function") {
      sprite.source = image;
      sprite.ready = true;
      onReady();
      return;
    }
    void createImageBitmap(image).then(
      (bitmap) => { sprite.source = bitmap; sprite.ready = true; onReady(); },
      () => { sprite.source = image; sprite.ready = true; onReady(); },
    );
  };
  image.onerror = () => sprites.delete(name);
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(blobatar(name, { size: SPRITE_PX }))}`;
  return null;
}

type Props = {
  members: string[];
  hint: string;
  wallLabel: string;
  spot: { label: string; title: string; cta: string };
  discord: string;
};

export function CommunityWall({ members, hint, wallLabel, spot, discord }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotRef = useRef<HTMLButtonElement>(null);
  const hoverNodeRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef({ x: 0, y: 0 });
  const viewRef = useRef({ width: 0, height: 0 });
  const frameRef = useRef(0);
  const dragRef = useRef<{ x: number; y: number; moved: number } | null>(null);
  const hoverCellRef = useRef<Cell | null>(null);
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState<{ cell: Cell; name: string } | null>(null);
  const [spotOpen, setSpotOpen] = useState<{ x: number; y: number } | null>(null);
  const [explored, setExplored] = useState(false);

  const occupancy = useMemo(() => {
    const map = new Map<string, string>();
    FIELD.forEach(([x, y], index) => {
      const member = members[index];
      if (member) map.set(`${x},${y}`, member);
    });
    return map;
  }, [members]);

  const bounds = useMemo(() => {
    let x0 = 0, x1 = 0, y0 = 0, y1 = 0;
    for (const [x, y] of FIELD) {
      x0 = Math.min(x0, x); x1 = Math.max(x1, x);
      y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
    return { x0: x0 - EDGE_PAD, x1: x1 + EDGE_PAD, y0: y0 - EDGE_PAD, y1: y1 + EDGE_PAD };
  }, []);

  const toScreen = useCallback((cx: number, cy: number) => ({
    x: viewRef.current.width / 2 + (cx - cameraRef.current.x) * CELL,
    y: viewRef.current.height / 2 + (cy - cameraRef.current.y) * CELL,
  }), []);

  const cellFracAt = useCallback((sx: number, sy: number) => ({
    x: cameraRef.current.x + (sx - viewRef.current.width / 2) / CELL,
    y: cameraRef.current.y + (sy - viewRef.current.height / 2) / CELL,
  }), []);

  const cellUnder = useCallback((sx: number, sy: number): Cell => {
    const at = cellFracAt(sx, sy);
    return { x: Math.round(at.x) || 0, y: Math.round(at.y) || 0 };
  }, [cellFracAt]);

  const placeSpot = useCallback(() => {
    const node = spotRef.current;
    if (!node) return;
    const at = toScreen(SPOT.x, SPOT.y);
    node.style.transform = `translate(${at.x}px, ${at.y}px) translate(-50%, -50%)`;
  }, [toScreen]);

  const paintRef = useRef<() => void>(() => {});

  const draw = useCallback(() => {
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      paintRef.current();
    });
  }, []);

  // The hovered cell is also drawn by a DOM overlay — a live Blobatar that can
  // play its animation, which a rasterised sprite cannot. The canvas keeps
  // painting the sprite underneath so the overlay can appear and disappear on
  // any frame without ever leaving a hole. The overlay is positioned from the
  // committed `hovered` state (see the layout effect below), never from the
  // live ref: a pointermove is a continuous event, so a paint can run before
  // React commits, and reading the ref there would move the overlay to the new
  // cell while it still shows the previous avatar.
  const placeHover = useCallback((cell: Cell) => {
    const node = hoverNodeRef.current;
    if (!node) return;
    const at = toScreen(cell.x, cell.y);
    const size = CELL * FILL;
    node.style.transform = `translate(${at.x - size / 2}px, ${at.y - size / 2}px)`;
  }, [toScreen]);

  const hoverCell = useCallback((cell: Cell | null) => {
    const current = hoverCellRef.current;
    if (current?.x === cell?.x && current?.y === cell?.y) return;
    hoverCellRef.current = cell;
    setHovered(cell ? { cell, name: occupancy.get(`${cell.x},${cell.y}`)! } : null);
  }, [occupancy]);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const view = viewRef.current;
    const camera = cameraRef.current;
    ctx.clearRect(0, 0, view.width, view.height);

    const x0 = camera.x - view.width / 2 / CELL;
    const x1 = camera.x + view.width / 2 / CELL;
    const y0 = camera.y - view.height / 2 / CELL;
    const y1 = camera.y + view.height / 2 / CELL;

    // The lattice: brand green at 0.2 opacity, always drawn, under the blobs.
    ctx.strokeStyle = "rgba(132, 192, 191, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = Math.floor(x0); x <= Math.ceil(x1) + 1; x++) {
      const at = toScreen(x - 0.5, 0).x;
      ctx.moveTo(at, 0);
      ctx.lineTo(at, view.height);
    }
    for (let y = Math.floor(y0); y <= Math.ceil(y1) + 1; y++) {
      const at = toScreen(0, y - 0.5).y;
      ctx.moveTo(0, at);
      ctx.lineTo(view.width, at);
    }
    ctx.stroke();

    const size = CELL * FILL;
    occupancy.forEach((name, key) => {
      const [cx, cy] = key.split(",").map(Number);
      if (cx < x0 - 1 || cx > x1 + 1 || cy < y0 - 1 || cy > y1 + 1) return;
      const at = toScreen(cx, cy);
      const sprite = spriteOf(name, draw);
      if (sprite) {
        ctx.drawImage(sprite, at.x - size / 2, at.y - size / 2, size, size);
      } else {
        ctx.fillStyle = colourOf(name);
        ctx.beginPath();
        ctx.arc(at.x, at.y, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    placeSpot();
  }, [draw, occupancy, toScreen, placeSpot]);

  useEffect(() => { paintRef.current = paint; });
  // Layout effect: position and content commit together, before the browser
  // paints — the overlay can never be seen at the new cell with the old avatar.
  useLayoutEffect(() => {
    if (hovered) placeHover(hovered.cell);
  }, [hovered, placeHover]);

  // The wall sits near the bottom of the page: painting the canvas and
  // generating every avatar sprite on mount costs main-thread time the hero
  // needs. Hold off until the section is about to enter the viewport.
  useEffect(() => {
    const node = rootRef.current;
    if (!node || active) return;
    if (typeof IntersectionObserver !== "function") {
      const id = setTimeout(() => setActive(true), 0);
      return () => clearTimeout(id);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      viewRef.current = { width: rect.width, height: rect.height };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
      hoverCellRef.current = null;
      setHovered(null);
      setSpotOpen(null);
      draw();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw, active]);

  useEffect(() => {
    if (!spotOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSpotOpen(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [spotOpen]);

  const clampCamera = useCallback(() => {
    const camera = cameraRef.current;
    camera.x = Math.min(bounds.x1, Math.max(bounds.x0, camera.x));
    camera.y = Math.min(bounds.y1, Math.max(bounds.y0, camera.y));
  }, [bounds]);

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, moved: 0 };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const drag = dragRef.current;
    if (drag) {
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      if (drag.moved > DRAG_SLOP) {
        drag.x = event.clientX;
        drag.y = event.clientY;
        cameraRef.current.x -= dx / CELL;
        cameraRef.current.y -= dy / CELL;
        clampCamera();
        hoverCell(null);
        setSpotOpen(null);
        setExplored(true);
        canvas.style.cursor = "grabbing";
        draw();
      }
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const sx = event.clientX - rect.left;
    const sy = event.clientY - rect.top;
    const at = cellUnder(sx, sy);
    canvas.style.cursor = "grab";
    const name = occupancy.get(`${at.x},${at.y}`);
    if (name) {
      hoverCell(at);
      return;
    }
    // Keep the hover while the pointer is near the hovered cell — the name
    // label sits just below the avatar, over the edge of the next cell.
    const current = hoverCellRef.current;
    if (current) {
      const frac = cellFracAt(sx, sy);
      if (Math.hypot(frac.x - current.x, frac.y - current.y) > 1.35) hoverCell(null);
    }
  };

  const onPointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const drag = dragRef.current;
    dragRef.current = null;
    canvas.style.cursor = "grab";
    if (!drag || drag.moved > DRAG_SLOP) return;
    setSpotOpen(null);
  };

  const openSpot = () => {
    setSpotOpen((open) => {
      if (open) return null;
      const screen = spotAt();
      const half = Math.min(150, viewRef.current.width / 2 - 12);
      return { x: Math.min(viewRef.current.width - half, Math.max(half, screen.x)), y: screen.y };
    });
  };

  const spotAt = () => toScreen(SPOT.x, SPOT.y);

  return (
    <div ref={rootRef} className="relative h-[clamp(24rem,60svh,34rem)] overflow-hidden rounded-3xl border border-white/10 after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] after:shadow-[inset_0_0_72px_28px_var(--color-ink)] after:content-['']">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full cursor-grab [touch-action:pan-y]"
        aria-hidden="true"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { dragRef.current = null; }}
        onPointerLeave={() => hoverCell(null)}
      />
      {/* Kept mounted and toggled by visibility: remounting per cell would
          flash the overlay at the origin for a frame. */}
      <div ref={hoverNodeRef} className={`pointer-events-none absolute left-0 top-0 z-20 size-[65px] ${hovered ? "visible" : "invisible"}`} aria-hidden="true">
        {hovered && (
          <>
            <Blobatar key={hovered.name} name={hovered.name} size={Math.round(CELL * FILL)} animate="always" />
            <span className="absolute left-1/2 top-[calc(100%_+_4px)] max-w-[7.5rem] -translate-x-1/2 truncate rounded-lg bg-ink/88 px-2 py-[.15rem] text-[.7rem] font-bold leading-[1.3] text-white">{hovered.name}</span>
          </>
        )}
      </div>
      <button
        ref={spotRef}
        type="button"
        className="absolute left-0 top-0 z-20 size-[92px] cursor-pointer border-0 bg-transparent p-0 before:absolute before:inset-[14px] before:rotate-[-4deg] before:rounded-[47%_53%_55%_45%/52%_44%_56%_48%] before:border-[3px] before:border-primary before:transition-transform before:duration-250 before:content-[''] after:absolute after:inset-[18px] after:animate-wall-ping after:rounded-[55%_45%_46%_54%/45%_55%_44%_56%] after:border-2 after:border-primary after:opacity-45 after:[transform:rotate(6deg)] after:content-[''] hover:before:scale-[1.08] focus-visible:rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:before:scale-[1.08]"
        aria-label={spot.label}
        aria-expanded={spotOpen !== null}
        onClick={openSpot}
      />
      {spotOpen && (
        <div className="absolute z-30 flex max-w-[min(15rem,80vw)] -translate-x-1/2 -translate-y-[calc(100%_+_14px)] rotate-[-1deg] animate-wall-tip-in flex-col items-start gap-2.5 rounded-2xl border border-white/20 bg-slate px-3.5 py-4 text-left text-white shadow-card after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-7 after:border-transparent after:border-t-slate after:content-['']" style={{ left: spotOpen.x, top: spotOpen.y }}>
          <strong className="block text-sm leading-snug">{spot.title}</strong>
          <a href={discord} className="group/action relative mt-2 inline-flex min-h-10 items-center overflow-hidden rounded-full bg-primary px-4 text-xs font-bold text-ink mx-auto">
            <AnimatedButtonLabel text={spot.cta} />
          </a>
        </div>
      )}
      {!explored && <p className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-ink/80 px-4 py-2 text-xs text-white/75">{hint}</p>}
      <p className="sr-only">{wallLabel}</p>
      <ul className="sr-only">
        {members.map((member) => <li key={member}>{member}</li>)}
      </ul>
    </div>
  );
}
