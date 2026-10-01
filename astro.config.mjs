import { defineConfig } from 'astro/config';

// User site (<username>.github.io) → served from the root, no `base` needed.
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
