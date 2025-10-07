import { CleanWebpackPlugin as CleanPlugin } from 'clean-webpack-plugin';
import DotenvPlugin from 'dotenv-webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { commonConfig } from './config.common';
import * as paths from './paths';
import { createRules } from './rules';
import TerserPlugin from 'terser-webpack-plugin';
/* Production plugins */
const productionPlugins = [
  new DotenvPlugin({
    path: paths.env,
    safe: paths.envRef,
    expand: true,
    systemvars: true,
  }),
  new CleanPlugin(),
  new webpack.ProgressPlugin({
    activeModules: false,
    entries: true,
  }),
  // new webpack.SourceMapDevToolPlugin({
  //   noSources: true,
  // }),
  new MiniCssExtractPlugin({
    filename: paths.outputProd.css,
    chunkFilename: paths.outputProd.cssChunks,
    // Enable CSS chunk splitting
    experimentalUseImportModule: false,
  }),
  new HtmlWebpackPlugin({
    title: 'Gigamaps',
    template: paths.outputProd.index,
    favicon: paths.favicon,
    matomoSiteId: process.env?.MATOMO_SITE_ID ?? 0,
  }),
];

const testModules = (names: string[]) => (chunk: Record<string, any>) =>
  Boolean(chunk.resource) &&
  names.some((name) =>
    chunk.resource.startsWith(`${paths.root}/node_modules/${name}/`)
  );

// Production config
export const productionConfig = merge(commonConfig, {
  mode: 'production',
  entry: {
    main: paths.entryMain,
  },
  bail: true,
  devtool: 'hidden-source-map',
  output: {
    publicPath: '/',
    sourceMapFilename: '[file].map', // Name the source map files
    filename: paths.outputProd.js,
    clean: true,
    chunkFilename: paths.outputProd.jsChunks,
  },
  module: {
    rules: createRules(),
  },
  plugins: productionPlugins,
  optimization: {
    emitOnErrors: false,
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      minSize: 20000,        // 20kB minimum chunk size
      maxSize: 150000,       // 150kB maximum chunk size (even more conservative)
      maxAsyncRequests: 100, // Much higher to allow aggressive splitting
      maxInitialRequests: 30, // Much higher to allow aggressive splitting
      enforceSizeThreshold: 150000, // Hard limit - force splitting above this size
      cacheGroups: {
        polyfills: {
          test: testModules(['core-js']),
          enforce: true,
          reuseExistingChunk: true,
          maxSize: 150000,     // Enforce 150kB limit for polyfills
        },
        react: {
          test: testModules(['react', 'react-dom', 'scheduler']),
          name: 'react',
          enforce: true,
          reuseExistingChunk: true,
          maxSize: 150000,     // Enforce 150kB limit for React bundle
        },
        // Split large vendor libraries more aggressively
        largeVendors: {
          test: /[\\/]node_modules[\\/](mapbox-gl|@carbon|effector)[\\/]/,
          name: 'large-vendors',
          priority: 30,
          reuseExistingChunk: true,
          maxSize: 100000,     // Very aggressive splitting for known large libraries
          chunks: 'all',
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true,
          maxSize: 150000,     // Split large vendor libraries
        },
        styles: {
          name: 'styles',
          type: 'css/mini-extract',
          chunks: 'all',
          priority: 20,
          maxSize: 150000,     // Split large CSS files
          enforce: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
          maxSize: 150000,     // Enforce 150kB limit for all other chunks
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: true,
          sourceMap: false, // Disable source map generation
          output: {
            comments: false, // Remove all comments
            safari10: true,
          },
          compress: {
            drop_console: false, // Keep console logs if needed
            pure_funcs: ['console.log'], // Optional: Remove console logs safely
          },
        },
      }),
      new CssMinimizerPlugin({
        test: paths.cssPattern,
        minimizerOptions: {
          preset: ['default', { normalizeUnicode: false }],
        },
      })
    ],
  },
});

export default productionConfig;
