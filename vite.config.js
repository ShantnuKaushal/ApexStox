import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy Finnhub calls for quotes/profile lookups the client used to do
      '/api/v1': {
        target: 'https://finnhub.io',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api\/v1/, '/api/v1')
      },
      // Proxy our auth and tracked routes to Express
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/tracked': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      // NEW: proxy /quotes → Express server /quotes
      '/quotes': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      // NEW: proxy /profiles → Express server /profiles
      '/profiles': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
