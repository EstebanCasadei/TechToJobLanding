export const author = {
  name: "Esteban Casadei",
  linkedin: "https://www.linkedin.com/in/esteban-casadei-087553357/",
} as const;

export const site = {
  name: "TechToJob",
  discord: "https://discord.gg/h9FFgKdkRd",
  linkedin: "https://www.linkedin.com/company/techtojob/",
  x: "https://x.com/techtojob",
  instagram: "https://www.instagram.com/techtojob",
  tiktok: "https://www.tiktok.com/@techtojob",
} as const;

const deploymentUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const siteUrl = deploymentUrl.replace(/\/+$/, "");
