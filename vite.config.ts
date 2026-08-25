/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// `npm run dev` forwards API and data requests to a running SolarMonitor backend,
// production by default, or e.g. SOLMON_PROXY_TARGET=http://localhost for a local stack.
const proxyTarget = process.env.SOLMON_PROXY_TARGET ?? 'https://solmon.dias.ie'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    proxy: {
      '/api': { target: proxyTarget, changeOrigin: true },
      '/data': { target: proxyTarget, changeOrigin: true },
    },
  },
  test: {
    environment: 'node',
  },
})
