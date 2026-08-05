import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/', // Fixes 404 path issues on production builds
  preview: {
    port: 8080,
    host: '0.0.0.0'
  }
})
