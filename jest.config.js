require('dotenv').config({ path: 'test.env' });
// Override system NODE_ENV
process.env.NODE_ENV = 'test';

const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

// Transforms tsconfig.json paths to jest's moduleNameMapper
const tsModuleNameMap = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: `${__dirname}/`,
});

const config = {
  automock: false,
  resetMocks: false,
  cacheDirectory: 'node_modules/.cache/jest',
  coverageDirectory: './coverage/',
  moduleNameMapper: {
    "\\.(svg)$": "<rootDir>/__mocks__/svg.ts",
    '\\.(css|scss)$': '<rootDir>/__mocks__/transform.js',
    ...tsModuleNameMap,
  },
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
    "^.+\\.js$": "babel-jest",
    '\\.(css|scss)$': '<rootDir>/__mocks__/transform.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/transform.js',
  },
  setupFiles: ['<rootDir>/__mocks__/match-media.js'],
  testEnvironment: 'jsdom',
  coveragePathIgnorePatterns: [
    '<rootDir>/src/assets/*',
    // Add more patterns as needed
  ],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.config.js'],
  coverageThreshold: {
    global: {
      branches: 70, // Minimum coverage percentage for branches
      functions: 70, // Minimum coverage percentage for functions
      lines: 70, // Minimum coverage percentage for lines
      statements: 70, // Minimum coverage percentage for statements
    },
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/lib/**/*',
    '!src/lib/**/*',
    '!src/**/*.test.ts',
    '!src/**/*.test.tsx',
    '!src/index.tsx',
  ],
};

module.exports = config;
