import { defineConfig } from 'astro/config';

// User site served from the domain root, so no `base`.
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
