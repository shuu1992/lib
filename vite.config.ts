import { defineConfig } from 'vite';
import { extname, relative, resolve } from 'path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/main.ts'),
      name: 'MyComponent',
      fileName: (format) => `my-component.${format}.js`,
    },
    rollupOptions: {
      // Ensure to externalize deps that shouldn't be bundled
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@hocs': path.resolve(__dirname, 'src/hocs'),
      '@i18n': path.resolve(__dirname, 'src/i18n'),
      '@themes': path.resolve(__dirname, 'src/themes'),
      '@type': path.resolve(__dirname, 'src/types'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@mockData': path.resolve(__dirname, 'src/mockData'),
      '@src-pwa': path.resolve(__dirname, 'src-pwa'),
      '@config': path.resolve(__dirname, './config'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
    },
  },
});
