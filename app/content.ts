
export type Lang = "fr" | "en";

export type Division = {
  slug: string;
  name: string[];
  intro: string[];
  services: string[][];
  icon: string;
  developing?: boolean;
  regulated?: boolean;
};

export const divisions: Division[] = [
  {
    slug: "maritime",
    name: ["Maritime", "Marine services"],
    icon: "anchor",
    intro: [
      "L’expertise technique au service de vos opérations maritimes.",
      "Technical expertise supporting your marine operations.",
    ],
    services: [
      ["Réparation et maintenance navale", "Vessel repair and maintenance"],
      ["Soudage et travaux métalliques maritimes", "Marine welding and metalwork"],
      ["Mécanique navale", "Marine mechanical services"],
      ["Entretien et réparation d’équipements", "Equipment maintenance and repair"],
      ["Soutien technique aux navires et installations maritimes", "Technical support for vessels and marine facilities"],
      ["Mobilisation de main-d’œuvre spécialisée", "Skilled workforce mobilization"],
      ["Interventions planifiées ou urgentes", "Scheduled or urgent interventions"],
    ],
  },
  {
    slug: "industrie-lourde",
    name: ["Industrie lourde", "Heavy industry"],
    icon: "factory",
    intro: [
      "Des compétences réunies pour vos environnements industriels exigeants.",
      "Coordinated skills for demanding industrial environments.",
    ],
    services: [
      ["Soudage industriel", "Industrial welding"],
      ["Fabrication et réparation métallique", "Metal fabrication and repair"],
      ["Fabrication de pièces métalliques", "Metal parts fabrication"],
      ["Assemblage mécanique", "Mechanical assembly"],
      ["Maintenance d’équipements industriels", "Industrial equipment maintenance"],
      ["Travaux sur structures métalliques", "Steel structure work"],
      ["Soutien aux arrêts d’usine et travaux de maintenance", "Plant shutdown and maintenance support"],
      ["Main-d’œuvre spécialisée pour projets industriels", "Skilled labour for industrial projects"],
    ],
  },
  {
    slug: "signalisation",
    name: ["Signalisation routière", "Traffic control"],
    icon: "traffic",
    regulated: true,
    intro: [
      "Accompagner les travaux et la sécurisation des zones d’intervention.",
      "Supporting road works and safe work zones.",
    ],
    services: [
      ["Services de signalisation de travaux routiers", "Road work traffic control"],
      ["Signaleurs routiers", "Traffic control personnel"],
      ["Soutien à la sécurisation des zones de travaux", "Work zone safety support"],
      ["Services aux entrepreneurs et projets d’infrastructure", "Support for contractors and infrastructure projects"],
    ],
  },
  {
    slug: "securite",
    name: ["Sécurité privée", "Private security"],
    icon: "shield",
    developing: true,
    regulated: true,
    intro: [
      "Une division en développement pour les environnements industriels, commerciaux et de chantier.",
      "A division in development for industrial, commercial and construction environments.",
    ],
    services: [
      ["Développement de services adaptés aux besoins industriels", "Development of services for industrial needs"],
      ["Besoins commerciaux et de chantier", "Commercial and construction site needs"],
      ["Disponibilité conditionnelle aux permis et licences applicables", "Availability subject to applicable permits and licences"],
    ],
  },
  {
    slug: "remorquage",
    name: ["Remorquage terrestre", "Heavy vehicle assistance"],
    icon: "truck",
    developing: true,
    regulated: true,
    intro: [
      "Développement d’une capacité d’assistance aux véhicules commerciaux et équipements lourds.",
      "Developing assistance capabilities for commercial vehicles and heavy equipment.",
    ],
    services: [
      ["Développement de services de remorquage terrestre", "Development of ground towing services"],
      ["Assistance aux véhicules commerciaux", "Commercial vehicle assistance"],
      ["Soutien aux équipements lourds", "Heavy equipment support"],
    ],
  },
  {
    slug: "main-doeuvre",
    name: ["Main-d’œuvre spécialisée", "Skilled workforce"],
    icon: "users",
    regulated: true,
    intro: [
      "Les bonnes compétences, mobilisées selon les besoins de vos projets.",
      "The right skills, mobilized to meet your project needs.",
    ],
    services: [
      ["Soudeurs", "Welders"],
      ["Mécaniciens", "Mechanics"],
      ["Personnel maritime", "Marine personnel"],
      ["Personnel industriel", "Industrial personnel"],
      ["Signaleurs routiers", "Traffic control personnel"],
      ["Autres métiers spécialisés selon les projets", "Other skilled trades according to project needs"],
    ],
  },
];

