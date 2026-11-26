
import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LMHI Canada | Soudage industriel, fabrication et maintenance",
    template: "%s | LMHI Canada",
  },
  description:
    "Longla Marine & Heavy Industries Canada, basée à Québec : soudage industriel, fabrication métallique et maintenance d’équipements industriels et maritimes pour des projets partout au Canada.",
  robots: {
    index: process.env.SITE_INDEXABLE !== "false",
    follow: process.env.SITE_INDEXABLE !== "false",
  },
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") === "en" ? "en" : "fr";

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
