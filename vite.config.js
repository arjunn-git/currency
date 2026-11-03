import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const hasCname = fs.existsSync(path.resolve(process.cwd(), 'public', 'CNAME'))
  // If custom domain (CNAME file present) or dev mode -> base is '/', otherwise GitHub project pages subfolder '/currency/'
  const base = env.VITE_BASE_PATH || (mode === 'development' || hasCname ? '/' : '/currency/')

  return {
    base,
    plugins: [react(), tailwindcss()],
    build: {
      target: 'esnext',
      cssMinify: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
  }
})
