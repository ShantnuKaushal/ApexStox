// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy local function calls to your Netlify Functions emulator (if running on port 9000)
      '/.netlify/functions': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      }
    }
  }
});
