/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import http from 'http';
import https from 'https';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const STAGING_BACKEND_HOST = 'uni-ooi-giga-maps-backend-stg.azurewebsites.net';
const PROXY_PORT = 8081;

declare global {
  // eslint-disable-next-line no-var
  var __backendProxyServer: http.Server | undefined;
}

const backendProxyPlugin = (): Plugin => ({
  name: 'backend-proxy-8081',
  configureServer(server) {
    if (globalThis.__backendProxyServer) {
      return;
    }

    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    const proxyServer = http.createServer((clientReq, clientRes) => {
      const origin = clientReq.headers.origin || '*';
      const reqHeaders =
        clientReq.headers['access-control-request-headers'] || '*';

      clientRes.setHeader('Access-Control-Allow-Origin', origin);
      clientRes.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD'
      );
      clientRes.setHeader('Access-Control-Allow-Headers', reqHeaders);
      clientRes.setHeader('Access-Control-Allow-Credentials', 'true');

      if (clientReq.method === 'OPTIONS') {
        clientRes.writeHead(200);
        clientRes.end();
        return;
      }

      const headers = {
        ...clientReq.headers,
        host: STAGING_BACKEND_HOST,
        origin: `https://${STAGING_BACKEND_HOST}`,
        referer: `https://${STAGING_BACKEND_HOST}/`,
      };

      const proxyReq = https.request(
        {
          host: STAGING_BACKEND_HOST,
          port: 443,
          path: clientReq.url,
          method: clientReq.method,
          headers,
          agent: httpsAgent,
        },
        (proxyRes) => {
          const responseHeaders = { ...proxyRes.headers };
          responseHeaders['access-control-allow-origin'] = origin;
          responseHeaders['access-control-allow-methods'] =
            'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD';
          responseHeaders['access-control-allow-headers'] = reqHeaders;
          responseHeaders['access-control-allow-credentials'] = 'true';

          clientRes.writeHead(proxyRes.statusCode || 200, responseHeaders);
          proxyRes.pipe(clientRes, { end: true });
        }
      );

      proxyReq.on('error', (err) => {
        console.error(
          `[Proxy 8081 Error] ${clientReq.method} ${clientReq.url}:`,
          err.message
        );
        if (!clientRes.headersSent) {
          clientRes.writeHead(502, { 'Content-Type': 'application/json' });
        }
        clientRes.end(
          JSON.stringify({ error: 'Proxy error', message: err.message })
        );
      });

      clientReq.pipe(proxyReq, { end: true });
    });

    proxyServer.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.log(
          `[Proxy 8081] Port ${PROXY_PORT} is already in use by an active instance.`
        );
      } else {
        console.error('[Proxy 8081] Server error:', err);
      }
    });

    proxyServer.listen(PROXY_PORT, () => {
      console.log(
        `\n  ➜  Backend Proxy: http://localhost:${PROXY_PORT}/ -> https://${STAGING_BACKEND_HOST}\n`
      );
    });

    globalThis.__backendProxyServer = proxyServer;

    const cleanup = () => {
      if (globalThis.__backendProxyServer) {
        globalThis.__backendProxyServer.close();
        globalThis.__backendProxyServer = undefined;
      }
    };

    server.httpServer?.on('close', cleanup);
    process.once('SIGINT', cleanup);
    process.once('SIGTERM', cleanup);
    process.once('exit', cleanup);
  },
});

const resolveFromRoot = (...paths: string[]) =>
  path.resolve(__dirname, ...paths);

export default defineConfig(({ mode }) => ({
  plugins: [
    backendProxyPlugin(),
    tsconfigPaths(),
    tailwindcss(),
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: mode === 'development',
              pure: true,
            },
          ],
          ...(mode === 'development' || mode === 'test'
            ? [
                [
                  'effector/babel-plugin',
                  { addLoc: true, importName: ['effector', 'effector-logger'] },
                ],
              ]
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
    proxy: {
      '/api': {
        target: 'https://uni-ooi-giga-maps-backend-stg.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
      '/media': {
        target: 'https://uni-ooi-giga-maps-backend-stg.azurewebsites.net',
        changeOrigin: true,
        secure: false,
      },
    },
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
  resolve: {
    alias: {
      recharts: resolveFromRoot('node_modules/recharts/es6/index.js'),
      'es-toolkit/compat/get': resolveFromRoot(
        'src/lib/recharts-compat/get.ts',
      ),
      'es-toolkit/compat/isPlainObject': resolveFromRoot(
        'src/lib/recharts-compat/isPlainObject.ts',
      ),
      'es-toolkit/compat/last': resolveFromRoot(
        'src/lib/recharts-compat/last.ts',
      ),
      'es-toolkit/compat/maxBy': resolveFromRoot(
        'src/lib/recharts-compat/maxBy.ts',
      ),
      'es-toolkit/compat/minBy': resolveFromRoot(
        'src/lib/recharts-compat/minBy.ts',
      ),
      'es-toolkit/compat/omit': resolveFromRoot(
        'src/lib/recharts-compat/omit.ts',
      ),
      'es-toolkit/compat/range': resolveFromRoot(
        'src/lib/recharts-compat/range.ts',
      ),
      'es-toolkit/compat/sortBy': resolveFromRoot(
        'src/lib/recharts-compat/sortBy.ts',
      ),
      'es-toolkit/compat/sumBy': resolveFromRoot(
        'src/lib/recharts-compat/sumBy.ts',
      ),
      'es-toolkit/compat/throttle': resolveFromRoot(
        'src/lib/recharts-compat/throttle.ts',
      ),
      'es-toolkit/compat/uniqBy': resolveFromRoot(
        'src/lib/recharts-compat/uniqBy.ts',
      ),
    },
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
