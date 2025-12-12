import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'node:fs';
import { resolve } from 'node:path';

vi.mock('node:fs', async () => {
  const actual = await vi.importActual<typeof import('node:fs')>('node:fs');
  return {
    ...actual,
  };
});

import {
  buildSchemaUrl,
  getSchemaVersionOrDefault,
  getSchemaBaseUrl,
} from '../../schema-version';

function getPackageJsonVersion(): string {
  const packageJsonPath = resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

describe('schema-version utilities', () => {
  const originalEnv = process.env;
  const packageJsonVersion = getPackageJsonVersion();

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getSchemaVersionOrDefault', () => {
    it('returns SCHEMA_VERSION when set', () => {
      process.env['SCHEMA_VERSION'] = '1.2.3';

      expect(getSchemaVersionOrDefault()).toBe('1.2.3');
    });

    it('returns package.json version when SCHEMA_VERSION is not set', () => {
      delete process.env['SCHEMA_VERSION'];

      expect(getSchemaVersionOrDefault()).toBe(packageJsonVersion);
    });

    it('returns default version when package.json cannot be read', () => {
      delete process.env['SCHEMA_VERSION'];

      const readFileSyncSpy = vi
        .spyOn(fs, 'readFileSync')
        .mockImplementation(() => {
          throw new Error('File not found');
        });

      expect(getSchemaVersionOrDefault()).toBe('0.0.0-dev');

      readFileSyncSpy.mockRestore();
    });

    it('returns default version when package.json has no version field', () => {
      delete process.env['SCHEMA_VERSION'];

      const readFileSyncSpy = vi
        .spyOn(fs, 'readFileSync')
        .mockReturnValue('{"name": "test-package"}');

      expect(getSchemaVersionOrDefault()).toBe('0.0.0-dev');

      readFileSyncSpy.mockRestore();
    });
  });

  describe('getSchemaBaseUrl', () => {
    it('constructs base URL with version from env var', () => {
      process.env['SCHEMA_VERSION'] = '2.0.0';
      const baseUrl = getSchemaBaseUrl();

      expect(baseUrl).toBe(
        'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/2.0.0/schemas/ipfs',
      );
    });

    it('constructs base URL with package.json version when env var not set', () => {
      delete process.env['SCHEMA_VERSION'];
      const baseUrl = getSchemaBaseUrl();

      expect(baseUrl).toBe(
        `https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/${packageJsonVersion}/schemas/ipfs`,
      );
    });
  });

  describe('buildSchemaUrl', () => {
    beforeEach(() => {
      process.env['SCHEMA_VERSION'] = '1.0.0';
    });

    it('strips leading slash from path', () => {
      const url = buildSchemaUrl('/mass-id/mass-id.schema.json');
      expect(url).toBe(
        'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/1.0.0/schemas/ipfs/mass-id/mass-id.schema.json',
      );
      expect(url).not.toContain('//mass-id');
    });

    it('uses path as-is when it does not start with slash', () => {
      const url = buildSchemaUrl('mass-id/mass-id.schema.json');
      expect(url).toBe(
        'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/1.0.0/schemas/ipfs/mass-id/mass-id.schema.json',
      );
    });
  });
});
