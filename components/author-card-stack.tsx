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
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      stackRef.current?.style.setProperty("--card-mouse-x", `${x * 4}px`);
      stackRef.current?.style.setProperty("--card-mouse-y", `${y * 3}px`);
    });
  };

  return (
    <div ref={stackRef} onPointerMove={followPointer}
      onPointerEnter={() => { pointerRef.current = true; requestExpansion(); }}
      onPointerLeave={() => { pointerRef.current = false; reset(); requestExpansion(); }}
      onPointerCancel={() => { pointerRef.current = false; reset(); requestExpansion(); }}
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
