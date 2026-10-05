/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// GitHub Pages phục vụ ở /<repo>/ → workflow đặt VITE_BASE=/<repo>/ lúc build; dev/local mặc định '/'
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'brand/logo.svg'],
      manifest: {
        name: 'NomNam',
        short_name: 'NomNam',
        description: 'Theo dõi calo, protein, chất xơ và vận động hằng ngày',
        lang: 'vi',
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#6A201A',
        theme_color: '#6A201A',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: `${base}index.html`,
      },
    }),
  ],
  build: {
    // Chunk chính ~245 kB gzip (react + supabase + motion); AI và biểu đồ đã tách lazy
    chunkSizeWarningLimit: 900,
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
