import DotenvPlugin from 'dotenv-webpack';
import CssExtractPlugin from 'mini-css-extract-plugin';
import { merge } from 'webpack-merge';
import path from 'path';
import { commonConfig } from './config.common';
import * as paths from './paths';
import { createRules } from './rules';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack-dev-server';
import dotenv from 'dotenv';
const { parsed } = dotenv.config({ path: paths.env });

// Development plugins
const developmentPlugins = [
  new DotenvPlugin({
    path: paths.env,
    safe: paths.envRef,
    expand: true,
  }),
  new CssExtractPlugin({
    filename: paths.outputDev.css,
    chunkFilename: paths.outputDev.cssChunks,
  }),
  new ReactRefreshWebpackPlugin(),
  new HtmlWebpackPlugin({
    title: 'Gigamaps',
    template: paths.indexHtml,
    favicon: paths.favicon,
    matomoSiteId: parsed?.MATOMO_SITE_ID ?? 0,
  }),
];

// Development config
//@ts-ignore
export const developmentConfig = merge<Configuration>(commonConfig, {
  target: 'web',
  mode: 'development',
  entry: {
    main: paths.entryMain,
  },
  output: {
    publicPath: '/',
    pathinfo: true,
    filename: paths.outputDev.js,
    chunkFilename: paths.outputDev.jsChunks,
  },
  module: {
    rules: createRules(),
  },
  plugins: developmentPlugins,
  devtool: 'source-map',
  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    open: true,
    compress: true,
    historyApiFallback: {
      disableDotRule: true,
    },
    host: '0.0.0.0',
    port: 9500,
  },
  optimization: {
    concatenateModules: false,
    minimize: false,
    runtimeChunk: 'single',
  },
  stats: {
    performance: false,
    assets: false,
    entrypoints: false,
  },
  watchOptions: {
    ignored: [
      "/node_modules/",
      "**.test.ts",
      "*.test.tsx",
      "*.config.js",
      "/package.json"
    ],
  }
});

export default developmentConfig;
