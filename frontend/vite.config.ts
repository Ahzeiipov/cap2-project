import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  root: __dirname,
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Ensure Vite resolves modules from frontend/node_modules first
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    fs: {
      // Restrict file serving to frontend directory and its node_modules
      strict: true,
      allow: [__dirname, path.resolve(__dirname, '../')],
    },
  },
  optimizeDeps: {
    // Force Vite to pre-bundle these dependencies
    include: ['react-router-dom', 'react', 'react-dom'],
  },
})
