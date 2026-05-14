/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { createHtmlPlugin } from 'vite-plugin-html';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    react({
      babel: {
        plugins: [
          ['babel-plugin-styled-components', {
            displayName: mode === 'development',
            pure: true,
          }],
          ...(mode === 'development' || mode === 'test'
            ? [['effector/babel-plugin', { addLoc: true, importName: ['effector', 'effector-logger'] }]]
            : []),
        ],
      },
    }),
    svgr({
      include: '**/*.svg',
      svgrOptions: {
        ref: true,
        memo: true,
        exportType: 'default',
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      },
    }),
    createHtmlPlugin({
      minify: mode === 'production',
      inject: {
        data: {
          matomoSiteId: process.env.VITE_MATOMO_SITE_ID ?? '0',
        },
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // Silence deprecation warnings from Carbon's SCSS
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  server: {
    port: 9500,
    open: true,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'build',
    sourcemap: mode === 'production' ? 'hidden' : true,
    cssMinify: 'esbuild',
    rollupOptions: {
      output: {},
    },
  },
  define: {
    // Polyfill process.env.NODE_ENV for libraries that depend on it
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    pool: 'forks',
    poolOptions: {
      forks: {
        singleThread: true,
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 1000,
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'src/assets/*',
        'src/lib/**/*',
        '**/*.test.ts',
        '**/*.test.tsx',
        'src/index.tsx',
      ],
    },
  },
}));
