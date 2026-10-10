import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://aimug.org',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // Leave mermaid blocks as plain code so components/content/Mermaid.astro can draw them.
  markdown: { syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] } },
  integrations: [mdx(), sitemap({ filter: (p) => !/\/((un)?subscribe-|speak\/(thanks|release)\/)/.test(p) })],
  vite: { plugins: [tailwindcss()] },
});
