import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      // Each page is its own entry so the homepage bundle is unaffected by /catalyst.
      input: {
        main: resolve(root, 'index.html'),
        catalyst: resolve(root, 'catalyst/index.html'),
      }
    }
  }
})
