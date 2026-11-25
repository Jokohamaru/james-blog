import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkMermaid } from './src/utils/remark-mermaid.mjs';

export default defineConfig({
  site: 'https://jokohamaru.github.io',
  base: '/james-blog',
  integrations: [
    expressiveCode({
      themes: ['github-light', 'github-dark-default'],
      themeCssSelector: (theme) =>
        theme.name === 'github-dark-default' ? '[data-theme="dark"]' : ':root:not([data-theme="dark"])',
      styleOverrides: {
        borderRadius: '0.5rem',
        codeFontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      },
    }),
    mdx(),
    sitemap(),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMermaid, remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
