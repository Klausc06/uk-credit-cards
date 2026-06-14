import { defineConfig } from 'vite';

export default defineConfig({
  base: '/uk-credit-cards/',
  build: {
    target: 'es2023',
  },
  server: {
    open: true,
  },
});
