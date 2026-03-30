export default {
  '*': ['prettier --write --ignore-unknown', 'cspell --no-must-find-files'],
  '*.{js,ts,mjs,cjs,mts,cts}':
    'eslint --fix --cache --cache-location .cache/eslint/',
  '*.json': (files) =>
    `tsx scripts/validate-schemas.ts --file ${files.join(' ')}`,
  'package.json': 'npmPkgJsonLint .',
};
