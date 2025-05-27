import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy Finnhub calls through /api/v1 to avoid CORS
      '/api/v1': {
        target: 'https://finnhub.io',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, '/api/v1')
      },
      // Proxy our auth routes to the Express backend
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/tracked': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
