import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Required for Render to detect the open port
  },
  preview: {
    host: '0.0.0.0', // Required if using 'vite preview' in production
  }
});
