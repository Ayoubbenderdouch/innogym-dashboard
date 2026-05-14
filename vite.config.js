import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// - Vercel (et dev) → base '/'
// - GitHub Pages    → base '/innogym-dashboard/'
// Vercel définit la variable d'env VERCEL=1 pendant le build.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base:
    command === 'build' && !process.env.VERCEL ? '/innogym-dashboard/' : '/',
}))
