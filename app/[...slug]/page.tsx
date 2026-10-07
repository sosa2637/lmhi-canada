export const dynamic = "force-dynamic";
import Site from "@/components/site";
import { settings } from "@/lib/store";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
const routes = [
  "accueil",
  "a-propos",
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
  "gestion",
];
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const en = slug[0] === "en";
  const route = slug[en ? 1 : 0] || "accueil";
  const titles: Record<string, string> = {
    "a-propos": "À propos",
    maritime: "Maritime",
    "industrie-lourde": "Industrie lourde",
    signalisation: "Signalisation",
    securite: "Sécurité privée",
    remorquage: "Remorquage",
    "main-doeuvre": "Main-d’œuvre",
    projets: "Projets et actualités",
    carrieres: "Carrières",
    partenaires: "Partenaires et fournisseurs",
    contact: "Nous contacter",
    soumission: "Demander une soumission",
    confidentialite: "Confidentialité",
    gestion: "Gestion LMHI",
  };
  return {
    title: en ? route.replaceAll("-", " ") : titles[route] || "LMHI Canada",
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const en = slug[0] === "en";
  const route = slug[en ? 1 : 0] || "accueil";
  let custom: string[] = [];
  try {
    custom =
      (await settings()).divisions?.map((d: { slug: string }) => d.slug) || [];
  } catch {}
  if (
    slug.length > (en ? 2 : 1) ||
    (!routes.includes(route) && !custom.includes(route))
  )
    notFound();
  return <Site route={route} lang={en ? "en" : "fr"} />;
}
