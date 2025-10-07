export default {
  '*': ['prettier --write --ignore-unknown', 'cspell --no-must-find-files'],
  '*.{js,ts,mjs,cjs,mts,cts}': 'eslint --fix',
  '*.json': (files) =>
    `node scripts/validate-schemas.js --file ${files.join(' ')}`,
  'package.json': 'npmPkgJsonLint .',
};
