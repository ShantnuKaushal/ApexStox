import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Ensure all built assets are served from /ApexStox/ on GitHub Pages
  base: '/ApexStox/',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy Finnhub calls through /api/v1 to avoid CORS (dev only)
      '/api/v1': {
        target: 'https://finnhub.io',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, '/api/v1')
      },
      // Proxy our auth routes (dev only)
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/tracked': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      // Proxy /quotes → Express backend (dev only)
      '/quotes': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      // Proxy /profiles → Express backend (dev only)
      '/profiles': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
