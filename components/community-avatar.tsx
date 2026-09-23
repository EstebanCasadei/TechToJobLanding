import { Blobatar } from "@blobatar/react";

export function CommunityAvatar({ name, size = 48, className }: Readonly<{ name: string; size?: number; className?: string }>) {
  return <Blobatar name={name} size={size} animate="hover" className={className} aria-hidden="true" />;
}
