
export const dynamic = "force-dynamic";

import Site from "@/components/site";
import { settings } from "@/lib/store";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const BASE_URL = "https://www.longlamarine.com";

const routes = [
  "accueil",
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
  "gestion",
];

const seo: Record<
  string,
  { fr: { title: string; description: string }; en: { title: string; description: string } }
> = {
  "a-propos": {
    fr: {
      title: "À propos de LMHI Canada | Entreprise industrielle",
      description:
        "Découvrez Longla Marine & Heavy Industries Canada, entreprise basée à Québec spécialisée en fabrication métallique, soudage industriel et maintenance.",
    },
    en: {
      title: "About LMHI Canada | Industrial and Marine Services",
      description:
        "Discover Longla Marine & Heavy Industries Canada, a Quebec-based company specializing in metal fabrication, industrial welding and maintenance.",
    },
  },
  direction: {
    fr: {
      title: "Notre direction | LMHI Canada",
      description:
        "Découvrez la direction et la vision de Longla Marine & Heavy Industries Canada.",
    },
    en: {
      title: "Our Leadership | LMHI Canada",
      description:
        "Meet the leadership and vision behind Longla Marine & Heavy Industries Canada.",
    },
  },
  maritime: {
    fr: {
      title: "Services maritimes au Canada | LMHI Canada",
      description:
        "Découvrez nos services maritimes : maintenance navale, réparation de navires, soudage maritime et soutien technique aux installations maritimes.",
    },
    en: {
      title: "Marine Services in Canada | LMHI Canada",
      description:
        "Explore marine maintenance, vessel repair, marine welding and technical support for marine facilities across Canada.",
    },
  },
  "industrie-lourde": {
    fr: {
      title: "Industrie lourde et soudage industriel | LMHI Canada",
      description:
        "Soudage industriel, fabrication métallique, assemblage mécanique et maintenance d'équipements pour les projets industriels au Canada.",
    },
    en: {
      title: "Heavy Industry and Industrial Welding | LMHI Canada",
      description:
        "Industrial welding, metal fabrication, mechanical assembly and equipment maintenance for projects across Canada.",
    },
  },
  signalisation: {
    fr: {
      title: "Signalisation routière | LMHI Canada",
      description:
        "Découvrez les services de signalisation routière et de soutien à la sécurisation des zones de travaux de LMHI Canada.",
    },
    en: {
      title: "Road Traffic Control | LMHI Canada",
      description:
        "Discover LMHI Canada's road work traffic control and work zone safety support services.",
    },
  },
  securite: {
    fr: {
      title: "Sécurité privée | LMHI Canada",
      description:
        "Découvrez le développement de la division sécurité privée de LMHI Canada, sous réserve des permis et licences applicables.",
    },
    en: {
      title: "Private Security | LMHI Canada",
      description:
        "Learn about LMHI Canada's developing private security division, subject to applicable permits and licences.",
    },
  },
  remorquage: {
    fr: {
      title: "Remorquage terrestre | LMHI Canada",
      description:
        "Découvrez le développement des services d'assistance aux véhicules commerciaux et équipements lourds de LMHI Canada.",
    },
    en: {
      title: "Heavy Vehicle Assistance | LMHI Canada",
      description:
        "Learn about LMHI Canada's developing commercial vehicle and heavy equipment assistance capabilities.",
    },
  },
  "main-doeuvre": {
    fr: {
      title: "Main-d’œuvre spécialisée | LMHI Canada",
      description:
        "Mobilisation de soudeurs, mécaniciens et personnel spécialisé pour les projets maritimes et industriels au Canada.",
    },
    en: {
      title: "Skilled Workforce | LMHI Canada",
      description:
        "Skilled welders, mechanics and specialized personnel for marine and industrial projects across Canada.",
    },
  },
  projets: {
    fr: {
      title: "Projets et actualités | LMHI Canada",
      description:
        "Consultez les projets, actualités et développements de Longla Marine & Heavy Industries Canada.",
    },
    en: {
      title: "Projects and News | LMHI Canada",
      description:
        "Explore projects, company news and developments from Longla Marine & Heavy Industries Canada.",
    },
  },
  carrieres: {
    fr: {
      title: "Carrières | Rejoindre LMHI Canada",
      description:
        "Découvrez les possibilités de carrière et les occasions de collaboration avec Longla Marine & Heavy Industries Canada.",
    },
    en: {
      title: "Careers | Join LMHI Canada",
      description:
        "Explore career opportunities and ways to work with Longla Marine & Heavy Industries Canada.",
    },
  },
  partenaires: {
    fr: {
      title: "Partenaires et fournisseurs | LMHI Canada",
      description:
        "Développez des relations d'affaires avec LMHI Canada dans les secteurs maritime, industriel et des infrastructures.",
    },
    en: {
      title: "Partners and Suppliers | LMHI Canada",
      description:
        "Build business relationships with LMHI Canada across marine, industrial and infrastructure sectors.",
    },
  },
  contact: {
    fr: {
      title: "Contacter LMHI Canada | Québec",
      description:
        "Contactez Longla Marine & Heavy Industries Canada pour discuter de vos besoins en soudage, fabrication métallique et maintenance.",
    },
    en: {
      title: "Contact LMHI Canada | Quebec",
      description:
        "Contact Longla Marine & Heavy Industries Canada to discuss welding, metal fabrication and maintenance requirements.",
    },
  },
  soumission: {
    fr: {
      title: "Demander une soumission | LMHI Canada",
      description:
        "Présentez votre projet à LMHI Canada et demandez une soumission pour vos besoins industriels et maritimes.",
    },
    en: {
      title: "Request a Quote | LMHI Canada",
      description:
        "Tell LMHI Canada about your project and request a quote for marine and industrial services.",
    },
  },
  confidentialite: {
    fr: {
      title: "Politique de confidentialité | LMHI Canada",
      description:
        "Consultez la politique de confidentialité de Longla Marine & Heavy Industries Canada.",
    },
    en: {
      title: "Privacy Policy | LMHI Canada",
      description:
        "Read the privacy policy of Longla Marine & Heavy Industries Canada.",
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const en = slug[0] === "en";
  const route = slug[en ? 1 : 0] || "accueil";

  const page = seo[route];

  const title =
    page?.[en ? "en" : "fr"].title ||
    (en ? "LMHI Canada | Marine and Heavy Industry" : "LMHI Canada");

  const description =
    page?.[en ? "en" : "fr"].description ||
    (en
      ? "Marine services, industrial welding, metal fabrication and equipment maintenance across Canada."
      : "Services maritimes, soudage industriel, fabrication métallique et maintenance d'équipements partout au Canada.");

  const path = slug.join("/");
  const canonical = path
    ? `${BASE_URL}/${path}`
    : BASE_URL;

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "LMHI Canada",
      type: "website",
      locale: en ? "en_CA" : "fr_CA",
    },
  };

  if (route === "gestion") {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
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
  ) {
    notFound();
  }

  return <Site route={route} lang={en ? "en" : "fr"} />;
}
