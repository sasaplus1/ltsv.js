module.exports = {
  docdash: {
    private: false,
    scripts: ['ltsv.css'],
    sort: false
  },
  opts: {
    destination: './docs',
    readme: './README.md',
    recurse: true,
    template: './node_modules/@mocha/docdash'
  },
  source: {
    excludePattern: 'node_modules/',
    include: ['.'],
    includePattern: '\\.mjs$'
  }
};
