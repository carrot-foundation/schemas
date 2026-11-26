import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { verifyJson } from '../fs-utils.js';

describe('verifyJson', () => {
  let directory: string;
  let file: string;

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'schemas-verify-'));
    file = path.join(directory, 'artifact.json');
  });

  afterEach(() => {
    fs.rmSync(directory, { recursive: true, force: true });
  });

  it('accepts equivalent JSON without rewriting the file', () => {
    const original = '{"second":2,"first":1}\n';
    fs.writeFileSync(file, original);

    expect(() => verifyJson(file, { first: 1, second: 2 })).not.toThrow();
    expect(fs.readFileSync(file, 'utf8')).toBe(original);
  });

  it('fails on stale JSON without updating it', () => {
    const original = '{"value":1}\n';
    fs.writeFileSync(file, original);

    expect(() => verifyJson(file, { value: 2 })).toThrow('artifact.json');
    expect(fs.readFileSync(file, 'utf8')).toBe(original);
  });

  it('fails on missing JSON without creating it', () => {
    expect(() => verifyJson(file, { value: 1 })).toThrow('artifact.json');
    expect(fs.existsSync(file)).toBe(false);
  });
});
