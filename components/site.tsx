"use client";

import {

  divisions as baseDivisions,

  defaultSettings,

  markets,

  values,

  type Lang,

  type Settings,

} from "@/app/content";

import {

  Anchor,

  Check,

  ChevronDown,

  Construction,

  Factory,

  FileText,

  Globe,

  HardHat,

  Globe as Linkedin,

  Mail,

  MapPin,

  Menu,

  Phone,

  Plus,

  ShieldCheck,

  Truck,

  Users,

  X,

} from "lucide-react";

import { useEffect, useState } from "react";

import Admin from "./admin";

import Brochures from "./brochures";

import Cta from "./cta";

import Network from "./network";

import News from "./news";

import PageHero from "./page-hero";

import RequestForm from "./request-form";

const icons: Record<string, typeof Anchor> = {

  anchor: Anchor,

  factory: Factory,

  shield: ShieldCheck,

  truck: Truck,

  users: Users,

  traffic: Construction,

};

export default function Site({ route, lang }: { route: string; lang: Lang }) {

  const en = lang === "en",

    i = en ? 1 : 0,

    t = (fr: string, english: string) => (en ? english : fr);

  const [settings, setSettings] = useState<Settings>(defaultSettings),

    [menu, setMenu] = useState(false),

    [servicesMenu, setServicesMenu] = useState(false);

  useEffect(() => {

    document.documentElement.lang = lang;

    if (route !== "gestion")

      fetch("/api/views", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ path: window.location.pathname }),

      }).catch(() => {});

    fetch("/api/content")

      .then((r) => (r.ok ? r.json() : {}))

      .then((saved) => setSettings({ ...defaultSettings, ...saved }))

      .catch(() => {});

  }, [lang]);

  const ds = settings.divisions?.length ? settings.divisions : baseDivisions;

  const href = (r: string) =>

    en

      ? "/en" + (r === "accueil" ? "" : "/" + r)

      : r === "accueil"

        ? "/"

        : "/" + r;

  const division = ds.find((d) => d.slug === route);

  const label = (r: string) =>

    ({

      accueil: t("Accueil", "Home"),

      "a-propos": t("À propos", "About us"),

      direction: t("Notre direction", "Our leadership"),

      projets: t("Projets / Actualités", "Projects / News"),

      carrieres: t("Carrières", "Careers"),

      partenaires: t("Devenir partenaire", "Become a partner"),

      contact: t("Nous contacter", "Contact us"),

    })[r] || "";

  const about =

    settings[en ? "aboutEn" : "aboutFr"] ||

    defaultSettings[en ? "aboutEn" : "aboutFr"]!;

  return (

    <>

      <a className="skip" href="#main">

        {t("Aller au contenu", "Skip to content")}

      </a>

      <div className="topbar">

        <div className="wrap top-inner">

          <span>

            {t(

              "ANCRÉS AU QUÉBEC. TOURNÉS VERS LE CANADA.",

              "ROOTED IN QUÉBEC. REACHING ACROSS CANADA.",

            )}

          </span>

          <div>

            <span className="country">CANADA</span>

            <a

              href={

                en

                  ? route === "accueil"

                    ? "/"

                    : "/" + route

                  : "/en" + (route === "accueil" ? "" : "/" + route)

              }

              lang={en ? "fr" : "en"}

            >

              <Globe size={13} />

              {en ? "FR" : "EN"}

            </a>

          </div>

        </div>

      </div>

      <header className="header">

        <div className="wrap header-inner">

          <a

            href={href("accueil")}

            className="brand"

            aria-label="LMHI Canada — Accueil"

          >

            <span className="brand-word">

              LMHI

              <span className="brand-square" />

            </span>

            <span className="brand-desc">

              LONGLA MARINE &<br />

              HEAVY INDUSTRIES CANADA

            </span>

          </a>

          <nav

            className={"nav " + (menu ? "open" : "")}

            aria-label={t("Menu principal", "Main navigation")}

          >

            <a

              className={route === "accueil" ? "active" : ""}

              href={href("accueil")}

            >

              {label("accueil")}

            </a>

            <a

              className={route === "a-propos" ? "active" : ""}

              href={href("a-propos")}

            >

              {label("a-propos")}

            </a>

            <a

              className={route === "direction" ? "active" : ""}

              href={href("direction")}

            >

              {label("direction")}

            </a>

            <div className="dropdown">

              <button

                onClick={() => setServicesMenu(!servicesMenu)}

                aria-expanded={servicesMenu}

                className={division ? "active" : ""}

              >

                {t("Nos divisions", "Our divisions")}

                <ChevronDown size={14} />

              </button>

              <div className={"dropdown-list " + (servicesMenu ? "show" : "")}>

                {ds.map((d) => (

                  <a key={d.slug} href={href(d.slug)}>

                    {d.name[i]}

                  </a>

                ))}

              </div>

            </div>

            <a

              className={route === "projets" ? "active" : ""}

              href={href("projets")}

            >

              {label("projets")}

            </a>

            <a

              className={route === "carrieres" ? "active" : ""}

              href={href("carrieres")}

            >

              {label("carrieres")}

            </a>

            <a className="mobile-partner" href={href("partenaires")}>

              {t("Fournisseurs / Partenaires", "Suppliers / Partners")}

            </a>

            <a className="nav-contact" href={href("contact")}>

              {label("contact")}

            </a>

          </nav>

          <button

            className="menu-toggle"

            onClick={() => setMenu(!menu)}

            aria-label={

              menu

                ? t("Fermer le menu", "Close menu")

                : t("Ouvrir le menu", "Open menu")

            }

            aria-expanded={menu}

          >

            {menu ? <X /> : <Menu />}

          </button>

        </div>

      </header>

      <main id="main">

        {route === "accueil" && (

          <>

            <section className="hero">

              <img

                className="hero-photo"

                src="/images/port.jpg"

                alt={t(

                  "Navire porte-conteneurs et grues au port de Vancouver",

                  "Container vessel and cranes at the Port of Vancouver",

                )}

              />

              <div className="hero-shade" />

              <div className="wrap hero-inner">

                <div className="eyebrow light">

                  <span />

                  {t(

                    "MARITIME · INDUSTRIE · EXPERTISE",

                    "MARINE · INDUSTRY · EXPERTISE",

                  )}

                </div>

                <p className="hero-company">

                  LONGLA MARINE &<br />

                  HEAVY INDUSTRIES CANADA

                </p>

                <h1>

                  {settings[en ? "heroEn" : "heroFr"] || (

                    <>

                      {t("La force canadienne,", "Canadian strength,")}

                      <br />

                      {t("du métal aux", "from steel to the")}

                      <br />

                      <em>{t("océans.", "oceans.")}</em>

                    </>

                  )}

                </h1>

                <p className="hero-sub">

                  {t(

                    "Soudage industriel, fabrication métallique et maintenance.",

                    "Industrial welding, metal fabrication and maintenance.",

                  )}

                  <br />

                  {t(

                    "Basés à Québec. Au service de projets partout au Canada.",

                    "Based in Québec City. Supporting projects across Canada.",

                  )}

                </p>

                <div className="hero-actions glass-panel">

                  <div className="hero-buttons">

                    <a className="btn red" href="#divisions">

                      {t("Découvrir nos services", "Explore our services")}

                    </a>

                    <a className="btn outline" href={href("soumission")}>

                      {t("Demander une soumission", "Request a quote")}

                    </a>

                  </div>

                  <a className="hero-partner" href={href("partenaires")}>

                    {t("Devenir partenaire", "Become a partner")}

                  </a>

                </div>

              </div>

              <div className="hero-side">

                <span>QUÉBEC / CANADA</span>

                <span>MARINE & HEAVY INDUSTRIES</span>

              </div>

              <div className="hero-bottom wrap">

                <span>

                  01 —{" "}

                  {t(

                    "LA FORCE D’UN ENSEMBLE",

                    "STRENGTH THROUGH COLLABORATION",

                  )}

                </span>

                <a href="#divisions">

                  {t("EXPLORER", "EXPLORE")}

                  <ChevronDown size={16} />

                </a>

              </div>

            </section>

            <div className="discipline-strip">

              <div className="wrap">

                {[

                  [Anchor, t("Services maritimes", "Marine services")],

                  [Factory, t("Industrie lourde", "Heavy industry")],

                  [Users, t("Personnel spécialisé", "Skilled personnel")],

                  [ShieldCheck, t("Sécurité & qualité", "Safety & quality")],

                ].map(([Ic, txt], index) => {

                  const Icon = Ic as typeof Anchor;

                  return (

                    <div key={index}>

                      <Icon size={23} />

                      <span>{txt as string}</span>

                    </div>

                  );

                })}

              </div>

            </div>

            <section className="section wrap intro-grid">

              <div>

                <p className="eyebrow">

                  01 / {t("L’ENTREPRISE", "THE COMPANY")}

                </p>

                <h2>

                  {t("Plusieurs expertises.", "Many areas of expertise.")}

                  <br />

                  <span className="muted">

                    {t("Une seule force.", "One collective strength.")}

                  </span>

                </h2>

              </div>

              <div className="intro-copy">

                <p>{about}</p>

                <p className="secondary">

                  {t(

                    "Notre approche repose sur la sécurité, la qualité du travail, la disponibilité des équipes et la flexibilité opérationnelle.",

                    "Our approach is built on safety, quality workmanship, team availability and operational flexibility.",

                  )}

                </p>

                <a className="text-link" href={href("a-propos")}>

                  {t("Découvrir LMHI Canada", "Discover LMHI Canada")}

                  <Plus size={17} />

                </a>

              </div>

            </section>

            <section className="president-preview-section">

              <div className="wrap president-preview">

                <div className="president-preview-image">

                  <img

                    src={settings.founderImage || "/images/president.jpg"}

                    alt={t(

                      "Portrait de Joe Pharleys Longla Pafoule, président-fondateur de LMHI Canada",

                      "Portrait of Joe Pharleys Longla Pafoule, President and Founder of LMHI Canada",

                    )}

                    loading="lazy"

                  />

                </div>

                <div className="president-preview-copy">

                  <p className="eyebrow">{t("LA DIRECTION", "LEADERSHIP")}</p>

                  <h2>{settings.founderName || defaultSettings.founderName}</h2>

                  <p className="president-role">

                    {settings[en ? "founderTitleEn" : "founderTitleFr"]}

                  </p>

                  <p>

                    {settings[en ? "founderIntroEn" : "founderIntroFr"] ||

                      t(

                        "Une vision entrepreneuriale tournée vers le développement industriel et maritime et la création de partenariats durables.",

                        "An entrepreneurial vision focused on industrial and maritime development and lasting partnerships.",

                      )}

                  </p>

                  <a className="text-link" href={href("direction")}>

                    {t("Découvrir notre président", "Meet our President")}

                    <Plus size={17} />

                  </a>

                </div>

              </div>

            </section>

            <section id="divisions" className="divisions-section">

              <div className="wrap">

                <div className="section-head">

                  <div>

                    <p className="eyebrow">

                      02 / {t("NOS DIVISIONS", "OUR DIVISIONS")}

                    </p>

                    <h2>

                      {t(

                        "De la mer à l’industrie.",

                        "From marine to industry.",

                      )}

                    </h2>

                  </div>

                  <p>

                    {t(

                      "Des compétences complémentaires,",

                      "Complementary skills,",

                    )}

                    <br />

                    {t(

                      "réunies pour vos projets.",

                      "brought together for your projects.",

                    )}

                  </p>

                </div>

                <div className="division-grid">

                  {ds.map((d, index) => {

                    const Icon = icons[d.icon] || Factory;

                    return (

                      <a

                        key={d.slug}

                        href={href(d.slug)}

                        className={

                          "division-card " + (index === 0 ? "featured" : "")

                        }

                      >

                        <div className="card-top">

                          <Icon size={30} strokeWidth={1.4} />

                          <span className="card-number">0{index + 1}</span>

                        </div>

                        <h3>{d.name[i]}</h3>

                        <p>{d.intro[i]}</p>

                        <div className="card-bottom">

                          <span>

                            {d.developing

                              ? t("En développement", "In development")

                              : t(

                                  "Découvrir la division",

                                  "Explore this division",

                                )}

                          </span>

                          <Plus size={22} />

                        </div>

                      </a>

                    );

                  })}

                </div>

                <p className="reg-note">

                  {t(

                    "Les services réglementés sont proposés uniquement après obtention des permis, licences et accréditations applicables.",

                    "Regulated services are offered only after the applicable permits, licences and accreditations have been obtained.",

                  )}

                </p>

              </div>

            </section>

            <section className="expertise-section">

              <div className="expertise-image">

                <img

                  src="/images/welding.jpg"

                  alt={t(

                    "Soudeur équipé de protections au travail",

                    "Welder wearing protective equipment at work",

                  )}

                  loading="lazy"

                />

                <span>

                  {t(

                    "EXPERTISE TECHNIQUE / EXIGENCE INDUSTRIELLE",

                    "TECHNICAL EXPERTISE / INDUSTRIAL STANDARDS",

                  )}

                </span>

              </div>

              <div className="expertise-copy">

                <p className="eyebrow light">

                  03 / {t("NOTRE APPROCHE", "OUR APPROACH")}

                </p>

                <h2>

                  {t("Vos enjeux.", "Your challenges.")}

                  <br />

                  {t("Notre engagement.", "Our commitment.")}

                </h2>

                {[

                  [

                    t("La sécurité, à chaque étape", "Safety at every step"),

                    t(

                      "Une approche attentive aux exigences de chaque environnement de travail.",

                      "An approach attentive to the requirements of every work environment.",

                    ),

                  ],

                  [

                    t("Une mobilisation adaptée", "Tailored mobilization"),

                    t(

                      "Des équipes constituées selon les métiers, les échéanciers et les besoins du projet.",

                      "Teams assembled around your project’s trades, timelines and needs.",

                    ),

                  ],

                  [

                    t("Des relations durables", "Lasting relationships"),

                    t(

                      "Une collaboration fondée sur la qualité, la fiabilité et le professionnalisme.",

                      "Collaboration built on quality, reliability and professionalism.",

                    ),

                  ],

                ].map(([title, body], j) => (

                  <div className="commitment" key={j}>

                    <span>0{j + 1}</span>

                    <div>

                      <h3>{title}</h3>

                      <p>{body}</p>

                    </div>

                  </div>

                ))}

              </div>

            </section>

            <section className="section wrap">

              <div className="section-head">

                <div>

                  <p className="eyebrow">

                    04 / {t("SECTEURS & TERRITOIRES", "SECTORS & TERRITORIES")}

                  </p>

                  <h2>

                    {t(

                      "Au cœur des grands secteurs.",

                      "Supporting major sectors.",

                    )}

                  </h2>

                </div>

                <span className="territory">

                  <MapPin size={18} />

                  {t("Québec · Canada", "Québec · Canada")}

                </span>

              </div>

              <div className="market-grid">

                {markets.map((m, k) => (

                  <div key={k}>

                    <span>0{k + 1}</span>

                    <p>{m[i]}</p>

                  </div>

                ))}

              </div>

              <p className="secondary markets-note">

                {t(

                  "Un ancrage québécois, une vision canadienne et le développement progressif de partenariats internationaux.",

                  "Québec roots, a Canadian vision and the progressive development of international partnerships.",

                )}

              </p>

            </section>

            <section className="network-section wrap">

              <div>

                <p className="eyebrow">

                  05 / {t("ASSOCIATIONS & RÉSEAU", "ASSOCIATIONS & NETWORK")}

                </p>

                <h2>

                  {t(

                    "Grandir avec l’écosystème.",

                    "Growing with the industry.",

                  )}

                </h2>

              </div>

              <Network settings={settings} en={en} />

            </section>

            <Cta en={en} href={href} />

          </>

        )}

        {route === "a-propos" && (

          <>

            <PageHero

              eyebrow={t("À PROPOS DE LMHI", "ABOUT LMHI")}

              title={t(

                "Une entreprise québécoise.\nUne vision sans frontières.",

                "A Québec company.\nA vision without borders.",

              )}

              description={about}

            />

            <section

              className="wrap founder-section president-about-card"

              aria-label={t("Direction", "Leadership")}

            >

              <div className="president-about-image">

                <img

                  src={settings.founderImage || "/images/president.jpg"}

                  alt={t(

                    "Portrait de Joe Pharleys Longla Pafoule",

                    "Portrait of Joe Pharleys Longla Pafoule",

                  )}

                  loading="lazy"

                />

              </div>

              <div className="president-about-copy">

                <p className="eyebrow">{t("DIRECTION", "LEADERSHIP")}</p>

                <h2>{settings.founderName || defaultSettings.founderName}</h2>

                <p>{settings[en ? "founderTitleEn" : "founderTitleFr"]}</p>

                <span>{settings[en ? "locationEn" : "locationFr"]}</span>

                <p>{settings[en ? "founderIntroEn" : "founderIntroFr"]}</p>

                <a className="text-link" href={href("direction")}>

                  {t("En savoir plus sur la direction", "Learn more about our leadership")}

                  <Plus size={17} />

                </a>

              </div>

            </section>

            <section className="section wrap about-layout">

              <div>

                <p className="eyebrow">{t("NOTRE MISSION", "OUR MISSION")}</p>

                <h2>

                  {t(

                    "Réunir les compétences.\nFaire avancer les projets.",

                    "Bringing skills together.\nMoving projects forward.",

                  )}

                </h2>

              </div>

              <div>

                <p>

                  {t(

                    "Fournir des solutions maritimes et industrielles fiables, sécuritaires et flexibles en réunissant expertise technique, main-d’œuvre spécialisée et capacité d’intervention.",

                    "Deliver reliable, safe and flexible marine and industrial solutions by bringing together technical expertise, skilled personnel and intervention capabilities.",

                  )}

                </p>

                <h3>{t("Notre vision", "Our vision")}</h3>

                <p>

                  {t(

                    "Faire de LMHI un acteur canadien reconnu des secteurs maritime et industriel, et développer progressivement une capacité intégrée pour accompagner des projets d’envergure au Canada et à l’international.",

                    "Establish LMHI as a recognized Canadian participant in the marine and industrial sectors, progressively developing integrated capabilities to support major projects in Canada and internationally.",

                  )}

                </p>

              </div>

            </section>

            <section className="values-section">

              <div className="wrap">

                <p className="eyebrow">

                  {t("CE QUI NOUS GUIDE", "WHAT GUIDES US")}

                </p>

                <h2>

                  {t(

                    "Des valeurs qui orientent nos actions.",

                    "Values that guide our actions.",

                  )}

                </h2>

                <div className="values-grid">

                  {values.map((v, k) => (

                    <div key={k}>

                      <Check size={19} />

                      {v[i]}

                    </div>

                  ))}

                </div>

              </div>

            </section>

            <section className="section wrap">

              <p className="eyebrow">{t("POURQUOI LMHI", "WHY LMHI")}</p>

              <div className="why-grid">

                {[

                  [

                    t("Multidisciplinaire", "Multidisciplinary"),

                    t(

                      "Plusieurs compétences techniques réunies sous une même entreprise.",

                      "Several technical skills brought together within one company.",

                    ),

                  ],

                  [

                    t("Mobilisable", "Ready to mobilize"),

                    t(

                      "Une constitution d’équipes selon les besoins de vos projets.",

                      "Teams assembled to suit the needs of your projects.",

                    ),

                  ],

                  [

                    t("Maritime & industriel", "Marine & industrial"),

                    t(

                      "Une approche adaptée aux environnements de chantier, de fabrication et de maintenance.",

                      "An approach tailored to construction, fabrication and maintenance environments.",

                    ),

                  ],

                ].map(([a, b]) => (

                  <div key={a}>

                    <h3>{a}</h3>

                    <p>{b}</p>

                  </div>

                ))}

              </div>

            </section>

            <section className="section wrap network-section">

              <div>

                <p className="eyebrow">

                  {t("ASSOCIATIONS & RÉSEAU", "ASSOCIATIONS & NETWORK")}

                </p>

                <h2>

                  {t("Un réseau en développement.", "A developing network.")}

                </h2>

              </div>

              <Network settings={settings} en={en} />

            </section>

            <Brochures settings={settings} en={en} />

            <Cta en={en} href={href} />

          </>

        )}

        {route === "direction" && (

          <>

            <PageHero

              eyebrow={t("LA DIRECTION", "OUR LEADERSHIP")}

              title={t(

                "Une vision.\nUn engagement.",

                "A vision.\nA commitment.",

              )}

              description={t(

                "Découvrez la personne qui porte la vision de Longla Marine & Heavy Industries Canada.",

                "Meet the person leading the vision of Longla Marine & Heavy Industries Canada.",

              )}

            />

            <section className="section wrap president-profile">

              <div className="president-profile-image">

                <img

                  src={settings.founderImage || "/images/president.jpg"}

                  alt={t(

                    "Portrait de Joe Pharleys Longla Pafoule, président-fondateur de LMHI Canada",

                    "Portrait of Joe Pharleys Longla Pafoule, President and Founder of LMHI Canada",

                  )}

                />

              </div>

              <div className="president-profile-content">

                <p className="eyebrow">{t("PRÉSIDENT-FONDATEUR", "PRESIDENT & FOUNDER")}</p>

                <h2>{settings.founderName || defaultSettings.founderName}</h2>

                <p className="president-role">

                  {settings[en ? "founderTitleEn" : "founderTitleFr"]}

                </p>

                <p className="president-location">

                  {settings[en ? "locationEn" : "locationFr"]}

                </p>

                <p>{settings[en ? "founderIntroEn" : "founderIntroFr"]}</p>

                {(en ? settings.founderBioEn : settings.founderBioFr) && (

                  <p>{en ? settings.founderBioEn : settings.founderBioFr}</p>

                )}

                <div className="president-message">
                  <p className="eyebrow">{t("MESSAGE DU PRÉSIDENT", "PRESIDENT’S MESSAGE")}</p>
                  <p>
                    {t(
                      "Chez Longla Marine & Heavy Industries Canada, nous croyons que le développement industriel et maritime repose sur une vision claire, des partenariats solides et une volonté constante de bâtir des solutions durables.",
                      "At Longla Marine & Heavy Industries Canada, we believe that marine and industrial development is built on a clear vision, strong partnerships and a constant commitment to building lasting solutions.",
                    )}
                  </p>
                  <p>
                    {t(
                      "Notre ambition est de contribuer au développement de projets dans les secteurs maritime et industriel, en mettant l’accent sur la qualité, le professionnalisme, la collaboration et l’adaptation aux besoins de nos partenaires.",
                      "Our ambition is to contribute to projects in the marine and industrial sectors, with an emphasis on quality, professionalism, collaboration and adapting to our partners’ needs.",
                    )}
                  </p>
                  <p>
                    {t(
                      "Établie à Québec, LMHI porte une vision ouverte sur l’ensemble du Canada. Nous souhaitons construire des relations de confiance, développer des collaborations durables et participer activement aux initiatives qui façonnent l’avenir de ces secteurs.",
                      "Based in Québec City, LMHI has a vision that reaches across Canada. We aim to build relationships of trust, develop lasting collaborations and actively contribute to initiatives shaping the future of these sectors.",
                    )}
                  </p>
                  <p>
                    {t(
                      "Je tiens à remercier nos partenaires, nos collaborateurs et toutes les personnes qui accordent leur confiance à notre entreprise. Ensemble, construisons des projets solides et tournés vers l’avenir.",
                      "I would like to thank our partners, collaborators and everyone who places their trust in our company. Together, let us build strong projects focused on the future.",
                    )}
                  </p>
                  <div className="president-signature">
                    <strong>{settings.founderName || defaultSettings.founderName}</strong>
                    <span>{settings[en ? "founderTitleEn" : "founderTitleFr"]}</span>
                    <span>Longla Marine & Heavy Industries Canada</span>
                  </div>
                </div>

              </div>

            </section>

            <section className="section wrap leadership-vision">
              <div className="section-head">
                <div>
                  <p className="eyebrow">
                    {t("LA VISION DU PRÉSIDENT", "THE PRESIDENT’S VISION")}
                  </p>
                  <h2>
                    {t(
                      "Construire aujourd’hui.\nPréparer demain.",
                      "Building today.\nPreparing for tomorrow.",
                    )}
                  </h2>
                </div>
                <p>
                  {t(
                    "Une ambition portée par la collaboration, la qualité du travail et le développement de relations durables.",
                    "An ambition driven by collaboration, quality workmanship and the development of lasting relationships.",
                  )}
                </p>
              </div>

              <div className="why-grid">
                <div>
                  <h3>{t("Notre vision", "Our vision")}</h3>
                  <p>
                    {t(
                      "Contribuer au développement des secteurs maritime et industriel grâce à des solutions adaptées aux réalités des projets.",
                      "Contribute to the development of the marine and industrial sectors through solutions tailored to project requirements.",
                    )}
                  </p>
                </div>
                <div>
                  <h3>{t("Nos valeurs", "Our values")}</h3>
                  <p>
                    {t(
                      "Faire de la sécurité, de la qualité, de la fiabilité et du professionnalisme les repères de chacune de nos interventions.",
                      "Make safety, quality, reliability and professionalism the guiding principles of our work.",
                    )}
                  </p>
                </div>
                <div>
                  <h3>{t("Nos engagements", "Our commitments")}</h3>
                  <p>
                    {t(
                      "Établir des collaborations solides, comprendre les besoins de nos partenaires et contribuer à des projets porteurs.",
                      "Build strong collaborations, understand our partners’ needs and contribute to meaningful projects.",
                    )}
                  </p>
                </div>
              </div>

              <div className="values-grid leadership-values">
                {values.map((v, k) => (
                  <div key={k}>
                    <Check size={19} />
                    {v[i]}
                  </div>
                ))}
              </div>
            </section>

            <Cta en={en} href={href} />

          </>

        )}

        {division && (

          <>

            <PageHero

              eyebrow={t("NOS DIVISIONS", "OUR DIVISIONS")}

              title={division.name[i]}

              description={division.intro[i]}

              image={

                ["maritime", "industrie-lourde"].includes(route)

                  ? route === "maritime"

                    ? "/images/port.jpg"

                    : "/images/welding.jpg"

                  : undefined

              }

            />

            <section className="section wrap service-layout">

              <div>

                <p className="eyebrow">

                  {t("NOTRE CHAMP D’INTERVENTION", "OUR SCOPE")}

                </p>

                <h2>

                  {t(

                    "Des solutions adaptées\nà votre projet.",

                    "Solutions tailored\nto your project.",

                  )}

                </h2>

                {division.developing && (

                  <div className="status-note">

                    <Construction size={23} />

                    <div>

                      <strong>

                        {t(

                          "Division en développement",

                          "Division in development",

                        )}

                      </strong>

                      <p>

                        {t(

                          "La capacité opérationnelle est en cours de développement. Contactez-nous pour discuter de votre besoin et confirmer la disponibilité.",

                          "Operational capabilities are being developed. Contact us to discuss your needs and confirm availability.",

                        )}

                      </p>

                    </div>

                  </div>

                )}

              </div>

              <div className="service-list">

                {division.services.map((s, k) => (

                  <div key={k}>

                    <span>0{k + 1}</span>

                    <h3>{s[i]}</h3>

                    <Check size={18} />

                  </div>

                ))}

              </div>

            </section>

            {division.regulated && (

              <div className="wrap regulatory">

                <ShieldCheck size={24} />

                <p>

                  {t(

                    "Ces services sont disponibles uniquement lorsque les permis, licences, accréditations et autres autorisations réglementaires applicables ont été obtenus. La disponibilité et le périmètre de chaque intervention doivent être confirmés avec LMHI.",

                    "These services are available only once the applicable permits, licences, accreditations and other regulatory authorizations have been obtained. Availability and the scope of each intervention must be confirmed with LMHI.",

                  )}

                </p>

              </div>

            )}

            <section className="section wrap process">

              <p className="eyebrow">

                {t(

                  "DE VOTRE BESOIN À L’INTERVENTION",

                  "FROM YOUR NEED TO THE INTERVENTION",

                )}

              </p>

              <div className="process-grid">

                {[

                  [

                    t("Définir le besoin", "Define the need"),

                    t(

                      "Préciser les travaux, le lieu, l’échéancier et les exigences du projet.",

                      "Outline the work, location, schedule and project requirements.",

                    ),

                  ],

                  [

                    t("Confirmer les ressources", "Confirm resources"),

                    t(

                      "Évaluer les compétences, la disponibilité et les autorisations requises.",

                      "Assess the skills, availability and authorizations required.",

                    ),

                  ],

                  [

                    t("Organiser l’intervention", "Organize the intervention"),

                    t(

                      "Convenir du périmètre et des conditions avant toute mobilisation.",

                      "Agree on the scope and conditions before mobilization.",

                    ),

                  ],

                ].map(([a, b], k) => (

                  <div key={a}>

                    <span>0{k + 1}</span>

                    <h3>{a}</h3>

                    <p>{b}</p>

                  </div>

                ))}

              </div>

            </section>

            <Cta en={en} href={href} service={division.name[i]} />

          </>

        )}

        {["soumission", "carrieres", "partenaires", "contact"].includes(

          route,

        ) && (

          <>

            <PageHero

              eyebrow={

                route === "carrieres"

                  ? t("CARRIÈRES", "CAREERS")

                  : route === "partenaires"

                    ? t("FOURNISSEURS & PARTENAIRES", "SUPPLIERS & PARTNERS")

                    : t(

                        "PARLONS DE VOTRE PROJET",

                        "LET’S TALK ABOUT YOUR PROJECT",

                      )

              }

              title={

                route === "carrieres"

                  ? t(

                      "Votre expertise.\nNotre prochaine force.",

                      "Your expertise.\nOur next strength.",

                    )

                  : route === "partenaires"

                    ? t(

                        "Construisons des\npartenariats durables.",

                        "Let’s build\nlasting partnerships.",

                      )

                    : route === "soumission"

                      ? t(

                          "Un projet à réaliser ?\nParlons-en.",

                          "A project in mind?\nLet’s talk.",

                        )

                      : t("Entrons en contact.", "Let’s connect.")

              }

              description={

                route === "carrieres"

                  ? t(

                      "Soudeurs, mécaniciens, personnel maritime et métiers spécialisés : faites-nous connaître vos compétences.",

                      "Welders, mechanics, marine personnel and skilled trades: tell us about your expertise.",

                    )

                  : route === "partenaires"

                    ? t(

                        "Entreprises, fournisseurs et partenaires techniques : présentez votre savoir-faire et explorons les possibilités de collaboration.",

                        "Businesses, suppliers and technical partners: introduce your expertise and explore opportunities to collaborate.",

                      )

                    : t(

                        "Précisez votre besoin. Nous pourrons évaluer les possibilités d’accompagnement et la disponibilité des ressources.",

                        "Tell us what you need so we can assess support options and resource availability.",

                      )

              }

            />

            {route === "carrieres" && (

              <section className="wrap jobs-section">

                <p className="eyebrow">

                  {t("POSTES À POURVOIR", "CURRENT OPPORTUNITIES")}

                </p>

                {settings.jobs?.length ? (

                  <div className="job-grid">

                    {settings.jobs.map((job) => (

                      <article key={job.id} className="job">

                        <span>

                          <MapPin size={16} />

                          {job.location}

                        </span>

                        <h3>{en ? job.titleEn : job.titleFr}</h3>

                        <p>{en ? job.bodyEn : job.bodyFr}</p>

                        <a

                          href={"#formulaire"}

                          className="text-link"

                          onClick={() =>

                            window.dispatchEvent(

                              new CustomEvent("selectJob", {

                                detail: en ? job.titleEn : job.titleFr,

                              }),

                            )

                          }

                        >

                          {t("Postuler", "Apply")}

                          <Plus size={17} />

                        </a>

                      </article>

                    ))}

                  </div>

                ) : (

                  <div className="empty-state">

                    <HardHat size={28} />

                    <div>

                      <h3>

                        {t(

                          "Faites partie de notre réseau de talents.",

                          "Join our talent network.",

                        )}

                      </h3>

                      <p>

                        {t(

                          "Aucun poste précis n’est publié pour le moment. Les candidatures spontanées sont les bienvenues.",

                          "No specific positions are currently posted. Unsolicited applications are welcome.",

                        )}

                      </p>

                    </div>

                  </div>

                )}

              </section>

            )}

            <section className="section wrap form-layout" id="formulaire">

              <aside>

                <p className="eyebrow">

                  {route === "carrieres"

                    ? t("CANDIDATURE", "APPLICATION")

                    : route === "partenaires"

                      ? t("COLLABORATION", "COLLABORATION")

                      : t("VOTRE DEMANDE", "YOUR REQUEST")}

                </p>

                <h2>

                  {route === "carrieres"

                    ? t("Présentez votre profil.", "Introduce yourself.")

                    : route === "partenaires"

                      ? t(

                          "Présentez votre entreprise.",

                          "Introduce your business.",

                        )

                      : t(

                          "Chaque projet commence\npar un échange.",

                          "Every project begins\nwith a conversation.",

                        )}

                </h2>

                <p>

                  {t(

                    "Les informations transmises sont utilisées pour traiter votre demande.",

                    "Information submitted is used to process your request.",

                  )}

                </p>

                <div className="form-info">

                  <FileText size={22} />

                  <div>

                    <strong>{t("Pièces jointes", "Attachments")}</strong>

                    <p>

                      {t(

                        "PDF, DOCX, JPG ou PNG. Jusqu’à 3 fichiers, 10 Mo par fichier et 15 Mo au total.",

                        "PDF, DOCX, JPG or PNG. Up to 3 files, 10 MB per file and 15 MB total.",

                      )}

                    </p>

                  </div>

                </div>

                {(settings.email || settings.phone || settings.address) && (

                  <div className="contact-details">

                    {settings.founderName && (

                      <div className="founder-contact">

                        <strong>{settings.founderName}</strong>

                        <span>

                          {settings[en ? "founderTitleEn" : "founderTitleFr"]}

                        </span>

                      </div>

                    )}

                    {settings[en ? "locationEn" : "locationFr"] && (

                      <p>

                        <MapPin size={19} />

                        {settings[en ? "locationEn" : "locationFr"]}

                      </p>

                    )}

                    {settings.email && (

                      <a href={"mailto:" + settings.email}>

                        <Mail size={19} />

                        {settings.email}

                      </a>

                    )}

                    {settings.phone && (

                      <a href={"tel:" + settings.phone.replace(/[^+\d]/g, "")}>

                        <Phone size={19} />

                        {settings.phone}

                      </a>

                    )}

                    {settings.address && (

                      <p>

                        <MapPin size={19} />

                        {settings.address}

                      </p>

                    )}

                  </div>

                )}

                <div className="territory">

                  <MapPin size={18} />

                  {t("Québec et Canada", "Québec and Canada")}

                </div>

              </aside>

              <RequestForm

                kind={

                  route === "carrieres"

                    ? "career"

                    : route === "partenaires"

                      ? "partner"

                      : route === "soumission"

                        ? "quote"

                        : "contact"

                }

                en={en}

                divisions={ds}

              />

            </section>

            {route === "partenaires" && (

              <section className="values-section">

                <div className="wrap">

                  <p className="eyebrow">

                    {t(

                      "UNE COLLABORATION RESPONSABLE",

                      "RESPONSIBLE COLLABORATION",

                    )}

                  </p>

                  <h2>

                    {t(

                      "Un cadre clair pour avancer ensemble.",

                      "A clear framework for working together.",

                    )}

                  </h2>

                  <p>

                    {t(

                      "Les possibilités de partenariat sont évaluées selon les besoins des projets, les compétences proposées, la qualité et les autorisations applicables. L’envoi du formulaire ne constitue pas un accord commercial.",

                      "Partnership opportunities are assessed according to project needs, proposed skills, quality and applicable authorizations. Submitting the form does not constitute a business agreement.",

                    )}

                  </p>

                </div>

              </section>

            )}

          </>

        )}

        {route === "projets" && (

          <>

            <PageHero

              eyebrow={t("PROJETS / ACTUALITÉS", "PROJECTS / NEWS")}

              title={t(

                "L’activité LMHI.\nAu fil des projets.",

                "LMHI in action.\nProject by project.",

              )}

              description={t(

                "Retrouvez ici les projets, les nouvelles et les étapes de développement dont la publication a été autorisée.",

                "Explore projects, news and development milestones approved for publication.",

              )}

            />

            <News posts={settings.posts || []} en={en} />

            <Brochures settings={settings} en={en} />

            <Cta en={en} href={href} />

          </>

        )}

        {route === "confidentialite" && (

          <>

            <PageHero

              eyebrow={t("CONFIDENTIALITÉ", "PRIVACY")}

              title={t(

                "Vos renseignements.\nUn usage défini.",

                "Your information.\nA defined purpose.",

              )}

              description={t(

                "Information sur les données transmises par les formulaires LMHI.",

                "Information about data submitted through LMHI forms.",

              )}

            />

            <section className="section wrap legal">

              <h2>

                {t("Les informations recueillies", "Information collected")}

              </h2>

              <p>

                {t(

                  "Les formulaires recueillent les coordonnées et renseignements nécessaires à votre demande de soumission, candidature, proposition de partenariat ou message. Les pièces jointes sont facultatives. Ne transmettez pas de numéro d’assurance sociale, de coordonnées bancaires ni de document d’identité.",

                  "The forms collect contact details and information needed for your quote request, application, partnership proposal or message. Attachments are optional. Do not submit social insurance numbers, banking information or identity documents.",

                )}

              </p>

              <h3>{t("Utilisation et accès", "Use and access")}</h3>

              <p>

                {t(

                  "Les demandes et fichiers sont enregistrés dans un espace de gestion à accès restreint pour leur traitement par LMHI. Un comptage agrégé des pages vues est effectué sans cookies ni profil de visiteur. Aucun outil publicitaire ou Google Analytics n’est activé.",

                  "Requests and files are stored in a restricted management area for processing by LMHI. Page views are counted in aggregate, without cookies or visitor profiles. No advertising tools or Google Analytics are activated.",

                )}

              </p>

              <h3>

                {t("Avant la mise en ligne publique", "Before public launch")}

              </h3>

              <p>

                {t(

                  "Les coordonnées du responsable de la protection des renseignements personnels, les modalités d’exercice de vos droits et la durée de conservation seront précisées avant la publication finale.",

                  "The privacy officer’s contact details, how to exercise your rights and the retention period will be specified before final publication.",

                )}

              </p>

            </section>

          </>

        )}

        {route === "gestion" && <Admin en={en} divisions={ds} />}

      </main>

      <footer>

        <div className="wrap footer-top">

          <div className="footer-brand">

            <a href={href("accueil")} className="brand">

              <span className="brand-word">

                LMHI

                <span className="brand-square" />

              </span>

              <span className="brand-desc">

                LONGLA MARINE &<br />

                HEAVY INDUSTRIES CANADA

              </span>

            </a>

            <p>

              {t(

                "La force canadienne,\ndu métal aux océans.",

                "Canadian strength,\nfrom steel to the oceans.",

              )}

            </p>

            <span>QUÉBEC · CANADA</span>

          </div>

          <div>

            <h3>{t("Nos divisions", "Our divisions")}</h3>

            {ds.map((d) => (

              <a key={d.slug} href={href(d.slug)}>

                {d.name[i]}

              </a>

            ))}

          </div>

          <div>

            <h3>{t("LMHI Canada", "LMHI Canada")}</h3>

            {["a-propos", "direction", "projets", "carrieres", "partenaires"].map((r) => (

              <a key={r} href={href(r)}>

                {label(r)}

              </a>

            ))}

            <a href={href("gestion")}>{t("Espace LMHI", "LMHI workspace")}</a>

          </div>

          <div>

            <h3>

              {t("Parlons de votre projet", "Let’s talk about your project")}

            </h3>

            <a className="footer-quote" href={href("soumission")}>

              {t("Demander une soumission", "Request a quote")}

            </a>

            <a href={href("contact")}>{t("Nous contacter", "Contact us")}</a>

            {settings.linkedin &&

              /^https:\/\/(www\.)?linkedin\.com\//.test(settings.linkedin) && (

                <a

                  href={settings.linkedin}

                  target="_blank"

                  rel="noopener noreferrer"

                >

                  <Linkedin size={17} /> LinkedIn

                </a>

              )}

          </div>

        </div>

        <div className="wrap footer-bottom">

          <span>

            © {new Date().getFullYear()} Longla Marine & Heavy Industries Canada

          </span>

          <a href={href("confidentialite")}>

            {t("Confidentialité", "Privacy")}

          </a>

          <a

            href={

              en

                ? route === "accueil"

                  ? "/"

                  : "/" + route

                : "/en" + (route === "accueil" ? "" : "/" + route)

            }

          >

            {en ? "Français" : "English"}

          </a>

        </div>

        <div className="wrap photo-credit">

          {t("Photos d’illustration :", "Illustrative photography:")}{" "}

          <a

            href="https://unsplash.com/photos/A0IOJ34brD0"

            target="_blank"

            rel="noreferrer"

          >

            Daniel Miksha / Unsplash

          </a>{" "}

          ·{" "}

          <a

            href="https://www.sulyokimaging.ro"

            target="_blank"

            rel="noreferrer"

          >

            Adrian Sulyok

          </a>{" "}

          {t(

            "— ne représentent pas des réalisations LMHI.",

            "— do not depict LMHI projects.",

          )}

        </div>

      </footer>

    </>

  );

}
