"use client";

import { useEffect, useState, type ReactNode } from "react";

export function HeaderShell({ children }: Readonly<{ children: ReactNode }>) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      data-scrolled={scrolled || undefined}
      className="group h-[4.25rem] w-full transition-[padding] duration-300 motion-reduce:transition-none data-[scrolled]:pt-3 min-[50rem]:h-[5.25rem] min-[50rem]:data-[scrolled]:pt-4"
    >
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-b-[32px] border border-x-white/10 border-b-white/10 border-t-transparent bg-ink/70 shadow-[0_10px_36px_rgb(0_0_0/0.4)] backdrop-blur-xl transition-all duration-300 motion-reduce:transition-none group-data-[scrolled]:rounded-full group-data-[scrolled]:border-t-white/10 group-data-[scrolled]:bg-ink/85 group-data-[scrolled]:shadow-[0_10px_36px_rgb(0_0_0/0.4),inset_0_1px_0_rgb(255_255_255/0.07)]"
        />
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 py-2 pr-2 pl-4 min-[50rem]:gap-x-8 min-[50rem]:py-2.5 min-[50rem]:pr-2.5 min-[50rem]:pl-5">
          {children}
        </div>
      </div>
    </div>
  );
}
