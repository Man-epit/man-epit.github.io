import { getCollection, type CollectionKey } from 'astro:content';
import fs from 'node:fs';
import { CATEGORIES } from './config';
import type { Lang } from './i18n/ui';

type Loc<T> = T | { en: T; fr: T };

// Value for the given language, from a plain value or an { en, fr } object.
export const L = <T>(v: Loc<T> | undefined, lang: Lang): T | '' => {
  if (v && typeof v === 'object' && !Array.isArray(v) && 'en' in v) return v[lang] ?? v.en;
  return (v as T) ?? '';
};

const byOrder = (a: { data: { order: number } }, b: { data: { order: number } }) => a.data.order - b.data.order;

// Featured first, then by `order`.
export const getProjects = async () =>
  (await getCollection('projects')).sort((a, b) => Number(b.data.featured) - Number(a.data.featured) || byOrder(a, b));

export const getEvents = async () => (await getCollection('events')).sort(byOrder);

export const getProfile = async () => (await getCollection('profile'))[0].data;

export const catLabel = (k: keyof typeof CATEGORIES, lang: Lang) => CATEGORIES[k][lang];
export const catLabels = (ks: (keyof typeof CATEGORIES)[], lang: Lang) => ks.map((k) => CATEGORIES[k][lang]).join(' / ');

// Throws on an unknown slug in `related`.
export const resolveRelated = (slugs: string[], projects: Awaited<ReturnType<typeof getProjects>>, from: string) =>
  slugs.map((s) => projects.find((p) => p.data.slug === s) ?? (() => { throw new Error(`${from}: unknown related project "${s}"`); })());

// The file() loader sorts entries by id, so restore the order of the YAML file.
export const inFileOrder = async <C extends CollectionKey>(name: C, path: string) => {
  const ids = [...fs.readFileSync(path, 'utf8').matchAll(/^- id: *(.+?) *$/gm)].map((m) => m[1].replace(/^["']|["']$/g, ''));
  return (await getCollection(name)).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
};

// Newest first, by the start date written in `when` ("02/2026 – now", "2023 – 2024", "2023").
const startOf = (when: string) => {
  const m = when.match(/(?:(\d{1,2})\/)?(\d{4})/);
  return m ? Number(m[2]) * 12 + Number(m[1] ?? 0) : 0;
};
const endOf = (when: string) => (/now|auj|présent/i.test(when) ? Infinity : startOf(when.split(/[–-]/).pop() ?? ''));
export const getExperience = async () =>
  (await getCollection('experience')).sort((a, b) => {
    const wa = L(a.data.when, 'en'), wb = L(b.data.when, 'en');
    return startOf(wb) - startOf(wa) || endOf(wb) - endOf(wa);
  });

// Collaborator names to { name, url }. Names missing from collaborators.yaml keep no link and log a warning.
export const resolveCollaborators = async (names: string[], from: string) => {
  const known = new Map((await getCollection('collaborators')).map((c) => [c.id.toLowerCase(), c.data.url]));
  return names.map((name) => {
    if (!known.has(name.toLowerCase()))
      console.warn(`[collaborators] ${from}: "${name}" is not in src/content/collaborators.yaml, shown without a link`);
    return { name, url: known.get(name.toLowerCase()) ?? '' };
  });
};
