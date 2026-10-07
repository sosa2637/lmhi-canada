"use client";
import { type Division } from "@/app/content";
import { uploadFile } from "@/lib/upload-client";
import { Check, FileText, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
export default function RequestForm({
  kind,
  en,
  divisions,
}: {
  kind: string;
  en: boolean;
  divisions: Division[];
}) {
  const t = (f: string, e: string) => (en ? e : f);
  const [token, setToken] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState(""),
    [trade, setTrade] = useState("");
  useEffect(() => {
    fetch("/api/form-token")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((x: any) => setToken(x.token))
      .catch(() =>
        setError(
          t(
            "Le formulaire est momentanément indisponible. Réessayez plus tard.",
            "This form is temporarily unavailable. Please try again later.",
          ),
        ),
      );
    const handler = (e: Event) => setTrade((e as CustomEvent).detail);
    window.addEventListener("selectJob", handler);
    return () => window.removeEventListener("selectJob", handler);
  }, [kind, en]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const f = new FormData(form);
    const files = f.getAll("files").filter((x) => x instanceof File && x.size);
    if (
      files.length > 3 ||
      files.some((x) => (x as File).size > 10 * 1024 * 1024) ||
      files.reduce((s, x) => s + (x as File).size, 0) > 15 * 1024 * 1024
    ) {
      setError(
        t(
          "Maximum 3 fichiers, 10 Mo par fichier et 15 Mo au total.",
          "Maximum 3 files, 10 MB per file and 15 MB total.",
        ),
      );
      return;
    }
    setBusy(true);
    try {
      f.set("kind", kind);
      f.set("token", token);
      const attached = [];
      for (const file of files)
        attached.push(await uploadFile(file as File, token));
      f.delete("files");
      f.set("attachments", JSON.stringify(attached));
      const r = await fetch("/api/submissions", { method: "POST", body: f });
      const x: any = await r.json();
      if (!r.ok)
        throw new Error(
          en
            ? "Your request could not be saved. Check the fields, attachments and form expiry; then try again."
            : x.error,
        );
      setDone(x.id);
      form.reset();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : t(
              "Connexion interrompue. Veuillez réessayer.",
              "Connection interrupted. Please try again.",
            ),
      );
    } finally {
      setBusy(false);
    }
  }
  const field = (
    name: string,
    label: string,
    type = "text",
    required = true,
    wide = false,
  ) => (
    <label key={name} className={wide ? "wide" : ""}>
      <span>
        {label}
        {required && " *"}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        maxLength={type === "email" ? 254 : 200}
      />
    </label>
  );
  if (done)
    return (
      <div className="form-success" role="status">
        <span>
          <Check size={30} />
        </span>
        <h2>
          {t("Votre demande est enregistrée.", "Your request has been saved.")}
        </h2>
        <p>
          {t(
            "Elle est disponible pour traitement dans l’espace LMHI.",
            "It is available for review in the LMHI workspace.",
          )}
        </p>
        <p className="secondary">
          {t("Référence :", "Reference:")} {done.slice(0, 8).toUpperCase()}
        </p>
        <button
          className="btn dark"
          onClick={() => {
            setDone("");
            fetch("/api/form-token")
              .then((r) => r.json())
              .then((x: any) => setToken(x.token));
          }}
        >
          {t("Envoyer une autre demande", "Send another request")}
        </button>
      </div>
    );
  return (
    <form onSubmit={submit} className="request-form">
      <div className="form-title">
        <h3>
          {kind === "career"
            ? t(
                "Candidature spontanée ou à un poste",
                "Unsolicited or job application",
              )
            : kind === "partner"
              ? t("Proposition de collaboration", "Collaboration proposal")
              : kind === "quote"
                ? t("Demande de soumission", "Quote request")
                : t("Votre message", "Your message")}
        </h3>
        <span>{t("* Champs obligatoires", "* Required fields")}</span>
      </div>
      <div className="fields">
        {["quote", "partner"].includes(kind) &&
          field(
            "company",
            t("Nom de l’entreprise", "Company name"),
            "text",
            true,
            true,
          )}
        {kind === "career" ? (
          <>
            {field("firstName", t("Prénom", "First name"))}
            {field("lastName", t("Nom", "Last name"))}
          </>
        ) : (
          field(
            "contact",
            t("Personne-ressource", "Contact person"),
            "text",
            true,
            true,
          )
        )}
        {field("email", t("Courriel", "Email"), "email")}
        {field("phone", t("Téléphone", "Phone"), "tel", kind !== "contact")}
        {kind === "quote" && (
          <>
            <label className="wide">
              <span>
                {t("Type de service recherché", "Service required")} *
              </span>
              <select
                name="service"
                required
                defaultValue={
                  typeof window === "undefined"
                    ? ""
                    : new URLSearchParams(window.location.search).get(
                        "service",
                      ) || ""
                }
              >
                <option value="">
                  {t("Choisir une division", "Select a division")}
                </option>
                {divisions.map((d) => (
                  <option key={d.slug}>{d.name[en ? 1 : 0]}</option>
                ))}
                <option>
                  {t(
                    "Plusieurs divisions / autre besoin",
                    "Several divisions / other need",
                  )}
                </option>
              </select>
            </label>
            {field("location", t("Lieu du projet", "Project location"))}
            {field(
              "date",
              t("Date prévue des travaux", "Expected start date"),
              "date",
            )}
          </>
        )}
        {kind === "career" && (
          <>
            <label>
              <span>{t("Métier / spécialité", "Trade / specialty")} *</span>
              <input
                name="trade"
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                required
                maxLength={200}
              />
            </label>
            <label>
              <span>{t("Années d’expérience", "Years of experience")} *</span>
              <input
                name="experience"
                type="number"
                min="0"
                max="70"
                step="0.5"
                required
              />
            </label>
            {field("location", t("Ville / province", "City / province"))}
            {field("availability", t("Disponibilité", "Availability"))}
            <label className="wide">
              <span>
                {t("Informations complémentaires", "Additional information")}
              </span>
              <textarea name="description" rows={4} maxLength={6000} />
            </label>
          </>
        )}
        {kind === "partner" && (
          <>
            {field("location", t("Pays / province", "Country / province"))}
            {field("url", t("Site Web", "Website"), "url", false)}
          </>
        )}
        {kind !== "career" && (
          <label className="wide">
            <span>
              {kind === "partner"
                ? t(
                    "Services ou produits proposés",
                    "Services or products offered",
                  )
                : kind === "quote"
                  ? t("Description du projet", "Project description")
                  : t("Votre message", "Your message")}{" "}
              *
            </span>
            <textarea name="description" rows={5} required maxLength={6000} />
          </label>
        )}
        <label className="wide upload">
          <FileText size={22} />
          <span>
            {kind === "career"
              ? t("Joindre un CV (facultatif)", "Attach a résumé (optional)")
              : t(
                  "Joindre des plans, photos ou documents (facultatif)",
                  "Attach plans, photos or documents (optional)",
                )}
          </span>
          <input
            type="file"
            name="files"
            multiple
            accept=".pdf,.docx,.jpg,.jpeg,.png"
          />
          <small>
            {t(
              "3 fichiers maximum · 10 Mo chacun · 15 Mo au total",
              "Maximum 3 files · 10 MB each · 15 MB total",
            )}
          </small>
        </label>
        <div className="honey" aria-hidden="true">
          <label>
            Website
            <input name="website_trap" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label className="wide consent">
          <input type="checkbox" name="consent" value="yes" required />
          <span>
            {t(
              "J’accepte que LMHI utilise les informations fournies pour traiter cette demande.",
              "I consent to LMHI using the information supplied to process this request.",
            )}{" "}
            <a
              href={en ? "/en/confidentialite" : "/confidentialite"}
              target="_blank"
            >
              {t("Confidentialité", "Privacy")}
            </a>
          </span>
        </label>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn red" disabled={busy || !token}>
        {busy
          ? t("Enregistrement…", "Saving…")
          : kind === "career"
            ? t("Envoyer ma candidature", "Submit my application")
            : kind === "partner"
              ? t("Proposer une collaboration", "Propose a collaboration")
              : kind === "quote"
                ? t(
                    "Envoyer ma demande de soumission",
                    "Submit my quote request",
                  )
                : t("Envoyer le message", "Send message")}
      </button>
      <p className="form-footnote">
        <ShieldCheck size={14} />
        {t(
          "Transmission sécurisée. Aucune pièce jointe n’est accessible publiquement.",
          "Secure transmission. Attachments are not publicly accessible.",
        )}
      </p>
    </form>
  );
}
