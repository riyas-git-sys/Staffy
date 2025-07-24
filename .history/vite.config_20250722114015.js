import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs' // Explicitly use .cjs extension
  },
  build: {
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false,
      },
    },
    reportCompressedSize: true,
    cssCodeSplit: true, 
    rollupOptions: {
      maxParallelFileOps: 2, // Reduce memory usage
      output: {
        manualChunks: {
          auth: [
            './src/pages/auth/LoginPage.jsx',
            './src/pages/auth/SignupPage.jsx'
          ],
          employees: [
            './src/pages/employees/*.jsx'
          ]
        }
      }
    }
  }
})