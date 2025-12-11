import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import vitestGlobals from 'eslint-plugin-vitest-globals';

export default defineConfig([
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '**/*.d.ts',
      'local/**',
      'tmp/**',
      '*.log',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
  },
  {
    files: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      vitest: vitestGlobals,
    },
    languageOptions: {
      globals: {
        ...vitestGlobals.environments.env.globals,
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['scripts/**/*.js'],
    rules: {
      'no-unused-vars': 'error',
      'no-fallthrough': 'warn',
    },
  },
]);
