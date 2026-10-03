// Site-wide settings.

// DRAFT=true (`npm run dev:draft`, `npm run build:draft`) marks every empty field as "to fill".
// Otherwise empty fields and sections are hidden.
export const DRAFT = process.env.DRAFT === 'true';

// Project categories and their labels, in the order of the filter chips.
export const CATEGORIES = {
  emb: { en: 'Embedded & robotics', fr: 'Embarqué & robotique' },
  ai: { en: 'AI & machine learning', fr: 'IA & machine learning' },
  llm: { en: 'LLM & automation', fr: 'LLM & automatisation' },
  data: { en: 'Data science', fr: 'Data science' },
  net: { en: 'Networking', fr: 'Réseau' },
  sys: { en: 'Systems & concurrency', fr: 'Systèmes & concurrence' },
  lang: { en: 'Languages & VMs', fr: 'Langages & VM' },
  lib: { en: 'Libraries & data structures', fr: 'Bibliothèques & structures de données' },
  algo: { en: 'Algorithms & maths', fr: 'Algorithmique & maths' },
  gfx: { en: 'Graphics & 3D', fr: 'Graphisme & 3D' },
  game: { en: 'Games', fr: 'Jeux' },
  web: { en: 'Web & DevOps', fr: 'Web & DevOps' },
  work: { en: 'Professional', fr: 'Professionnel' },
  other: { en: 'Other', fr: 'Autre' },
} as const;
