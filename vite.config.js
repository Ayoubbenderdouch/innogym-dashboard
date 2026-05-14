import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// En dev → base '/', en build (GitHub Pages) → '/innogym-dashboard/'.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/innogym-dashboard/' : '/',
}))
