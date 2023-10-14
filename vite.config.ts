import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';
import { copyFile } from 'fs/promises';

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: './main.ts',
      name: 'elements',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    dts({
      afterBuild() {
        return copyFile('./package.json', './dist/package.json');
      },
    }),
  ],
});
