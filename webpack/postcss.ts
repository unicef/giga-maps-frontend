import flexBugsFixes from 'postcss-flexbugs-fixes';
import normalize from 'postcss-normalize';
import presetEnv from 'postcss-preset-env';

import { isDevelopment } from './env';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const tailwindcss = require('@tailwindcss/postcss');

export const postcssOptions = {
  syntax: 'postcss-scss',
  plugins: [
    tailwindcss,
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
