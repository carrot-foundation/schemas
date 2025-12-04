import { defineConfig } from 'tsup';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function getPackageJsonVersion(): string {
  try {
    const packageJsonPath = resolve(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version || '0.0.0-dev';
  } catch {
    return '0.0.0-dev';
  }
}

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  outDir: 'dist',
  env: {
    SCHEMA_VERSION: process.env.SCHEMA_VERSION || getPackageJsonVersion(),
  },
});
