export type SocialNetwork = "discord" | "linkedin" | "instagram" | "x" | "tiktok";

// Compact brand marks drawn as vectors; decorative inside named links.
export function SocialIcon({ network }: Readonly<{ network: SocialNetwork }>) {
  if (network === "discord") {
    return <span aria-hidden="true" className="size-6 bg-current [mask:url('/images/discord-light.svg')_center/contain_no-repeat]" />;
  }

  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden="true">
      {network === "linkedin" && <>
        <rect x="2" y="9" width="4" height="13" rx=".5" />
        <circle cx="4" cy="4.5" r="2.2" />
        <path d="M9 9h4v1.8c1-1.5 2.3-2.1 4-2.1 3.4 0 5 2.1 5 6.1V22h-4v-6.6c0-2.1-.6-3.1-2.1-3.1-1.8 0-2.9 1.2-2.9 3.5V22H9Z" />
      </>}
      {network === "instagram" && <>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.2" />
      </>}
      {network === "x" && <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-7.4L5.4 22H2.2l8.2-9.5L1 2h6.4l4.4 6.7ZM17.9 20h1.7L6.3 4H4.5Z" />}
      {network === "tiktok" && <path d="M14 2h3c.3 2.8 1.8 4.5 4 4.9V10a9 9 0 0 1-4-1.6V16a6 6 0 1 1-6-6v3a3 3 0 1 0 3 3Z" />}
    </svg>
  );
}
