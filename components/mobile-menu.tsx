"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const DESKTOP_QUERY = "(min-width: 64rem)";

export function MobileMenu({ label, children }: Readonly<{ label: string; children: ReactNode }>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const close = () => setOpen(false);
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative flex items-center min-[64rem]:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={label}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg"
      >
        <span aria-hidden="true" className="relative block h-3.5 w-5">
          <span
            className={`absolute inset-x-0 top-0 h-0.5 rounded-full bg-current transition-transform duration-200 motion-reduce:transition-none ${open ? "translate-y-[0.375rem] rotate-45" : ""}`}
          />
          <span
            className={`absolute inset-x-0 top-[0.375rem] h-0.5 rounded-full bg-current transition-opacity duration-200 motion-reduce:transition-none ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`absolute inset-x-0 top-[0.75rem] h-0.5 rounded-full bg-current transition-transform duration-200 motion-reduce:transition-none ${open ? "-translate-y-[0.375rem] -rotate-45" : ""}`}
          />
        </span>
      </button>
      <div
        id="mobile-navigation"
        inert={!open}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) setOpen(false);
        }}
        className={`absolute top-[calc(100%+0.5rem)] right-0 z-20 rounded-lg border border-[rgb(255_255_255/14%)] bg-ink p-3 shadow-card transition duration-200 motion-reduce:transition-none ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}
      >
        {children}
      </div>
    </div>
  );
}
