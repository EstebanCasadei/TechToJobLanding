"use client";

import { useEffect, useId, useRef } from "react";
import { NewsLink } from "@/components/news-link";

export function LegalModal({ title, notice, description, sections, closeLabel }: Readonly<{
  title: string;
  notice: string;
  description: string;
  sections: ReadonlyArray<{ title: string; description: string }>;
  closeLabel: string;
}>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const scrollPosition = useRef<string | null>(null);

  useEffect(() => () => {
    if (scrollPosition.current !== null) document.body.style.overflow = scrollPosition.current;
  }, []);

  const open = () => {
    dialogRef.current?.showModal();
    scrollPosition.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  };
  const restore = () => {
    if (scrollPosition.current !== null) {
      document.body.style.overflow = scrollPosition.current;
      scrollPosition.current = null;
    }
    triggerRef.current?.querySelector("button")?.focus({ preventScroll: true });
  };
  const close = () => {
    dialogRef.current?.close();
    restore();
  };

  return (
    <div ref={triggerRef}>
      <NewsLink label={title} onClick={open} className="text-white/85 hover:text-primary transition-colors" />
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClose={restore}
        onCancel={(event) => { event.preventDefault(); close(); }}
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            // The close button is the only interactive control in this placeholder.
            event.preventDefault();
            event.currentTarget.querySelector("button")?.focus();
          }
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right
            || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
        }}
        className="fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-2xl overflow-y-auto rounded-2xl bg-slate p-0 text-white shadow-card backdrop:bg-black/75"
      >
        <div className="p-6 min-[36rem]:p-10">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-[-.025em]">{title}</h2>
            <button type="button" onClick={close} aria-label={closeLabel} className="-mt-2 -mr-2 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-primary hover:text-ink">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <p className="mt-6 rounded-xl bg-primary p-4 text-sm font-bold leading-relaxed text-ink">{notice}</p>
          <p id={descriptionId} className="mt-6 text-base leading-relaxed text-white/85">{description}</p>
          <div className="mt-8 grid gap-6">
            {sections.map((section) => <section key={section.title} className="border-t border-white/15 pt-5"><h3 className="text-lg font-bold text-primary">{section.title}</h3><p className="mt-2 text-sm leading-relaxed text-white/85">{section.description}</p></section>)}
          </div>
        </div>
      </dialog>
    </div>
  );
}
