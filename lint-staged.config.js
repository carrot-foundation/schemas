module.exports = {
  '*': 'prettier --write --ignore-unknown',
  '*': 'cspell --no-must-find-files',
  'package.json': 'npmPkgJsonLint .',
};
