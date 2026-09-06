// @ts-check
import { defineConfig } from 'astro/config';
import { existsSync } from 'node:fs';

// https://astro.build/config
if (existsSync('.env')) process.loadEnvFile('.env');
const site = process.env.SITE_URL?.trim();
if (site && !/^https?:\/\//.test(site)) throw new Error('SITE_URL musi być pełnym adresem https://…');
export default defineConfig({
  site: site || undefined,
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
