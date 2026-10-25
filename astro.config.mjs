import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Production URL drives canonical links, the sitemap and JSON-LD ids; override with SITE_URL at build time.
export default defineConfig({
  site: process.env.SITE_URL || 'https://www.rohanhospitalknr.in',
  prefetch: true,
  integrations: [sitemap()],
});
