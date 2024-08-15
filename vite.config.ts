import { defineConfig } from 'vite'
import { extname, relative, resolve } from 'path'
import { fileURLToPath } from 'node:url'
import { glob } from 'glob'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({ include: ['lib'] })
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      input: Object.fromEntries(
        // https://rollupjs.org/configuration-options/#input
        glob.sync('lib/**/*.{ts,tsx}').map(file => [
          // 1. The name of the entry point
          // lib/nested/foo.js becomes nested/foo
          relative(
            'lib',
            file.slice(0, file.length - extname(file).length)
          ),
          // 2. The absolute path to the entry file
          // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
          fileURLToPath(new URL(file, import.meta.url))
        ])
      ),
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      }
    }
  },
  resolve: {
      alias: {
        '@src': path.resolve(__dirname, 'src'),
        '@api': path.resolve(__dirname, 'src/api'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@contexts': path.resolve(__dirname, 'src/contexts'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@hocs': path.resolve(__dirname, 'src/hocs'),
        '@i18n': path.resolve(__dirname, 'src/i18n'),
        '@layout': path.resolve(__dirname, 'src/layout'),
        '@menuItems': path.resolve(__dirname, 'src/menuItems'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@mpages': path.resolve(__dirname, 'src/mpages'),
        '@router': path.resolve(__dirname, 'src/router'),
        '@store': path.resolve(__dirname, 'src/store'),
        '@themes': path.resolve(__dirname, 'src/themes'),
        '@type': path.resolve(__dirname, 'src/types'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@mockData': path.resolve(__dirname, 'src/mockData'),
        '@src-pwa': path.resolve(__dirname, 'src-pwa'),
        '@config': path.resolve(__dirname, './config'),
      },
    },
})