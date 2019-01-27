module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  overrides: [
    {
      env: {
        mocha: true
      },
      files: ['test/**/*.mjs']
    },
    {
      files: ['.runkit.js'],
      rules: {
        'no-console': 'off'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  root: true
};
