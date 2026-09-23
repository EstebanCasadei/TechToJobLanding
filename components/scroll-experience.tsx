"use client";

import { useEffect } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const DRIFT_TARGETS = [
  { selector: ".scene-card", drift: 26 },
  { selector: ".floating-avatar", drift: 48 },
] as const;

export function ScrollExperience() {
  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    let context: { revert(): void } | undefined;
    let cancelled = false;

    const init = () => {
      void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
        ([{ gsap }, { ScrollTrigger }]) => {
          if (cancelled) return;

          gsap.registerPlugin(ScrollTrigger);

          context = gsap.context(() => {
            for (const { selector, drift } of DRIFT_TARGETS) {
              gsap.utils.toArray<HTMLElement>(selector).forEach((element, index) => {
                const offset = Number(element.dataset.drift ?? drift) * (index % 2 ? -1 : 1);
                gsap.fromTo(
                  element,
                  { y: offset },
                  {
                    y: -offset,
                    ease: "none",
                    scrollTrigger: {
                      trigger: element,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: 0.8,
                    },
                  },
                );
              });
            }
          });
        },
      );
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    const idleId = idle(init);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
      context?.revert();
    };
  }, []);

  return null;
}
