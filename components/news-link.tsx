"use client";

import { useRef, type FocusEvent, type PointerEvent } from "react";

type Props = { label: string; className?: string } & (
  { href: string; onClick?: never } | { href?: never; onClick: () => void }
);

export function NewsLink({ href, onClick, label, className = "text-ink" }: Readonly<Props>) {
  const labelRef = useRef<HTMLSpanElement>(null);

  const animateUnderline = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    labelRef.current?.classList.add("is-animating");
  };

  const interaction = {
      className: `inline-flex min-h-11 cursor-pointer items-center text-sm font-bold [overflow-wrap:anywhere] ${className}`,
      onPointerEnter: (event: PointerEvent<HTMLElement>) => {
        if (event.pointerType !== "touch") animateUnderline();
      },
      onFocus: (event: FocusEvent<HTMLElement>) => {
        if (event.currentTarget.matches(":focus-visible")) animateUnderline();
      },
  };
  const content = (
      <span
        ref={labelRef}
        className="news-link-label"
        onAnimationEnd={(event) => event.currentTarget.classList.remove("is-animating")}
      >
        {label}
      </span>
  );
  return onClick
    ? <button type="button" {...interaction} onClick={onClick} aria-haspopup="dialog">{content}</button>
    : <a href={href} {...interaction}>{content}</a>;
}
