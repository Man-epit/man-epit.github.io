import { getCollection } from 'astro:content';
import { CATEGORIES } from './config';
import type { Lang } from './i18n/ui';

type Loc<T> = T | { en: T; fr: T };

// Pick the right language from a plain value or an { en, fr } object.
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

// Fail the build on a typo in `related`.
export const resolveRelated = (slugs: string[], projects: Awaited<ReturnType<typeof getProjects>>, from: string) =>
  slugs.map((s) => projects.find((p) => p.data.slug === s) ?? (() => { throw new Error(`${from}: unknown related project "${s}"`); })());
