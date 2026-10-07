import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "LMHI Canada | Soudage industriel, fabrication et maintenance",
    template: "%s | LMHI Canada",
  },
  description:
    "Longla Marine & Heavy Industries Canada, basée à Québec : soudage industriel, fabrication métallique et maintenance d’équipements industriels et maritimes pour des projets partout au Canada.",
  robots: {
    index: process.env.SITE_INDEXABLE === "true",
    follow: process.env.SITE_INDEXABLE === "true",
  },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
