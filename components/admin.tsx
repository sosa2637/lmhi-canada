"use client";
import { type Division, type Settings } from "@/app/content";
import { uploadFile } from "@/lib/upload-client";
import { Download, Mail, Plus, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
export default function Admin({
  en,
  divisions,
}: {
  en: boolean;
  divisions: Division[];
}) {
  const t = (f: string, e: string) => (en ? e : f);
  const [loginEmail, setLoginEmail] = useState(""),
    [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(true),
    [locked, setLocked] = useState(false),
    [tab, setTab] = useState("requests"),
    [settings, setSettings] = useState<Settings>({}),
    [requests, setRequests] = useState<any[]>([]),
    [views, setViews] = useState<any[]>([]),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin");
      const x: any = await r.json();
      if (r.status === 403) {
        setLocked(true);
        return;
      }
      if (!r.ok) throw new Error(x.error);
      setLocked(false);
      setSettings(x.settings);
      setRequests(x.submissions);
      setViews(x.views || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unavailable");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function save() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const r = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "settings", data: settings }),
      });
      const x: any = await r.json();
      if (!r.ok) throw new Error(x.error);
      setNotice(t("Modifications enregistrées.", "Changes saved."));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unavailable");
    } finally {
      setBusy(false);
    }
  }
  const update = (key: string, value: any) =>
    setSettings({ ...settings, [key]: value });
  const text = (key: keyof Settings, label: string, multi = false) => (
    <label className={multi ? "wide" : ""} key={key}>
      <span>{label}</span>
      {multi ? (
        <textarea
          value={String(settings[key] || "")}
          rows={4}
          onChange={(e) => update(key, e.target.value)}
        />
      ) : (
        <input
          value={String(settings[key] || "")}
          onChange={(e) => update(key, e.target.value)}
        />
      )}
    </label>
  );
  const title = (key: string) =>
    ({
      requests: t("Demandes reçues", "Received requests"),
      content: t("Textes & coordonnées", "Text & contact details"),
      divisions: t("Divisions", "Divisions"),
      jobs: t("Offres d’emploi", "Job postings"),
      posts: t("Projets & actualités", "Projects & news"),
      network: t("Réseau & documents", "Network & documents"),
    })[key] || "";
  if (locked)
    return (
      <section className="section wrap admin-locked">
        <ShieldCheck size={42} />
        <h1>{t("Espace de gestion LMHI", "LMHI management workspace")}</h1>
        <p>
          {t(
            "Cet espace est réservé au compte administrateur autorisé.",
            "This area is restricted to the authorized administrator account.",
          )}
        </p>
        <form
          className="login-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            try {
              const r = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: loginEmail,
                  password: loginPassword,
                }),
              });
              const x = await r.json();
              if (!r.ok) throw new Error(x.error);
              setLoginPassword("");
              await load();
            } catch (e) {
              setError(
                e instanceof Error ? e.message : "Connexion indisponible.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Courriel / Email
            <input
              type="email"
              autoComplete="username"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </label>
          <label>
            Mot de passe / Password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </label>
          <button className="btn dark" disabled={busy}>
            {busy ? "…" : t("Se connecter", "Sign in")}
          </button>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </form>
      </section>
    );
  return (
    <section className="section wrap admin">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">LMHI / {t("GESTION", "MANAGEMENT")}</p>
          <h1>{t("Votre espace de travail.", "Your workspace.")}</h1>
        </div>
        <div className="admin-actions">
          <a className="btn pale" href="/">
            {t("Voir le site", "View website")}
          </a>
          <button
            className="btn pale"
            onClick={async () => {
              const r = await fetch("/api/auth/logout", { method: "POST" });
              if (r.ok) {
                setLocked(true);
                setRequests([]);
                setSettings({});
              } else
                setError(t("Déconnexion impossible.", "Unable to sign out."));
            }}
          >
            {t("Se déconnecter", "Sign out")}
          </button>
        </div>
      </div>
      <p className="secondary">
        {t(
          "Validez les textes, services, coordonnées et autorisations avant toute publication publique. Les demandes sont enregistrées ici; aucune notification par courriel n’est configurée.",
          "Validate texts, services, contact details and authorizations before public publication. Requests are stored here; email notifications are not configured.",
        )}
      </p>
      <div className="admin-tabs">
        {["requests", "content", "divisions", "jobs", "posts", "network"].map(
          (key) => (
            <button
              key={key}
              className={tab === key ? "selected" : ""}
              onClick={() => {
                setTab(key);
                setNotice("");
              }}
            >
              {title(key)}
              {key === "requests" && <span>{requests.length}</span>}
            </button>
          ),
        )}
      </div>
      {loading ? (
        <p>{t("Chargement…", "Loading…")}</p>
      ) : (
        <>
          {tab === "requests" && (
            <>
              <div className="stats-strip">
                <div>
                  <span>{t("Demandes reçues", "Requests received")}</span>
                  <strong>{requests.length}</strong>
                </div>
                <div>
                  <span>
                    {t(
                      "Pages vues (30 derniers jours)",
                      "Page views (last 30 days)",
                    )}
                  </span>
                  <strong>
                    {views.reduce((sum, v) => sum + Number(v.count), 0)}
                  </strong>
                </div>
                <div>
                  <span>
                    {t("Statistiques sans cookies", "Cookie-free statistics")}
                  </span>
                  <p>
                    {t(
                      "Comptage agrégé, sans profil de visiteur.",
                      "Aggregate counts, without visitor profiles.",
                    )}
                  </p>
                </div>
              </div>
              <div className="section-head">
                <h2>{title(tab)}</h2>
                <button className="btn pale" onClick={load}>
                  {t("Actualiser", "Refresh")}
                </button>
              </div>
              {requests.length === 0 ? (
                <div className="empty-state">
                  <Mail size={25} />
                  <p>
                    {t(
                      "Aucune demande reçue. Les soumissions, candidatures et propositions apparaîtront ici.",
                      "No requests received. Quotes, applications and proposals will appear here.",
                    )}
                  </p>
                </div>
              ) : (
                requests.map((r) => {
                  const d = JSON.parse(r.data),
                    files = JSON.parse(r.files);
                  return (
                    <details className="request-item" key={r.id}>
                      <summary>
                        <span className="request-kind">
                          {
                            {
                              quote: t("Soumission", "Quote"),
                              career: t("Candidature", "Application"),
                              partner: t("Partenaire", "Partner"),
                              contact: t("Contact", "Contact"),
                            }[r.kind as string]
                          }
                        </span>
                        <strong>
                          {d.company ||
                            (d.firstName
                              ? d.firstName + " " + d.lastName
                              : d.contact)}
                        </strong>
                        <time>
                          {new Date(r.created).toLocaleDateString(
                            en ? "en-CA" : "fr-CA",
                          )}
                        </time>
                        <span className="request-status">
                          {
                            {
                              new: t("Nouveau", "New"),
                              reviewed: t("Examiné", "Reviewed"),
                              closed: t("Fermé", "Closed"),
                            }[r.status as string]
                          }
                        </span>
                      </summary>
                      <div className="request-data">
                        {Object.entries(d).map(([k, v]) => (
                          <div key={k}>
                            <span>
                              {{
                                company: t("Entreprise", "Company"),
                                firstName: t("Prénom", "First name"),
                                lastName: t("Nom", "Last name"),
                                contact: t("Personne-ressource", "Contact"),
                                phone: t("Téléphone", "Phone"),
                                email: t("Courriel", "Email"),
                                location: t("Lieu", "Location"),
                                service: t("Service", "Service"),
                                date: t("Date", "Date"),
                                description: t("Description", "Description"),
                                trade: t("Métier", "Trade"),
                                experience: t("Expérience", "Experience"),
                                availability: t(
                                  "Disponibilité",
                                  "Availability",
                                ),
                                url: t("Site Web", "Website"),
                              }[k] || k}
                            </span>
                            <p>{String(v)}</p>
                          </div>
                        ))}
                        <div className="wide">
                          {files.map((f: any) => (
                            <a
                              className="btn pale"
                              key={f.key}
                              href={
                                "/api/files?key=" + encodeURIComponent(f.key)
                              }
                            >
                              <Download size={16} />
                              {f.name}
                            </a>
                          ))}
                        </div>
                        <label>
                          <span>{t("État du dossier", "Request status")}</span>
                          <select
                            value={r.status}
                            onChange={async (e) => {
                              const status = e.target.value;
                              try {
                                const res = await fetch("/api/admin", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    action: "status",
                                    id: r.id,
                                    status,
                                  }),
                                });
                                if (!res.ok) throw new Error();
                                setRequests(
                                  requests.map((item) =>
                                    item.id === r.id
                                      ? { ...item, status }
                                      : item,
                                  ),
                                );
                              } catch {
                                setError(
                                  t(
                                    "Modification impossible.",
                                    "Unable to update.",
                                  ),
                                );
                              }
                            }}
                          >
                            <option value="new">{t("Nouveau", "New")}</option>
                            <option value="reviewed">
                              {t("Examiné", "Reviewed")}
                            </option>
                            <option value="closed">
                              {t("Fermé", "Closed")}
                            </option>
                          </select>
                        </label>
                        <button
                          className="remove"
                          onClick={async () => {
                            if (
                              !window.confirm(
                                t(
                                  "Supprimer définitivement cette demande et ses pièces jointes ?",
                                  "Permanently delete this request and its attachments?",
                                ),
                              )
                            )
                              return;
                            try {
                              const res = await fetch("/api/admin", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  action: "delete",
                                  id: r.id,
                                }),
                              });
                              if (!res.ok) throw new Error();
                              setRequests(
                                requests.filter((x) => x.id !== r.id),
                              );
                            } catch {
                              setError(
                                t(
                                  "Suppression impossible.",
                                  "Unable to delete.",
                                ),
                              );
                            }
                          }}
                        >
                          {t(
                            "Supprimer le dossier et les fichiers",
                            "Delete request and files",
                          )}
                        </button>
                      </div>
                    </details>
                  );
                })
              )}
            </>
          )}
          {tab === "content" && (
            <div className="fields admin-fields">
              {text(
                "email",
                t("Courriel professionnel officiel", "Official business email"),
              )}
              {text("phone", t("Téléphone professionnel", "Business phone"))}
              {text(
                "founderName",
                t(
                  "Nom complet du président-fondateur",
                  "President and founder’s full name",
                ),
              )}
              {text("founderTitleFr", "Fonction — Français")}
              {text("founderTitleEn", "Position — English")}
              {text("locationFr", "Ville et territoire — Français")}
              {text("locationEn", "City and territory — English")}
              {text(
                "address",
                t(
                  "Adresse administrative à afficher",
                  "Administrative address to display",
                ),
                true,
              )}
              {text(
                "linkedin",
                t(
                  "Lien LinkedIn officiel (https://…)",
                  "Official LinkedIn link (https://…)",
                ),
              )}
              {text("heroFr", "Slogan / titre d’accueil — Français", true)}
              {text("heroEn", "Home title / slogan — English", true)}
              {text("aboutFr", "Présentation — Français", true)}
              {text("aboutEn", "Company introduction — English", true)}
            </div>
          )}
          {tab === "jobs" && (
            <>
              <div className="section-head">
                <h2>{title(tab)}</h2>
                <button
                  className="btn dark"
                  onClick={() =>
                    update("jobs", [
                      ...(settings.jobs || []),
                      {
                        id: crypto.randomUUID(),
                        titleFr: "",
                        titleEn: "",
                        bodyFr: "",
                        bodyEn: "",
                        location: "",
                      },
                    ])
                  }
                >
                  <Plus size={17} />
                  {t("Ajouter un poste", "Add a job")}
                </button>
              </div>
              {(settings.jobs || []).map((job, index) => (
                <div className="editor-card" key={job.id}>
                  <div className="fields">
                    {[
                      ["titleFr", "Intitulé — Français"],
                      ["titleEn", "Job title — English"],
                      ["location", t("Ville / province", "City / province")],
                      ["bodyFr", "Description — Français"],
                      ["bodyEn", "Description — English"],
                    ].map(([key, l]) => (
                      <label
                        className={key.startsWith("body") ? "wide" : ""}
                        key={key}
                      >
                        <span>{l}</span>
                        {key.startsWith("body") ? (
                          <textarea
                            rows={4}
                            value={(job as any)[key]}
                            onChange={(e) =>
                              update(
                                "jobs",
                                settings.jobs!.map((j, k) =>
                                  k === index
                                    ? { ...j, [key]: e.target.value }
                                    : j,
                                ),
                              )
                            }
                          />
                        ) : (
                          <input
                            value={(job as any)[key]}
                            onChange={(e) =>
                              update(
                                "jobs",
                                settings.jobs!.map((j, k) =>
                                  k === index
                                    ? { ...j, [key]: e.target.value }
                                    : j,
                                ),
                              )
                            }
                          />
                        )}
                      </label>
                    ))}
                  </div>
                  <button
                    className="remove"
                    onClick={() =>
                      update(
                        "jobs",
                        settings.jobs!.filter((j) => j.id !== job.id),
                      )
                    }
                  >
                    {t("Retirer ce poste", "Remove job")}
                  </button>
                </div>
              ))}
            </>
          )}
          {tab === "posts" && (
            <>
              <div className="section-head">
                <h2>{title(tab)}</h2>
                <button
                  className="btn dark"
                  onClick={() =>
                    update("posts", [
                      ...(settings.posts || []),
                      {
                        id: crypto.randomUUID(),
                        type: "news",
                        titleFr: "",
                        titleEn: "",
                        bodyFr: "",
                        bodyEn: "",
                        date: new Date().toISOString().slice(0, 10),
                      },
                    ])
                  }
                >
                  <Plus size={17} />
                  {t("Ajouter une publication", "Add a post")}
                </button>
              </div>
              {(settings.posts || []).map((post, index) => (
                <div className="editor-card" key={post.id}>
                  <div className="fields">
                    <label>
                      <span>Type</span>
                      <select
                        value={post.type}
                        onChange={(e) =>
                          update(
                            "posts",
                            settings.posts!.map((p, k) =>
                              k === index ? { ...p, type: e.target.value } : p,
                            ),
                          )
                        }
                      >
                        <option value="news">{t("Actualité", "News")}</option>
                        <option value="project">
                          {t("Projet / Réalisation", "Project")}
                        </option>
                      </select>
                    </label>
                    {[
                      ["titleFr", "Titre — Français"],
                      ["titleEn", "Title — English"],
                      ["date", "Date"],
                      ["bodyFr", "Texte — Français"],
                      ["bodyEn", "Text — English"],
                    ].map(([key, l]) => (
                      <label
                        className={key.startsWith("body") ? "wide" : ""}
                        key={key}
                      >
                        <span>{l}</span>
                        {key.startsWith("body") ? (
                          <textarea
                            rows={5}
                            value={(post as any)[key]}
                            onChange={(e) =>
                              update(
                                "posts",
                                settings.posts!.map((p, k) =>
                                  k === index
                                    ? { ...p, [key]: e.target.value }
                                    : p,
                                ),
                              )
                            }
                          />
                        ) : (
                          <input
                            type={key === "date" ? "date" : "text"}
                            value={(post as any)[key]}
                            onChange={(e) =>
                              update(
                                "posts",
                                settings.posts!.map((p, k) =>
                                  k === index
                                    ? { ...p, [key]: e.target.value }
                                    : p,
                                ),
                              )
                            }
                          />
                        )}
                      </label>
                    ))}
                  </div>
                  <button
                    className="remove"
                    onClick={() =>
                      update(
                        "posts",
                        settings.posts!.filter((p) => p.id !== post.id),
                      )
                    }
                  >
                    {t("Retirer cette publication", "Remove post")}
                  </button>
                </div>
              ))}
            </>
          )}
          {tab === "divisions" && (
            <>
              <div className="section-head">
                <h2>{title(tab)}</h2>
                <button
                  className="btn dark"
                  onClick={() =>
                    update("divisions", [
                      ...(settings.divisions || divisions),
                      {
                        slug: "division-" + Date.now(),
                        name: ["Nouvelle division", "New division"],
                        intro: ["", ""],
                        services: [["", ""]],
                        icon: "factory",
                        developing: true,
                        regulated: true,
                      },
                    ])
                  }
                >
                  <Plus size={17} />
                  {t("Ajouter une division", "Add a division")}
                </button>
              </div>
              {(settings.divisions || divisions).map((d, index) => {
                const all = settings.divisions || divisions;
                const change = (patch: Partial<Division>) =>
                  update(
                    "divisions",
                    all.map((v, k) => (k === index ? { ...v, ...patch } : v)),
                  );
                return (
                  <details className="editor-card" key={d.slug}>
                    <summary>{d.name[en ? 1 : 0]}</summary>
                    <div className="fields">
                      {[0, 1].map((j) => (
                        <label key={j}>
                          <span>
                            {j ? "Division name — English" : "Nom — Français"}
                          </span>
                          <input
                            value={d.name[j]}
                            onChange={(e) => {
                              const names = [...d.name];
                              names[j] = e.target.value;
                              change({ name: names });
                            }}
                          />
                        </label>
                      ))}
                      {[0, 1].map((j) => (
                        <label key={"intro" + j} className="wide">
                          <span>
                            {j
                              ? "Introduction — English"
                              : "Introduction — Français"}
                          </span>
                          <textarea
                            rows={3}
                            value={d.intro[j]}
                            onChange={(e) => {
                              const v = [...d.intro];
                              v[j] = e.target.value;
                              change({ intro: v });
                            }}
                          />
                        </label>
                      ))}
                      {[0, 1].map((j) => (
                        <label key={"services" + j} className="wide">
                          <span>
                            {j
                              ? "Services — English (one per line)"
                              : "Services — Français (un par ligne)"}
                          </span>
                          <textarea
                            rows={6}
                            value={d.services.map((s) => s[j]).join("\n")}
                            onChange={(e) => {
                              const lines = e.target.value.split("\n");
                              const length = Math.max(
                                lines.length,
                                d.services.length,
                              );
                              change({
                                services: Array.from({ length }, (_, k) =>
                                  j === 0
                                    ? [lines[k] || "", d.services[k]?.[1] || ""]
                                    : [
                                        d.services[k]?.[0] || "",
                                        lines[k] || "",
                                      ],
                                ),
                              });
                            }}
                          />
                        </label>
                      ))}
                      <label className="consent">
                        <input
                          type="checkbox"
                          checked={!!d.developing}
                          onChange={(e) =>
                            change({ developing: e.target.checked })
                          }
                        />
                        <span>
                          {t(
                            "Division en développement",
                            "Division in development",
                          )}
                        </span>
                      </label>
                      <label className="consent">
                        <input
                          type="checkbox"
                          checked={!!d.regulated}
                          onChange={(e) =>
                            change({ regulated: e.target.checked })
                          }
                        />
                        <span>
                          {t(
                            "Services soumis à autorisation",
                            "Services subject to authorization",
                          )}
                        </span>
                      </label>
                    </div>
                  </details>
                );
              })}
            </>
          )}
          {tab === "network" && (
            <>
              <h2>{t("Associations autorisées", "Authorized associations")}</h2>
              <p>
                {t(
                  "Naval Québec, CSMOIM et CMISA pourront être ajoutés après confirmation de l’affiliation et du droit d’utilisation publique.",
                  "Naval Québec, CSMOIM and CMISA may be added after affiliation and public usage rights are confirmed.",
                )}
              </p>
              {(settings.associations || []).map((a, index) => (
                <div className="editor-card" key={index}>
                  <div className="fields">
                    <label>
                      <span>
                        {t(
                          "Nom de l’association / certification",
                          "Association / certification name",
                        )}
                      </span>
                      <input
                        value={a.name}
                        onChange={(e) =>
                          update(
                            "associations",
                            settings.associations!.map((x, k) =>
                              k === index ? { ...x, name: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </label>
                    <label>
                      <span>{t("Site officiel", "Official website")}</span>
                      <input
                        type="url"
                        value={a.url}
                        onChange={(e) =>
                          update(
                            "associations",
                            settings.associations!.map((x, k) =>
                              k === index ? { ...x, url: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </label>
                    <label className="consent wide">
                      <input
                        type="checkbox"
                        checked={a.authorized}
                        onChange={(e) =>
                          update(
                            "associations",
                            settings.associations!.map((x, k) =>
                              k === index
                                ? { ...x, authorized: e.target.checked }
                                : x,
                            ),
                          )
                        }
                      />
                      <span>
                        {t(
                          "Je confirme l’affiliation / certification et l’autorisation de publication du nom.",
                          "I confirm the affiliation / certification and permission to publish the name.",
                        )}
                      </span>
                    </label>
                  </div>
                  <button
                    className="remove"
                    onClick={() =>
                      update(
                        "associations",
                        settings.associations!.filter((_, k) => k !== index),
                      )
                    }
                  >
                    {t("Retirer", "Remove")}
                  </button>
                </div>
              ))}
              <button
                className="btn pale"
                onClick={() =>
                  update("associations", [
                    ...(settings.associations || []),
                    { name: "", url: "", authorized: false },
                  ])
                }
              >
                <Plus size={17} />
                {t(
                  "Ajouter une association / certification",
                  "Add an association / certification",
                )}
              </button>
              <h2 className="admin-subtitle">
                {t("Brochures PDF", "PDF brochures")}
              </h2>
              <label className="upload">
                <span>
                  {t(
                    "Ajouter un PDF dont la publication est autorisée (10 Mo max.)",
                    "Add a PDF approved for publication (10 MB max.)",
                  )}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setBusy(true);
                    try {
                      const attached = await uploadFile(
                        file,
                        undefined,
                        "brochure",
                      );
                      const r = await fetch("/api/files", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(attached),
                      });
                      const x: any = await r.json();
                      if (!r.ok) throw new Error(x.error);
                      update("brochures", [...(settings.brochures || []), x]);
                      setNotice(
                        t(
                          "PDF ajouté. Enregistrez les modifications pour l’afficher sur le site.",
                          "PDF added. Save changes to display it on the website.",
                        ),
                      );
                    } catch (e) {
                      setError(e instanceof Error ? e.message : "Unavailable");
                    } finally {
                      setBusy(false);
                    }
                  }}
                />
              </label>
              {settings.brochures?.map((b, index) => (
                <div className="brochure-row" key={b.url}>
                  <a href={b.url}>{b.name}</a>
                  <button
                    className="remove"
                    onClick={() =>
                      update(
                        "brochures",
                        settings.brochures!.filter((_, k) => k !== index),
                      )
                    }
                  >
                    {t("Retirer", "Remove")}
                  </button>
                </div>
              ))}
            </>
          )}
          {tab !== "requests" && (
            <div className="save-bar">
              <button className="btn red" disabled={busy} onClick={save}>
                {busy
                  ? t("Enregistrement…", "Saving…")
                  : t("Enregistrer les modifications", "Save changes")}
              </button>
              <span>
                {t(
                  "Les changements deviennent visibles après enregistrement.",
                  "Changes become visible after saving.",
                )}
              </span>
            </div>
          )}
        </>
      )}
      {notice && (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
