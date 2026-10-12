import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // GitHub project pages need /currency/; local dev and custom domains default to /.
  const base = env.VITE_BASE_PATH || (mode === 'development' ? '/' : '/currency/')

  return {
    base,
    plugins: [react(), tailwindcss()],
  }
})
