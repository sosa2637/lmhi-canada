"use client";
import { type Settings } from "@/app/content";
export default function Network({
  settings,
  en,
}: {
  settings: Settings;
  en: boolean;
}) {
  const authorized = settings.associations?.filter((x) => x.authorized);
  return (
    <div className="network-copy">
      {authorized?.length ? (
        <div className="association-list">
          {authorized.map((a) => (
            <a
              key={a.name}
              href={/^https:\/\//.test(a.url) ? a.url : undefined}
              rel="noreferrer"
              target="_blank"
            >
              {a.name}
            </a>
          ))}
        </div>
      ) : (
        <p>
          {en
            ? "Associations, certifications and accreditations will be presented as their public use is authorized."
            : "Les associations, certifications et accréditations seront présentées à mesure que leur publication sera autorisée."}
        </p>
      )}
      <span>
        {en
          ? "Only approved affiliations are displayed."
          : "Seules les affiliations validées sont affichées."}
      </span>
    </div>
  );
}
