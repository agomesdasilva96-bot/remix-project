import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 5179,
    proxy: {
      '/api': {
        target: 'http://localhost:5178',
        changeOrigin: true
      }
    }
  }
})
