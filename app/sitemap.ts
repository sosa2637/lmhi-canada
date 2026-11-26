
import type { MetadataRoute } from "next";
import { settings } from "@/lib/store";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.longlamarine.com";

const publicRoutes = [
  "a-propos",
  "direction",
  "maritime",
  "industrie-lourde",
  "signalisation",
  "securite",
  "remorquage",
  "main-doeuvre",
  "projets",
  "carrieres",
  "partenaires",
  "contact",
  "soumission",
  "confidentialite",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let customDivisions: string[] = [];

  try {
   customDivisions =
  (await settings()).divisions?.map((division: { slug: string }) => division.slug) || [];
  } catch {
    // Les divisions personnalisées restent facultatives.
  }

  const routes = [
    ...new Set([...publicRoutes, ...customDivisions]),
  ];

  const pages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/en`,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  for (const route of routes) {
    pages.push(
      {
        url: `${BASE_URL}/${route}`,
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/en/${route}`,
        changeFrequency: "monthly",
        priority: 0.8,
      },
    );
  }

  return pages;
}
