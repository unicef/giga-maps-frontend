import './types';

import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import webpack from 'webpack';
import WebpackBar from 'webpackbar';

import * as paths from './paths';
import { Configuration } from 'webpack';

// Common plugins
export const commonPlugins = [
  new WebpackBar(),
];

export const resolvePlugins = [
  // Get aliases from tsconfig.json
  new TsconfigPathsPlugin(),
];

// Common config
export const commonConfig: Configuration = {
  context: paths.root,
  resolve: {
    extensions: paths.extensions,
    plugins: resolvePlugins,
  },
  output: {
    path: paths.build,
  },
  module: {
    rules: [],
    wrappedContextCritical: true,
    strictExportPresence: true,
  },
  plugins: commonPlugins,
  performance: {
    hints: false,
  },
  optimization: {
    emitOnErrors: true,
    //namedModules: true, // Better gzipped
    //namedChunks: true,
  },
  stats: {
    modules: false,
    chunks: false,
    children: false,
    timings: false,
    version: false,
  },
};

export default commonConfig;
