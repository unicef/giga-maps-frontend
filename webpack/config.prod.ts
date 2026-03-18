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
  }),
  new HtmlWebpackPlugin({
    title: 'Gigamaps',
    template: paths.outputProd.index,
    favicon: paths.favicon,
    matomoSiteId: process.env?.MATOMO_SITE_ID ?? 0,
    loomflowApiKey: process.env?.LOOMFLOW_API_KEY ?? '',
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
      minSize: 0,
      maxAsyncRequests: 16,
      maxInitialRequests: 6,
      cacheGroups: {
        polyfills: {
          test: testModules(['core-js']),
          enforce: true,
          reuseExistingChunk: true,
        },
        react: {
          test: testModules(['react', 'react-dom', 'scheduler']),
          name: 'react',
          enforce: true,
          reuseExistingChunk: true,
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
