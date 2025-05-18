import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy /api/v1/* → Finnhub so you don’t get CORS errors
      '/api/v1': {
        target: 'https://finnhub.io',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api\/v1/, '/api/v1')
      }
    }
  }
});
