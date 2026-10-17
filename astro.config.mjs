import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://peak-automations.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  devToolbar: { enabled: false },
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
