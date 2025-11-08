import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
  // 👇 important for GitHub Pages
  base: '/Vibe-Commerce/',
  build: {
    // Build into /docs at repo root so Pages can use it
    outDir: '../docs',
    emptyOutDir: true,
  },
});
