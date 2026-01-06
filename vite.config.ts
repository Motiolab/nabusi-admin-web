import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'shared': path.resolve(__dirname, './src/shared'),
      'features': path.resolve(__dirname, './src/features'),
      'widgets': path.resolve(__dirname, './src/widgets'),
      'views': path.resolve(__dirname, './src/views'),
      'routes': path.resolve(__dirname, './src/routes'),
      'assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 5173,
    host: true,
  },
})
