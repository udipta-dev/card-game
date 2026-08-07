/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// The base path depends on WHERE this is served from, and getting it wrong
// 404s every asset:
//   GitHub Pages project site -> https://user.github.io/card-game/  -> '/card-game/'
//   Cloudflare Pages          -> https://<project>.pages.dev/       -> '/'
// Cloudflare sets CF_PAGES during its build, so both hosts work from the same
// repo with no manual editing and no separate branch.
const base = process.env.CF_PAGES ? '/' : '/card-game/';

export default defineConfig({
  base,
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon.svg', 'icons/icon-maskable.svg'],
      manifest: {
        // The name is "18 Days" first and "Kurukshetra" second, deliberately.
        // Kurukshetra alone is esoteric to anyone who does not already know the
        // epic; eighteen days is a hook that needs no background at all, and it
        // is the war's actual length. The URL is unchanged.
        name: '18 Days · Kurukshetra',
        short_name: '18 Days',
        description:
          'A card battler of the Mahabharata. Eighteen days of war, fought three rounds at a time.',
        theme_color: '#0b0a12',
        background_color: '#0b0a12',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: 'icons/icon.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icons/icon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          {
            src: 'icons/icon-maskable.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@engine': '/src/engine',
      '@content': '/src/content',
      '@ai': '/src/ai',
      '@ui': '/src/ui',
      '@run': '/src/run',
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
