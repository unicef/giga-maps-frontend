/** @type import('eslint').Linter.Config */
const config = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module",
    "tsconfigRootDir": ".",
    "project": [
      "./tsconfig.json"
    ]
  },
  env: {
    browser: true,
    "es6": true
  },
  globals: {
    process: true
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: "./tsconfig.json",
        alwaysTryTypes: true
      },
      node: {
        paths: ['src'],
      },
    },
    "react": {
      "version": "18.x"
    }
  },
  extends: [
    "eslint:recommended",
    "airbnb/hooks",
    "airbnb-typescript",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/recommended",
    'prettier',
  ],
  overrides: [
    {
      files: ['src/**/*.tsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        "import/prefer-default-export": "off"
      },
    },
  ],
  // Configuring third-party plugins
  plugins: [
    "react",
    "@typescript-eslint",
    "simple-import-sort"
  ],

  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "simple-import-sort/imports": [
      'error',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // Packages
          ['^@?\\w'],
          // Absolute imports
          ['^[^.]'],
          // Features
          ['^@/\\w'],
          // Relative imports
          ['^\\.'],
        ],
      },
    ],
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    "linebreak-style": "off",
    // Disallow the `any` type.
    // "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/ban-types": [
      "error",
      {
        "extendDefaults": true,
        "types": {
          "{}": false
        }
      }
    ],
    'import/no-extraneous-dependencies': "off",
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-restricted-syntax': [
      'error',
      'LabeledStatement',
      'WithStatement',
      'SequenceExpression',
    ],
    'import/no-useless-path-segments': [
      'error',
      {
        noUselessIndex: true,
      },
    ],

    "react-hooks/exhaustive-deps": "off",
    // Enforce the use of the shorthand syntax.
    "object-shorthand": "error",
    "no-console": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "react/no-unescaped-entities": "warn",
    "@typescript-eslint/comma-dangle": "off",
    "import/no-named-as-default": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
  },
  "ignorePatterns": [
    "src/lib/storybook-kit/*",
    // "src/lib/*",
    "/__mocks__/*",
    "/webpack/*",
    "*.config.js",
    "/node_modules/*"
  ],
}

// eslint-disable-next-line no-undef
module.exports = config;
