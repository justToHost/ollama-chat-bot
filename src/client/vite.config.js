// src/client/vite.config.js
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: __dirname,  // Absolute path to src/client
  build: {
    outDir: path.resolve(__dirname, '../../dist'),
    emptyOutDir: true
  },
  server: {
    port: 5173,
    open: true,  // Auto-open browser
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',  // Your Express server
        changeOrigin: true,
      },   
  },
  resolve: {
    alias: {
      '../server': false  // Block server imports
    }
  }
}
})