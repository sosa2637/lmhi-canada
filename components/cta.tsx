"use client";
export default function Cta({
  en,
  href,
  service,
}: {
  en: boolean;
  href: (r: string) => string;
  service?: string;
}) {
  return (
    <section className="cta-section">
      <div className="wrap">
        <div>
          <p className="eyebrow light">
            {en ? "LET’S MOVE FORWARD TOGETHER" : "AVANÇONS ENSEMBLE"}
          </p>
          <h2>
            {en ? "The next step starts here." : "La suite commence ici."}
          </h2>
          <p>
            {service
              ? en
                ? "Discuss your needs with our team."
                : "Discutez de votre besoin avec notre équipe."
              : en
                ? "A project, a technical need or a partnership?"
                : "Un projet, un besoin technique ou un partenariat ?"}
          </p>
        </div>
        <div className="cta-actions glass-panel">
          <a
            className="btn white"
            href={
              href("soumission") +
              (service ? "?service=" + encodeURIComponent(service) : "")
            }
          >
            {en ? "Request a quote" : "Demander une soumission"}
          </a>
          <a href={href("partenaires")} className="cta-partner">
            {en ? "Become a partner" : "Devenir partenaire"}
          </a>
        </div>
      </div>
    </section>
  );
}
