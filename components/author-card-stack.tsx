"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

export function AuthorCardStack({ children }: Readonly<{ children: ReactNode }>) {
  const stackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expandedRef = useRef(false);
  const desiredRef = useRef(false);
  const pointerRef = useRef(false);
  const focusRef = useRef(false);
  const targetRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });

  const easePointer = () => {
    if (frameRef.current) return;
    let previousTime = 0;
    const tick = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 32) : 16;
      previousTime = time;
      const amount = 1 - Math.exp(-elapsed / 140);
      const position = positionRef.current;
      const target = targetRef.current;
      position.x += (target.x - position.x) * amount;
      position.y += (target.y - position.y) * amount;
      const settled = Math.abs(target.x - position.x) < .01 && Math.abs(target.y - position.y) < .01;
      if (settled) { position.x = target.x; position.y = target.y; }
      stackRef.current?.style.setProperty("--card-mouse-x", `${position.x}px`);
      stackRef.current?.style.setProperty("--card-mouse-y", `${position.y}px`);
      frameRef.current = settled ? 0 : requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  const returnToCenter = () => {
    targetRef.current = { x: 0, y: 0 };
    easePointer();
  };

  const requestExpansion = () => {
    desiredRef.current = pointerRef.current || focusRef.current;
    const run = () => {
      if (transitionRef.current || expandedRef.current === desiredRef.current) return;
      expandedRef.current = desiredRef.current;
      stackRef.current?.setAttribute("data-expanded", String(expandedRef.current));
      transitionRef.current = setTimeout(() => {
        transitionRef.current = null;
        run();
      }, 470);
    };
    run();
  };

  const reset = () => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    targetRef.current = { x: 0, y: 0 };
    positionRef.current = { x: 0, y: 0 };
    stackRef.current?.style.setProperty("--card-mouse-x", "0px");
    stackRef.current?.style.setProperty("--card-mouse-y", "0px");
  };

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    motion.addEventListener("change", reset);
    return () => {
      motion.removeEventListener("change", reset);
      cancelAnimationFrame(frameRef.current);
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, []);

  const followPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse"
      || !window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    // Fade movement in at the boundary so grazing a corner cannot jerk a card.
    const distance = Math.min(event.clientX - bounds.left, bounds.right - event.clientX,
      event.clientY - bounds.top, bounds.bottom - event.clientY);
    const edge = Math.max(0, Math.min(1, distance / 48));
    const strength = edge * edge * (3 - 2 * edge);
    targetRef.current = { x: x * 3 * strength, y: y * 2 * strength };
    easePointer();
  };

  return (
    <div ref={stackRef} onPointerMove={followPointer}
      onPointerEnter={() => { pointerRef.current = true; requestExpansion(); }}
      onPointerLeave={() => { pointerRef.current = false; returnToCenter(); requestExpansion(); }}
      onPointerCancel={() => { pointerRef.current = false; returnToCenter(); requestExpansion(); }}
      onFocusCapture={() => { focusRef.current = true; requestExpansion(); }}
      onBlurCapture={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        focusRef.current = false;
        requestExpansion();
      }}
      className="author-card-stack relative mx-auto mt-14 flex w-full max-w-[39rem] flex-col px-4 py-12 min-[64rem]:mt-0" aria-labelledby="author-heading">
      {children}
    </div>
  );
}
