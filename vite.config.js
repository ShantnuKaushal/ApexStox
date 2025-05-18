// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/StockTracker/',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/v1': {
        target: 'https://finnhub.io',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api\/v1/, '/api/v1')
      }
    }
  }
});
