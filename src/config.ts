// Site-wide settings.

// DRAFT=true (set by `npm run dev` and `npm run build:draft`) shows an orange "to fill"
// note for every empty field. Plain `npm run build` (used in CI) hides empty fields and sections.
export const DRAFT = process.env.DRAFT === 'true';

// Project categories: key → label. The order here is the order of the filter chips.
export const CATEGORIES = {
  emb: { en: 'Embedded', fr: 'Embarqué' },
  ai: { en: 'AI, ML & data', fr: 'IA, ML & data' },
  sys: { en: 'Systems & networking', fr: 'Systèmes & réseau' },
  low: { en: 'Low-level & VMs', fr: 'Bas niveau & VM' },
  algo: { en: 'Algorithms', fr: 'Algorithmique' },
  gfx: { en: 'Graphics & games', fr: 'Graphisme & jeux' },
  web: { en: 'Web, DevOps & infra', fr: 'Web, DevOps & infra' },
  work: { en: 'Professional', fr: 'Professionnel' },
  other: { en: 'Other', fr: 'Autre' },
} as const;
