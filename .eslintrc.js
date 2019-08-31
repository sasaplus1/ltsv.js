module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [
    {
      globals: {
        TransformStream: true
      },
      files: ['src/browser_stream.mjs']
    },
    {
      env: {
        mocha: true
      },
      globals: {
        __dirname: true
      },
      files: ['test/**/*.mjs']
    },
    {
      files: ['rollup.config.js'],
      rules: {
        'node/no-unsupported-features/es-syntax': 'off'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  root: true
};
