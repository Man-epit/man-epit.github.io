import type { APIRoute } from 'astro';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { getProjects, getEvents } from '../lib';
import { LANGS } from '../i18n/ui';

const BUILD_DATE = new Date().toISOString();

// Date of the last commit touching these paths (needs full history in CI), else the build date.
const lastmod = (...paths: string[]) => {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cI', '--', ...paths], { encoding: 'utf8' }).trim() || BUILD_DATE;
  } catch {
    return BUILD_DATE;
  }
};

type Page = { path: string; lastmod: string; changefreq: string; priority: string };

export const GET: APIRoute = async ({ site }) => {
  const projects = await getProjects();
  const events = await getEvents();
  const pages: Page[] = [
    { path: '', lastmod: lastmod('src/content', 'src/pages', 'src/components', 'src/i18n'), changefreq: 'weekly', priority: '1.0' },
    { path: 'projects/', lastmod: lastmod('src/content/projects'), changefreq: 'weekly', priority: '0.9' },
    { path: 'cv/', lastmod: lastmod('public/cv'), changefreq: 'monthly', priority: '0.8' },
    ...projects.map((p) => ({
      path: `projects/${p.data.slug}/`,
      lastmod: lastmod(path.dirname(p.filePath!)),
      changefreq: 'monthly',
      priority: p.data.featured ? '0.8' : '0.6',
    })),
    ...events.map((e) => ({ path: `events/${e.data.slug}/`, lastmod: lastmod(path.dirname(e.filePath!)), changefreq: 'yearly', priority: '0.6' })),
  ];

  const url = (l: string, p: string) => new URL(`/${l}/${p}`, site).href;
  const entries = LANGS.flatMap((l) =>
    pages.map((p) =>
      [
        '  <url>',
        `    <loc>${url(l, p.path)}</loc>`,
        ...LANGS.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${url(alt, p.path)}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(LANGS[0], p.path)}"/>`,
        `    <lastmod>${p.lastmod}</lastmod>`,
        `    <changefreq>${p.changefreq}</changefreq>`,
        `    <priority>${p.priority}</priority>`,
        '  </url>',
      ].join('\n'),
    ),
  );

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
