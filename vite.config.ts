import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Project Pages are served from /<repo-name>/
  base: '/ai-bias-game/',
})
