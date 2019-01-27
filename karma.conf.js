const path = require('path');

const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

const meta = require('./package.json');

module.exports = function(config) {
  const { file } = config;

  if (!file) {
    throw new Error('file is not found');
  }

  config.set({
    basePath: path.resolve(__dirname),
    browsers: ['ChromeHeadlessNoSandbox'],
    client: {
      mocha: {
        reporter: 'html',
        ui: 'bdd'
      }
    },
    customLaunchers: {
      // NOTE: Headless Chrome testing for CI
      // NOTE: https://docs.travis-ci.com/user/chrome#Sandboxing
      // NOTE: https://discuss.circleci.com/t/running-browser-tests/10998/8
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        chromeDataDir: path.resolve(__dirname, '.chrome'),
        flags: ['--no-sandbox']
      }
    },
    files: [
      {
        pattern: require.resolve('power-assert/build/power-assert.js'),
        type: 'js',
        watched: false
      },
      {
        pattern: file,
        type: 'js',
        watched: true
      },
      {
        pattern: 'test/**/!(stream|streams).mjs',
        type: 'js',
        watched: true
      }
    ],
    frameworks: ['mocha'],
    preprocessors: {
      'test/**/*.mjs': ['rollup']
    },
    reporters: ['dots'],
    rollupPreprocessor: {
      plugins: [
        babel(),
        nodeResolve({
          browser: true,
          extensions: ['.mjs', '.js'],
          main: true,
          module: true
        }),
        commonjs()
      ],
      output: {
        format: 'umd',
        name: meta.name,
        sourcemap: 'inline'
      }
    }
  });
};
