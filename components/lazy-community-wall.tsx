"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import type { CommunityWall } from "@/components/community-wall";

const Wall = dynamic(
  () => import("@/components/community-wall").then((module) => module.CommunityWall),
  { ssr: false },
);

type Props = ComponentProps<typeof CommunityWall>;

export function LazyCommunityWall(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || near) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [near]);

  return (
    <div ref={ref}>
      {near ? (
        <Wall {...props} />
      ) : (
        <div className="h-[clamp(24rem,60svh,34rem)] rounded-3xl border border-white/10" aria-hidden="true" />
      )}
    </div>
  );
}
