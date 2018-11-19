module.exports = {
  linters: {
    '**/*.mjs': 'npm run lint',
    'package.json': ['npx fixpack', 'git diff --exit-code --quiet']
  }
};
