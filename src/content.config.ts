import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';
import { CATEGORIES } from './config';

// Any text can be a plain string (same in both languages) or { en, fr }.
const loc = <T extends z.ZodType>(t: T) => z.union([t, z.object({ en: t, fr: t })]);
const text = loc(z.string());

// type: image | clip (short muted MP4) | youtube (src = video id).
// src: file name in the entry's media/ folder (empty: dashed placeholder in draft mode).
const media = z.object({
  type: z.enum(['image', 'clip', 'youtube']),
  src: z.string().default(''),
  poster: z.string().optional(),
  caption: text.optional(),
});

const SECTIONS = ['specs', 'context', 'did', 'results', 'gallery', 'learned', 'links', 'stack', 'skills', 'collaborators', 'related'] as const;

// Fields shared by projects and events (all optional).
const detail = {
  slug: z.string(),
  order: z.number().default(1000),
  summary: text.optional(),
  role: text.optional(),
  contextText: text.optional(),
  contributions: loc(z.array(z.string())).optional(),
  results: z.array(z.object({ v: text, l: text })).default([]),
  tags: z.array(z.string()).default([]),
  skills: z.array(text).default([]),
  media: z.array(media).default([]),
  links: z.array(z.object({ label: text, url: z.string().default(''), soon: z.boolean().default(false) })).default([]),
  related: z.array(z.string()).default([]),
  collaborators: z.array(z.string()).default([]), // names, looked up in collaborators.yaml
  hide: z.array(z.enum(SECTIONS)).default([]),
  learned: text.optional(),
};

const projects = defineCollection({
  loader: glob({ pattern: '*/index.yaml', base: './src/content/projects' }),
  schema: z.object({
    ...detail,
    title: text,
    categories: z.array(z.enum(Object.keys(CATEGORIES) as [keyof typeof CATEGORIES])).min(1),
    year: z.string().optional(),
    status: z.enum(['done', 'progress', 'delivered']).default('done'),
    featured: z.boolean().default(false),
    team: text.optional(),
    context: text.optional(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '*/index.yaml', base: './src/content/events' }),
  schema: z.object({
    ...detail,
    name: text,
    result: text,
    when: text.optional(),
    format: text.optional(),
  }),
});

const experience = defineCollection({
  loader: file('src/content/experience.yaml'),
  schema: z.object({ type: z.enum(['work', 'edu']), when: text, org: text, role: text, note: text.optional() }),
});

const skills = defineCollection({
  loader: file('src/content/skills.yaml'),
  schema: z.object({ group: text, items: z.array(z.string()) }),
});

const leadership = defineCollection({
  loader: file('src/content/leadership.yaml'),
  schema: z.object({ role: text, when: text, text }),
});

const press = defineCollection({
  loader: file('src/content/press.yaml'),
  schema: z.object({ outlet: z.string(), title: text, when: text, url: z.string() }),
});

// Collaborators: name and profile link.
const collaborators = defineCollection({
  loader: file('src/content/collaborators.yaml'),
  schema: z.object({ url: z.string().default('') }),
});

const profile = defineCollection({
  loader: file('src/content/profile/index.yaml'),
  schema: z.object({
    name: z.string(),
    pitch: text,
    location: z.string(),
    coords: z.string(),
    email: z.string(),
    linkedin: z.string(),
    github: z.string().default(''),
    cv: z.object({ en: z.string(), fr: z.string() }),
    portrait: media,
    pressPhoto: media,
  }),
});

export const collections = { projects, events, experience, skills, leadership, press, profile, collaborators };
