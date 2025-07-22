import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs' // Explicitly use .cjs extension
  },
  build: {
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true, 
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['@heroicons/react'],
        }
      }
    }
  }
})