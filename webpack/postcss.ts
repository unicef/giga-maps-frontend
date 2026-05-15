const flexBugsFixes = require('postcss-flexbugs-fixes');
const normalize = require('postcss-normalize');
const presetEnv = require('postcss-preset-env');

import { isDevelopment } from './env';

export const postcssOptions = {
  syntax: 'postcss-scss',
  plugins: [
    presetEnv({
      stage: 2,
      autoprefixer: {
        flexbox: 'no-2009',
        grid: 'autoplace',
      },
    }),
    flexBugsFixes(),
    normalize(),
  ],
  sourceMap: isDevelopment,
};