export const markets = [
  ["Chantiers navals et armateurs", "Shipyards and shipowners"],
  ["Ports et terminaux maritimes", "Ports and marine terminals"],
  ["Industries lourdes et manufacturières", "Heavy and manufacturing industries"],
  ["Secteurs minier et forestier", "Mining and forestry"],
  ["Entrepreneurs et infrastructures", "Contractors and infrastructure"],
  ["Municipalités et sociétés d’État", "Municipalities and Crown corporations"],
  ["Gouvernements provincial et fédéral", "Provincial and federal governments"],
  ["Défense et chaîne d’approvisionnement navale", "Defence and naval supply chains"],
];

export const values = [
  ["Sécurité", "Safety"],
  ["Qualité", "Quality"],
  ["Fiabilité", "Reliability"],
  ["Professionnalisme", "Professionalism"],
  ["Innovation", "Innovation"],
  ["Réactivité", "Responsiveness"],
  ["Collaboration", "Collaboration"],
  ["Relations d’affaires durables", "Lasting business relationships"],
];

export type Post = {
  id: string;
  type: "project" | "news";
  titleFr: string;
  titleEn: string;
  bodyFr: string;
  bodyEn: string;
  date: string;
};

export type Job = {
  id: string;
  titleFr: string;
  titleEn: string;
  bodyFr: string;
  bodyEn: string;
  location: string;
};

export type Settings = {
  founderName?: string;
  founderTitleFr?: string;
  founderTitleEn?: string;

  // Présentation du président
  founderIntroFr?: string;
  founderIntroEn?: string;
  founderMessageFr?: string;
  founderMessageEn?: string;
  founderBioFr?: string;
  founderBioEn?: string;
  founderImage?: string;

  locationFr?: string;
  locationEn?: string;
  phone?: string;
  email?: string;
  address?: string;
  linkedin?: string;
  aboutFr?: string;
  aboutEn?: string;
  heroFr?: string;
  heroEn?: string;
  posts?: Post[];
  jobs?: Job[];
  associations?: {
    name: string;
    url: string;
    authorized: boolean;
  }[];
  brochures?: {
    name: string;
    url: string;
  }[];
  divisions?: Division[];
};

export const defaultSettings: Settings = {
  phone: "(581) 994-6819",
  email: "longlajoe@gmail.com",

  founderName: "Joe Pharleys Longla Pafoule",
  founderTitleFr: "Président-fondateur",
  founderTitleEn: "President & Founder",

  founderIntroFr:
    "À la tête de Longla Marine & Heavy Industries Canada, Joe Pharleys Longla Pafoule porte une vision entrepreneuriale tournée vers le développement industriel et maritime ainsi que la création de partenariats durables.",

  founderIntroEn:
    "As the President and Founder of Longla Marine & Heavy Industries Canada, Joe Pharleys Longla Pafoule leads an entrepreneurial vision focused on industrial and maritime development and lasting partnerships.",

  founderMessageFr:
    "Construire des collaborations solides, développer des solutions adaptées aux besoins de nos partenaires et contribuer à des projets porteurs dans les secteurs maritime et industriel.",

  founderMessageEn:
    "Building strong collaborations, developing solutions tailored to our partners' needs, and contributing to meaningful projects across the maritime and industrial sectors.",

  founderBioFr: "",
  founderBioEn: "",
  founderImage: "/images/president.jpg",

  locationFr: "Québec, Québec, Canada",
  locationEn: "Québec City, Québec, Canada",

  aboutFr:
    "Longla Marine & Heavy Industries Canada est une entreprise canadienne basée à Québec, spécialisée dans la fabrication métallique, le soudage industriel et la maintenance d’équipements industriels et maritimes. L’entreprise offre des services de fabrication de pièces métalliques, d’assemblage mécanique, de réparation de structures, de travaux de soudure, de maintenance industrielle et de support technique pour des projets d’infrastructures et d’équipements.\n\nNotre entreprise est ouverte à collaborer avec des entrepreneurs généraux, des fabricants et des partenaires industriels afin de fournir des services de fabrication, de réparation et de maintenance dans le cadre de projets publics et privés. Longla Marine & Heavy Industries Canada vise à développer des partenariats avec des entreprises canadiennes afin de participer à des projets d’infrastructures, industriels et maritimes partout au Canada.",

  aboutEn:
    "Longla Marine & Heavy Industries Canada is a Canadian company based in Québec City, specializing in metal fabrication, industrial welding, and the maintenance of industrial and marine equipment. The company provides metal parts fabrication, mechanical assembly, structural repairs, welding, industrial maintenance, and technical support for infrastructure and equipment projects.\n\nWe welcome collaboration with general contractors, manufacturers, and industrial partners to provide fabrication, repair, and maintenance services for public and private projects. Longla Marine & Heavy Industries Canada aims to develop partnerships with Canadian businesses to participate in infrastructure, industrial, and marine projects across Canada.",
};
