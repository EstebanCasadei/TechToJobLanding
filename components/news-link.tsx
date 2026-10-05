"use client";

import { useRef } from "react";

export function NewsLink({ href, label, className = "text-ink" }: Readonly<{ href: string; label: string; className?: string }>) {
  const labelRef = useRef<HTMLSpanElement>(null);

  const animateUnderline = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    labelRef.current?.classList.add("is-animating");
  };

  return (
    <a
      href={href}
      className={`inline-flex min-h-11 items-center text-sm font-bold [overflow-wrap:anywhere] ${className}`}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") animateUnderline();
      }}
      onFocus={(event) => {
        if (event.currentTarget.matches(":focus-visible")) animateUnderline();
      }}
    >
      <span
        ref={labelRef}
        className="news-link-label"
        onAnimationEnd={(event) => event.currentTarget.classList.remove("is-animating")}
      >
        {label}
      </span>
    </a>
  );
}
