import type { APIRoute } from 'astro';
import { getProjects, getEvents } from '../lib';
import { LANGS } from '../i18n/ui';

// Every localized page. Language alternates are declared in each page's <head>.
export const GET: APIRoute = async ({ site }) => {
  const paths = [
    '',
    'projects/',
    'cv/',
    ...(await getProjects()).map((p) => `projects/${p.data.slug}/`),
    ...(await getEvents()).map((e) => `events/${e.data.slug}/`),
  ];
  const urls = LANGS.flatMap((l) => paths.map((p) => `  <url><loc>${new URL(`/${l}/${p}`, site)}</loc></url>`));
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
