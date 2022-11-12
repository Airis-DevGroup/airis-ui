import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'vite-plugin-dts';

function resolve(path: string) {
  return fileURLToPath(new URL(path, import.meta.url));
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve('./src/index.ts'),
      name: 'AirisUI',
      fileName: (format) => `airis-ui.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    dts({
      entryRoot: resolve('.'),
    }),
  ],
  resolve: {
    alias: {
      '@': resolve('./src'),
      '~': resolve('./src'),
    },
  },
});
