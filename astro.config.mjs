import { defineConfig } from 'astro/config';

// Served from the root of the custom domain, so no `base`.
export default defineConfig({
  site: 'https://manny-bm.me',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
