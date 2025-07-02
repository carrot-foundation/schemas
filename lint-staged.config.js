export default {
  '*': 'prettier --write --ignore-unknown',
  '*': 'cspell --no-must-find-files',
  '*.json': 'node scripts/validate-schemas.js --file {files}',
  'package.json': 'npmPkgJsonLint .',
};
