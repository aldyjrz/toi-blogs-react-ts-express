import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/sitemap.xml': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/robots.txt': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/rss.xml': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/manifest.json': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
