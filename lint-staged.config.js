export default {
  '*': ['prettier --write --ignore-unknown', 'cspell --no-must-find-files'],
  '*.{js,ts,mjs,cjs,mts,cts}': 'eslint --fix',
  '*.json': 'node scripts/validate-schemas.js --file {files}',
  'package.json': 'npmPkgJsonLint .',
};
