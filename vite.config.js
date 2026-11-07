import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

function resolveFromRoot(path) {
  return fileURLToPath(new URL(path, import.meta.url));
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolveFromRoot('./src'),
    },
  },
  build: {
    rolldownOptions: {
      input: {
        main: resolveFromRoot('./index.html'),
        teachers: resolveFromRoot('./teachers.html'),
      },
    },
  },
});
