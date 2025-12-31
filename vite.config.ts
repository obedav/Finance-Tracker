import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    target: 'es2020',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vue core
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // UI libraries
          'ui-vendor': ['vue-toastification'],
          // Chart libraries
          'chart-vendor': ['chart.js', 'vue-chartjs'],
          // Utilities
          'utils-vendor': ['date-fns', 'uuid'],
          // PDF generation
          'pdf-vendor': ['jspdf', 'jspdf-autotable'],
        },
        // Optimize chunk names for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Chunk size warning limit (500kb)
    chunkSizeWarningLimit: 500,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  }
})
