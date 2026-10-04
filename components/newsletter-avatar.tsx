"use client";

import { Blobatar } from "@blobatar/react";
import { useGaze } from "@blobatar/react/gaze";
import { idle, surprised } from "blobatar/expression";
import { useEffect, useRef, useState, type ReactNode } from "react";
import "blobatar/gaze.css";

export function NewsletterAvatar({ children }: Readonly<{ children: ReactNode }>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const { ref, lookAt } = useGaze({ travel: 3 });

  useEffect(() => {
    const input = containerRef.current?.querySelector("input");
    if (!input) return;

    const context = document.createElement("canvas").getContext("2d");
    let caret = input.value.length;
    let previousValue = input.value;
    let frame = 0;

    const measureText = (text: string) => {
      const style = getComputedStyle(input);
      if (!context) return 0;
      context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      return context.measureText(text).width;
    };

    const aimAtCaret = () => {
      if (document.activeElement !== input) return;
      const style = getComputedStyle(input);
      const bounds = input.getBoundingClientRect();
      const left = bounds.left + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft);
      const right = bounds.right - parseFloat(style.paddingRight);
      // Email inputs do not expose selectionStart in most browsers.
      const position = input.selectionStart ?? caret;
      lookAt({
        x: Math.max(left, Math.min(right, left + measureText(input.value.slice(0, position)) - input.scrollLeft)),
        y: bounds.top + bounds.height / 2,
      });
    };

    const scheduleAim = () => {
      if (document.activeElement !== input) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(aimAtCaret);
    };

    const onFocus = () => {
      caret = input.value.length;
      previousValue = input.value;
      setFocused(true);
      scheduleAim();
    };

    const onBlur = () => {
      cancelAnimationFrame(frame);
      setFocused(false);
      lookAt("pointer");
    };

    const onInput = () => {
      const value = input.value;
      let prefix = 0;
      while (prefix < Math.min(previousValue.length, value.length)
        && previousValue[prefix] === value[prefix]) prefix += 1;
      let suffix = 0;
      while (suffix < Math.min(previousValue.length, value.length) - prefix
        && previousValue[previousValue.length - 1 - suffix] === value[value.length - 1 - suffix]) suffix += 1;
      caret = value.length - suffix;
      previousValue = value;
      scheduleAim();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") caret = Math.max(0, caret - 1);
      if (event.key === "ArrowRight") caret = Math.min(input.value.length, caret + 1);
      if (event.key === "Home" || (event.metaKey && event.key === "ArrowLeft")) caret = 0;
      if (event.key === "End" || (event.metaKey && event.key === "ArrowRight")) caret = input.value.length;
      scheduleAim();
    };

    const onPointerUp = (event: PointerEvent) => {
      const bounds = input.getBoundingClientRect();
      const style = getComputedStyle(input);
      const offset = event.clientX - bounds.left - parseFloat(style.paddingLeft) + input.scrollLeft;
      let start = 0;
      let end = input.value.length;
      while (start < end) {
        const middle = Math.floor((start + end) / 2);
        if (measureText(input.value.slice(0, middle)) < offset) start = middle + 1;
        else end = middle;
      }
      caret = start;
      scheduleAim();
    };

    lookAt("pointer");
    input.addEventListener("focus", onFocus);
    input.addEventListener("blur", onBlur);
    input.addEventListener("input", onInput);
    input.addEventListener("keydown", onKeyDown);
    input.addEventListener("pointerup", onPointerUp);
    input.addEventListener("scroll", scheduleAim);
    window.addEventListener("resize", scheduleAim);
    window.addEventListener("scroll", scheduleAim, true);
    if (document.activeElement === input) onFocus();

    return () => {
      cancelAnimationFrame(frame);
      input.removeEventListener("focus", onFocus);
      input.removeEventListener("blur", onBlur);
      input.removeEventListener("input", onInput);
      input.removeEventListener("keydown", onKeyDown);
      input.removeEventListener("pointerup", onPointerUp);
      input.removeEventListener("scroll", scheduleAim);
      window.removeEventListener("resize", scheduleAim);
      window.removeEventListener("scroll", scheduleAim, true);
    };
  }, [lookAt]);

  return (
    <div ref={containerRef} className="relative isolate mt-14">
      <Blobatar
        ref={ref}
        name="TechToJob newsletter"
        size={112}
        animate="always"
        expression={focused ? surprised : idle}
        className="pointer-events-none absolute -top-30 left-2/3 -z-10 size-48 -translate-x-1/2"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
