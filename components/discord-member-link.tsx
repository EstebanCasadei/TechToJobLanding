"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { AnimatedButtonLabel } from "@/components/animated-button-label";
import { site } from "@/lib/site";

let memberCount = 500;
let requested = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!requested) {
    requested = true;
    void fetch("https://discord.com/api/v10/invites/h9FFgKdkRd?with_counts=true", {
      signal: AbortSignal.timeout(8000),
      credentials: "omit",
    }).then(async (response) => {
      if (!response.ok) return;
      const data: unknown = await response.json();
      if (!data || typeof data !== "object" || !("approximate_member_count" in data)) return;
      const count = data.approximate_member_count;
      if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0) return;
      const step = count < 1000 ? 10 : 100;
      memberCount = Math.floor(count / step) * step;
      listeners.forEach((notify) => notify());
    }).catch(() => {
      // Keep the approved fallback when Discord is unavailable or rate limited.
    });
  }
  return () => { listeners.delete(listener); };
}

export function DiscordMemberLink({ children, className, label, countLabel, animated = false }: Readonly<{
  children: ReactNode;
  className: string;
  label: string;
  countLabel: string;
  animated?: boolean;
}>) {
  const count = useSyncExternalStore(subscribe, () => memberCount, () => 500);
  const text = countLabel.replace("{count}", String(count));

  return (
    <a className={className} href={site.discord} aria-label={label.replace("{count}", String(count))}>
      {children}
      {animated ? <AnimatedButtonLabel text={text} /> : <span>{text}</span>}
    </a>
  );
}
