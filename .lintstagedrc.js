module.exports = {
  linters: {
    '**/*.mjs': 'npm run lint',
    '.*.js': 'npm run lint',
    'package.json': [
      'npx fixpack',
      'git diff --exit-code --quiet ./package.json'
    ]
  }
};
