// src/client/vite.config.js
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const url = process.env.VITE_API_URL || 'http://localhost:3000'

export default defineConfig({
  root: __dirname,  // Absolute path to src/client
  build: {
    outDir: path.resolve(__dirname, 'client'),
    emptyOutDir: true
  },
  server: {
    port: 5173,
    open: true,  // Auto-open browser
    host: true,
    proxy: {
      '/api': {
        target: url,
        changeOrigin: true,
        secure: false
      },
      // '/socket.io': {  // ⭐⭐⭐ Optional if the target added to io() in main ⭐⭐⭐
      //   target: 'http://localhost:3000',
      //   ws: true,  // CRITICAL for WebSocket
      //   changeOrigin: true,
      //   secure: false
      // }
    }   
  },
  resolve: {
    alias: {
      '../server': false  // Block server imports
    }
  }
})