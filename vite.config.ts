import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/uk-credit-cards/',
  build: {
    target: 'es2023',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        en: resolve(__dirname, 'en.html'),
      },
    },
  },
  server: {
    open: true,
  },
});
