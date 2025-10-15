import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    // 1️⃣ React plugin first
    react({
      jsxRuntime: 'automatic',
      fastRefresh: false, // disables dev HMR in production
    }),

    // 2️⃣ PWA plugin after react
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'icons/icon-192x192.png',
        'icons/icon-512x512.png',
      ],
      devOptions: { enabled: false },
      workbox: { cleanupOutdatedCaches: true },
      manifest: {
        name: 'PM-AJAY SETU',
        short_name: 'AJAY SETU',
        start_url: '/',
        display: 'standalone',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        icons: [
          { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  // Tailwind will be processed via PostCSS (postcss.config.cjs)
  ],

  define: { __DEFINES__: {} },

  build: { target: 'esnext' },
})
