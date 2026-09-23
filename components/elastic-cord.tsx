"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type Point = { x: number; y: number };
type Segment = { start: Point; end: Point };
type Offset = { x: number; y: number };

export const PIN_TIP_X = 8.38402 / 32;
export const PIN_TIP_Y = 29.9767 / 36;

function segmentPath({ start, end }: Segment, offset: Offset = { x: 0, y: 0 }) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const sag = Math.min(48, Math.max(24, Math.hypot(dx, dy) * 0.06));
  return `M${start.x} ${start.y} Q${start.x + dx / 2 + offset.x} ${start.y + dy / 2 + sag + offset.y} ${end.x} ${end.y}`;
}

export function ElasticCord() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const visibleRefs = useRef<(SVGPathElement | null)[]>([]);
  const hitRefs = useRef<(SVGPathElement | null)[]>([]);
  const restRefs = useRef<(SVGPathElement | null)[]>([]);
  const offsets = useRef<Offset[]>([{ x: 0, y: 0 }, { x: 0, y: 0 }]);
  const gsapRef = useRef<typeof import("gsap").gsap | null>(null);
  const [size, setSize] = useState({ width: 1, height: 1 });
  const [segments, setSegments] = useState<Segment[]>([]);

  const loadGsap = async () => {
    gsapRef.current ??= await import("gsap").then((module) => module.gsap).catch(() => null);
    return gsapRef.current;
  };

  const draw = (index: number) => {
    const segment = segments[index];
    if (!segment) return;
    const path = segmentPath(segment, offsets.current[index]);
    visibleRefs.current[index]?.setAttribute("d", path);
    hitRefs.current[index]?.setAttribute("d", path);
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const bounds = container.getBoundingClientRect();
      const pins = [...document.querySelectorAll<HTMLElement>("#how-it-works .step-pin")];
      if (pins.length !== 3 || bounds.width === 0 || bounds.height === 0) return;
      const points = pins.map((pin) => {
        const pinBounds = pin.getBoundingClientRect();
        return {
          x: pinBounds.left + pinBounds.width * PIN_TIP_X - bounds.left,
          y: pinBounds.top + pinBounds.height * PIN_TIP_Y - bounds.top,
        };
      });
      offsets.current = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
      setSize({ width: bounds.width, height: bounds.height });
      setSegments([
        { start: points[0], end: points[1] },
        { start: points[1], end: points[2] },
      ]);
    };

    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    document.fonts.ready.then(measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  useEffect(() => () => offsets.current.forEach((offset) => gsapRef.current?.killTweensOf(offset)), []);

  const onMove = (index: number, event: ReactPointerEvent<SVGPathElement>) => {
    const svg = svgRef.current;
    const rest = restRefs.current[index];
    const matrix = svg?.getScreenCTM();
    if (!svg || !rest || !matrix || event.pointerType === "touch") return;

    const pointer = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    const length = rest.getTotalLength();
    let closest = rest.getPointAtLength(0);
    let closestDistance = Number.POSITIVE_INFINITY;

    for (let position = 0; position <= length; position += length / 48) {
      const point = rest.getPointAtLength(position);
      const distance = Math.hypot(pointer.x - point.x, pointer.y - point.y);
      if (distance < closestDistance) {
        closest = point;
        closestDistance = distance;
      }
    }

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const limit = reduced ? 3 : 24;
    const distance = Math.max(1, Math.hypot(pointer.x - closest.x, pointer.y - closest.y));
    const scale = Math.min(limit, distance) / distance;
    offsets.current[index].x = (pointer.x - closest.x) * scale;
    offsets.current[index].y = (pointer.y - closest.y) * scale;
    draw(index);
    void loadGsap().then((gsap) => gsap?.killTweensOf(offsets.current[index]));
  };

  const onLeave = (index: number) => {
    void loadGsap().then((gsap) => {
      const offset = offsets.current[index];
      if (!gsap) {
        offset.x = 0;
        offset.y = 0;
        draw(index);
        return;
      }
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(offset, {
        x: 0,
        y: 0,
        duration: reduced ? 0.2 : 0.7,
        ease: reduced ? "power2.out" : "elastic.out(1, 0.2)",
        onUpdate: () => draw(index),
      });
    });
  };

  return (
    <div ref={containerRef} data-cord-overlay className="pointer-events-none absolute inset-0 z-30 block" aria-hidden="true">
      <svg ref={svgRef} className="size-full overflow-visible" viewBox={`0 0 ${size.width} ${size.height}`}>
        <defs>
          <filter id="cord-shadow" x="-4%" y="-4%" width="108%" height="108%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.12" />
          </filter>
        </defs>
        {segments.map((segment, index) => {
          const path = segmentPath(segment);
          return (
            <g key={index}>
              <path ref={(node) => { restRefs.current[index] = node; }} d={path} fill="none" stroke="none" pointerEvents="none" />
              <path ref={(node) => { visibleRefs.current[index] = node; }} d={path} className="cord-line fill-none stroke-primary stroke-[5]" vectorEffect="non-scaling-stroke" filter="url(#cord-shadow)" />
              <path ref={(node) => { hitRefs.current[index] = node; }} d={path} className="cord-hit-area cursor-default fill-none stroke-transparent stroke-[32] [pointer-events:stroke]" vectorEffect="non-scaling-stroke" onPointerMove={(event) => onMove(index, event)} onPointerLeave={() => onLeave(index)} onPointerOut={() => onLeave(index)} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
