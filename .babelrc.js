module.exports = function(api) {
  const config = {};

  if (api.env('node')) {
    config.compact = false;
    config.minified = false;
    config.presets = [
      [
        '@babel/preset-env',
        {
          targets: {
            node: '6'
          },
          modules: 'commonjs',
          loose: true
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

  return config;
};
