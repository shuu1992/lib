import * as path from 'path';
import fs from 'fs';
import { exit } from 'process';
import react from '@vitejs/plugin-react';
import * as colors from 'picocolors';
import { defineConfig, loadEnv } from 'vite';
import reactNodeKey from 'react-node-key/vite';
import viteCompression from 'vite-plugin-compression';
import timeReporter from 'vite-plugin-time-reporter';
import progress from 'vite-plugin-progress';
import fse from 'fs-extra';
import packageJson from './package.json';

export default defineConfig(({ mode }) => {
  const outDir = 'dist';
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    plugins: [
      react(),
      // progress({
      //   format: `${colors.green(colors.bold('Bouilding'))} ${colors.cyan('[:bar]')} :percent`,
      //   total: 200,
      //   width: 60,
      //   complete: '=',
      //   incomplete: '',
      // }),
      viteCompression({
        algorithm: 'gzip',
        threshold: 5120,
        verbose: true,
        ext: '.gz',
      }),

      timeReporter(),
      reactNodeKey(),
      //after build
      {
        name: 'postbuild-commands', // the name of your custom plugin. Could be anything.
        closeBundle: () => {
          exit(0);
        },
      },
    ],
    css: {
      modules: {
        // Custom configuration options
        localsConvention: 'camelCaseOnly', // Example option
      },
    },
    publicDir: 'public',
    base: '/', // index.html文件所在位置
    build: {
      outDir: outDir,
      minify: 'terser',
      cssMinify: true,
      reportCompressedSize: true,
      chunkSizeWarningLimit: 5000, //chunk 大小警告的限制
      watch: {
        include: 'src/**',
      },
      commonjsOptions: {
        include: [/node_modules/],
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: ({ name }) => {
            if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
              return 'assets/images/[name]-[hash][extname]';
            }
            if (/\.css$/.test(name ?? '')) {
              return 'assets/css/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            if (id.includes('src/pages')) {
              return 'pages';
            }
            if (id.includes('src/components')) {
              return 'components';
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, 'src'),
        '@api': path.resolve(__dirname, 'src/api'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@contexts': path.resolve(__dirname, 'src/contexts'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@i18n': path.resolve(__dirname, 'src/i18n'),
        '@layout': path.resolve(__dirname, 'src/layout'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@router': path.resolve(__dirname, 'src/router'),
        '@store': path.resolve(__dirname, 'src/store'),
        '@themes': path.resolve(__dirname, 'src/themes'),
        '@type': path.resolve(__dirname, 'src/types'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@src-pwa': path.resolve(__dirname, 'src-pwa'),
        '@config': path.resolve(__dirname, './config'),
      },
    },

    server: {
      open: false,
      host: true,
      strictPort: true,
      port: process.env.VITE_PORT,
      sourcemapIgnoreList(sourcePath, sourcemapPath) {
        if (sourcePath.includes('node_modules')) {
          return true;
        }
        return false;
      },
      proxy: {
        // with options
        '/ws': {
          target: process.env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ws/, ''),
        },
        '/api': {
          target: process.env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/file': {
          target: process.env.VITE_FILE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/file/, ''),
        },
        '/r2imgs': {
          target: process.env.VITE_R2_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/r2imgs/, ''),
        },
      },
    },
  };
});
