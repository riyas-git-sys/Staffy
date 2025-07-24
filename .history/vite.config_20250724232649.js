import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { glob } from 'glob'

export default defineConfig({
  plugins: [react()],
  base: '/',
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
      input: {
        main: './index.html'
      },
      output: {
        manualChunks: {
        // Remove duplicate entry and keep only one:
        employees: glob.sync('./src/pages/employees/*.jsx'),
        // Other chunks...
        auth: [
            './src/pages/auth/LoginPage.jsx',
            './src/pages/auth/SignupPage.jsx'
        ]
        }
      }
    }
  }
})