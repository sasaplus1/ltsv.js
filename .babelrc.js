module.exports = function(api) {
  const config = {};

  if (api.env('cjs')) {
    config.compact = false;
    config.minified = false;
    config.presets = [
      [
        '@babel/preset-env',
        {
          debug: true,
          modules: 'commonjs',
          targets: {
            node: '6'
          }
        }
      ]
    ];
    config.plugins = [
      [
        'transform-rename-import',
        {
          replacements: [
            {
              original: '(.*)\\.mjs$',
              replacement: '$1.js'
            },
            {
              original: '^\\./src',
              replacement: './cjs'
            }
          ]
        }
      ]
    ];
  }

  if (api.env('umd')) {
    config.compact = false;
    config.minified = false;
    config.plugins = [
      [
        'transform-rename-import',
        {
          replacements: [
            {
              original: '(.*)/stream\\.mjs$',
              replacement: '$1/streams.mjs'
            }
          ]
        }
      ]
    ];
  }

  return config;
};
