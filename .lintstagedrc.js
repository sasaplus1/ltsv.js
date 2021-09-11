module.exports = {
  '*.+(js|ts)': ['eslint --cache', 'prettier --check'],
  '*.+(md|yml)': ['prettier --check'],
  '*.ts'() {
    return 'tsc --noEmit';
  },
  '!(package|package-lock).json': 'prettier --check --parser json-stringify',
  'package.json': [
    'npx fixpack --dryRun',
    'prettier --check --parser json-stringify'
  ],
  'package-lock.json': 'node -e "process.exitCode = 1;"'
};
