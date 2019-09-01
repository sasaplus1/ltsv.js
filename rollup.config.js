import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';

import meta from './package.json';

const config = [];

if (process.env.build === 'esm') {
  config.push({
    input: './entry.ts',
    output: {
      file: './dist/esm/index.mjs',
      format: 'esm'
    },
    plugins: [
      typescript({
        module: 'ESNext',
        newLine: 'lf',
        strict: true,
        target: 'ESNext'
      })
    ]
  });
}

if (process.env.build === 'umd') {
  const banner = [
    '/*!',
    ' * @license ltsv.js Copyright(c) 2013 sasa+1',
    ' * https://github.com/sasaplus1/ltsv.js',
    ' * Released under the MIT license.',
    ' */'
  ].join('\n');

  config.push(
    {
      input: './entry.ts',
      output: {
        banner,
        file: `./dist/umd/${meta.name}.js`,
        format: 'umd',
        name: meta.name,
        sourcemap: true
      },
      plugins: [
        typescript({
          newLine: 'lf',
          strict: true,
          sourceMap: true,
          target: 'ESNext'
        })
      ]
    },
    {
      input: './entry.ts',
      output: {
        banner,
        file: `./dist/umd/${meta.name}.min.js`,
        format: 'umd',
        name: meta.name,
        sourcemap: true
      },
      plugins: [
        typescript({
          newLine: 'lf',
          strict: true,
          sourceMap: true,
          target: 'ESNext'
        }),
        terser({
          output: {
            preamble: banner
          },
          sourcemap: true
        })
      ]
    },
    {
      input: './entry.ts',
      output: {
        banner,
        file: `./dist/umd/${meta.name}.legacy.js`,
        format: 'umd',
        name: meta.name,
        sourcemap: true
      },
      plugins: [
        typescript({
          newLine: 'lf',
          strict: true,
          sourceMap: true,
          target: 'ES5'
        })
      ]
    },
    {
      input: './entry.ts',
      output: {
        banner,
        file: `./dist/umd/${meta.name}.legacy.min.js`,
        format: 'umd',
        name: meta.name,
        sourcemap: true
      },
      plugins: [
        typescript({
          newLine: 'lf',
          strict: true,
          sourceMap: true,
          target: 'ES5'
        }),
        terser({
          output: {
            preamble: banner
          },
          sourcemap: true
        })
      ]
    }
  );
}

export default config;
