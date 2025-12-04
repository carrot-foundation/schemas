import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  buildSchemaUrl,
  getSchemaVersionOrDefault,
  getSchemaBaseUrl,
} from '../schema-version';

describe('schema-version utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset process.env before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original process.env after each test
    process.env = originalEnv;
  });

  describe('getSchemaVersionOrDefault', () => {
    it('returns SCHEMA_VERSION when set', () => {
      process.env['SCHEMA_VERSION'] = '1.2.3';

      expect(getSchemaVersionOrDefault()).toBe('1.2.3');
    });

    it('returns default when SCHEMA_VERSION is not set', () => {
      delete process.env['SCHEMA_VERSION'];

      expect(getSchemaVersionOrDefault()).toBe('0.0.0-dev');
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

    it('constructs base URL with default version when env var not set', () => {
      delete process.env['SCHEMA_VERSION'];
      const baseUrl = getSchemaBaseUrl();

      expect(baseUrl).toBe(
        'https://raw.githubusercontent.com/carrot-foundation/schemas/refs/tags/0.0.0-dev/schemas/ipfs',
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
