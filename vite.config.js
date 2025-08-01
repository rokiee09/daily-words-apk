import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Daily Words",
        short_name: "Words",
        description: "Her gün 5 yeni İngilizce kelime öğren!",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#007bff",
        scope: "/",
        lang: "tr",
        orientation: "portrait",
        icons: [
          {
            src: "/daily-words-logo.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/daily-words-logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  publicDir: 'public',
  build: {
    outDir: 'dist'
  }
})
