import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/sturdy-adventure/' : undefined,
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  };
});
