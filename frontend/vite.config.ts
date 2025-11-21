import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png',
      ],
      manifest: {
        name: "Smartcivic",
        short_name: "Smartcivic",
        description: "Smartcivic – Complaint and Civic Issue Management System",
        theme_color: "#1a73e8",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            // Cache static assets
            urlPattern: ({ url }) => url.origin === self.location.origin,
            handler: "CacheFirst",
            options: {
              cacheName: "smartcivic-static-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              }
            }
          },
          {
            // Cache API calls to your backend
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: "NetworkFirst",
            options: {
              cacheName: "smartcivic-api-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              }
            }
          }
        ]
      }
    })
  ],

  base: '/',  // Keep Vercel SPA routing working

  optimizeDeps: {
    exclude: ['lucide-react'], // Keep your existing config
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
