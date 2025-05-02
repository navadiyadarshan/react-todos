import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the service worker when a new version is deployed
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'], // Include your assets here
      manifest: {
        name: 'To dos',
        short_name: 'todos',
        description: 'This is a to-do list app.',
        start_url: '/',
        display: 'standalone', // Fullscreen experience without browser UI
        background_color: '#2A2A2A',
        theme_color: '#2A2A2A',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '192x192',
            type: 'image/x-icon'
          },
          {
            src: 'favicon.ico',
            sizes: '512x512',
            type: 'image/x-icon'
          }
        ]
      },
      workbox: {
        // Workbox configuration to handle caching strategies
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg}'],
      },
    })
  ]
})
