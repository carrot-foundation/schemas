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

export function getSchemaBaseUrl(): string {
  return `https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/${getSchemaVersionOrDefault()}/schemas/ipfs`;
}

export function buildSchemaUrl(schemaPath: string): string {
  const cleanPath = schemaPath.startsWith('/')
    ? schemaPath.slice(1)
    : schemaPath;
  return `${getSchemaBaseUrl()}/${cleanPath}`;
}

export function getSchemaVersionOrDefault(): string {
  return process.env['SCHEMA_VERSION'] || getPackageJsonVersion();
}
