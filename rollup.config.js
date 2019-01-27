import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

import meta from './package.json';

const banner = [
  '/*!',
  ' * @license ltsv.js Copyright(c) 2013 sasa+1',
  ' * https://github.com/sasaplus1/ltsv.js',
  ' * Released under the MIT license.',
  ' */'
].join('\n');

// NOTE: for legacy browsers option
const babelOptions = {
  // NOTE: fix circular dependencies in core-js
  // https://github.com/rollup/rollup-plugin-commonjs/issues/284#issuecomment-361085666
  exclude: ['node_modules/core-js/**/*.js'],
  extends: './.babelrc.js',
  presets: [
    [
      '@babel/preset-env',
      {
        debug: true,
        modules: false,
        targets: {
          browsers: ['IE >= 11', 'Android >= 4.4.4']
        },
        useBuiltIns: 'usage'
      }
    ]
  ]
};

const nodeResolveOptions = {
  browser: true,
  extensions: ['.mjs', '.js'],
  main: true,
  module: true
};

const terserOptions = {
  output: {
    preamble: banner
  }
};

const config = [];

config.push({
  input: './index.mjs',
  output: {
    banner,
    file: './umd/ltsv.js',
    format: 'umd',
    name: meta.name,
    sourcemap: true
  },
  plugins: [babel(), nodeResolve(nodeResolveOptions), commonjs()]
});

config.push({
  input: './index.mjs',
  output: {
    banner,
    file: './umd/ltsv.min.js',
    format: 'umd',
    name: meta.name,
    sourcemap: true
  },
  plugins: [
    babel(),
    nodeResolve(nodeResolveOptions),
    commonjs(),
    terser(terserOptions)
  ]
});

config.push({
  input: './index.mjs',
  output: {
    banner,
    file: './umd/ltsv.legacy.js',
    format: 'umd',
    name: meta.name,
    sourcemap: true
  },
  plugins: [babel(babelOptions), nodeResolve(nodeResolveOptions), commonjs()]
});

config.push({
  input: './index.mjs',
  output: {
    banner,
    file: './umd/ltsv.legacy.min.js',
    format: 'umd',
    name: meta.name,
    sourcemap: true
  },
  plugins: [
    babel(babelOptions),
    nodeResolve(nodeResolveOptions),
    commonjs(),
    terser(terserOptions)
  ]
});

export default config;
