import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
  },
  server: {
    port: 3001,
    open: true,
  },
});