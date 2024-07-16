import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { RuleSetRule } from 'webpack';

import { isDevelopment } from './env';
import * as paths from './paths';
import { postcssOptions } from './postcss';

export interface Options {
  inlineCssOnly?: boolean;
  excludeJs?: boolean;
}

export const createRules = (): RuleSetRule[] => {
  const js = {
    test: paths.jsPattern,
    include: paths.source,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
        },
      },
    ],
  };

  const css = {
    test: paths.cssPattern,
    use: [
      isDevelopment
        ? 'style-loader'
        : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            esModule: true,
          },
        },
      {
        loader: 'css-loader',
        options: {
          sourceMap: isDevelopment,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions,
        },
      },
    ],
  };

  const scss = {
    test: paths.scssPattern,
    use: [
      ...css.use,
      'resolve-url-loader',
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true, // Required for resolve-url-loader
          sassOptions: {
            sourceMapContents: false,
          },
          webpackImporter: false,
        },
      },
    ],
  };

  const svg: RuleSetRule = {
    test: /\.svg$/,//paths.svgPattern,
    use: [
      'babel-loader',
      {
        loader: '@svgr/webpack',
        options: {
          ref: true,
          memo: true,
          babel: false,
          prettier: false,
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    // disable plugins
                    removeViewBox: false,
                  },
                },
              },
            ],
          },
        },
      },
    ],
  };

  const assets = {
    test: paths.filePattern,
    use: {
      loader: 'file-loader',
      options: {
        context: paths.source,
        name: isDevelopment ? paths.outputDev.assets : paths.outputProd.assets,
      },
    },
  };

  return [js, css, scss, svg, assets];
};
