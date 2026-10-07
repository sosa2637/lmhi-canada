"use client";
import { type Settings } from "@/app/content";
import { Download } from "lucide-react";
export default function Brochures({
  settings,
  en,
}: {
  settings: Settings;
  en: boolean;
}) {
  return settings.brochures?.length ? (
    <section className="section wrap">
      <p className="eyebrow">{en ? "DOCUMENTS" : "DOCUMENTATION"}</p>
      <h2>
        {en ? "Explore our documentation." : "Consultez notre documentation."}
      </h2>
      <div className="brochures">
        {settings.brochures.map((b) => (
          <a key={b.url} className="btn pale" href={b.url}>
            <Download size={18} />
            {b.name}
          </a>
        ))}
      </div>
    </section>
  ) : null;
}
