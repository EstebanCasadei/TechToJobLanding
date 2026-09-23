"use client";

import { useEffect } from "react";
import { PIN_TIP_X, PIN_TIP_Y } from "@/components/elastic-cord";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const SWING_DEGREES = 1;

export function CardSwing() {
  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    let cancelled = false;
    const removers: (() => void)[] = [];

    void import("gsap").then(({ gsap }) => {
      if (cancelled) return;

      document.querySelectorAll<HTMLElement>("[data-swing-card]").forEach((card) => {
        const restRotation = Number(gsap.getProperty(card, "rotation")) || 0;
        const pin =
          card.querySelector<HTMLElement>("[data-swing-pin]") ??
          card.parentElement?.querySelector<HTMLElement>("[data-swing-pin]");
        const pinInCard = pin && card.contains(pin) ? pin : null;
        if (pinInCard) {
          gsap.set(pinInCard, { transformOrigin: `${PIN_TIP_X * 100}% ${PIN_TIP_Y * 100}%` });
        }
        const syncPin = pinInCard
          ? () =>
              gsap.set(pinInCard, {
                rotation: restRotation - Number(gsap.getProperty(card, "rotation")),
              })
          : undefined;

        const onEnter = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;

          const origin = event.relatedTarget;
          if (
            origin instanceof Element &&
            (origin.closest("[data-cord-overlay]") || origin.closest("[data-swing-pin]"))
          ) {
            return;
          }

          const cardRect = card.getBoundingClientRect();
          const centerX = cardRect.width / 2;
          const centerY = cardRect.height / 2;
          let tipX = cardRect.left + centerX;
          let tipY = cardRect.top;

          if (pin) {
            const pinRect = pin.getBoundingClientRect();
            tipX = pinRect.left + pinRect.width * PIN_TIP_X;
            tipY = pinRect.top + pinRect.height * PIN_TIP_Y;
          }

          // Convert the pin tip into the card's local space by unrotating the
          // screen-space offset around the card center (which is pivot-invariant).
          const rad = (restRotation * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          const px = tipX - (cardRect.left + centerX);
          const py = tipY - (cardRect.top + centerY);
          const originX = centerX + px * cos + py * sin;
          const originY = centerY + (-px * sin + py * cos);

          // Rotating at the resting angle around the pin instead of the center
          // shifts the card; translate by (I - R)(C - P) so the resting pose is
          // visually identical to the untouched card.
          const dx = centerX - originX;
          const dy = centerY - originY;
          const shiftX = dx - (dx * cos - dy * sin);
          const shiftY = dy - (dx * sin + dy * cos);

          const side = event.clientX < tipX ? -1 : 1;

          gsap.killTweensOf(card);
          gsap.set(card, { transformOrigin: `${originX}px ${originY}px`, x: shiftX, y: shiftY });
          gsap
            .timeline({ overwrite: "auto", onUpdate: syncPin })
            .to(card, { rotation: restRotation + side * SWING_DEGREES, duration: 0.22, ease: "power2.out" })
            .to(card, { rotation: restRotation, duration: 2.8, ease: "elastic.out(0.7, 0.55)" });
        };

        card.addEventListener("pointerenter", onEnter);
        removers.push(() => {
          card.removeEventListener("pointerenter", onEnter);
          gsap.killTweensOf(card);
          if (pinInCard) gsap.set(pinInCard, { rotation: 0 });
        });
      });
    });

    return () => {
      cancelled = true;
      removers.forEach((remove) => remove());
    };
  }, []);

  return null;
}
