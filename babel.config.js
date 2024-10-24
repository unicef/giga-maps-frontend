/* eslint-disable no-undef */
const isTest = process.env.NODE_ENV === 'test';
const isDevelopment =
  process.env.WEBPACK_DEV_SERVER === 'true' ||
  process.env.NODE_ENV === 'development';

const presetReact = {
  development: isDevelopment,
  useBuiltIns: true,
  runtime: "automatic"
};

/** @type import('@babel/preset-env').Options */
const presetEnv = {
  loose: true,
  useBuiltIns: 'usage',
  corejs: 3,
  modules: isTest ? 'commonjs' : false,
  shippedProposals: true,
  bugfixes: true, // Remove later in babel 8
};

const presetTypescript = {
  isTSX: true,
  allExtensions: true,
};

const pluginStyledComponents = {
  displayName: isDevelopment,
  pure: true,
};

const pluginEffector = {
  addLoc: true,
  importName: ['effector', 'effector-logger'],
};

module.exports = {
  presets: [
    ['@babel/preset-react', presetReact],
    ['@babel/preset-env', presetEnv],
    ['@babel/preset-typescript', presetTypescript],
  ],
  plugins: [
    ['babel-plugin-styled-components', pluginStyledComponents],
    ['effector/babel-plugin', (isDevelopment || isTest) && pluginEffector],
  ],
};
