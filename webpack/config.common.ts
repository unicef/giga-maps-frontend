import './types';

import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { Configuration } from 'webpack';

import * as paths from './paths';

// Common plugins
export const commonPlugins = [];

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
