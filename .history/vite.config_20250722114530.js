import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { glob } from 'glob'

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
          employees: glob.sync('./src/pages/employees/*.jsx'),
          // Replace glob pattern with explicit paths
          employees: [
            './src/pages/employees/EmployeeListPage.jsx',
            './src/pages/employees/EmployeeDetailPage.jsx',
            './src/pages/employees/EditEmployeePage.jsx'
          ],
          auth: [
            './src/pages/auth/LoginPage.jsx',
            './src/pages/auth/SignupPage.jsx'
          ]
        }
      }
    }
  }
})