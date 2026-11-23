import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // GitHub Pages serves the app from this path (ADR-0008).
  base: command === 'build' || isPreview ? '/mwx-sengoku-app/' : '/',
  plugins: [react(), tailwindcss()],
  worker: { format: 'es' }, // MapLibre starts its worker as a module
}))
