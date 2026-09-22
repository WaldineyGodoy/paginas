import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Assets relativos: o branch é publicado na raiz do diretório que o
  // Hostinger servir, e a página precisa funcionar tanto em /contrato/
  // quanto em qualquer outro caminho. Com `/contrato/` cravado, mover a
  // pasta quebrava o carregamento do bundle.
  base: './',
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});