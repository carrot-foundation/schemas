import { describe, expect, it } from 'vitest';

import { ParticipantIdHashSchema, Sha256HashSchema } from '../hashes.schema';

describe('Sha256HashSchema', () => {
  const lowercaseHash =
    '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489';

  it('accepts a canonical lowercase 64-char hex string', () => {
    const result = Sha256HashSchema.safeParse(lowercaseHash);

    expect(result.success).toBe(true);
  });

  it('rejects an uppercase hex string', () => {
    const result = Sha256HashSchema.safeParse(lowercaseHash.toUpperCase());

    expect(result.success).toBe(false);
  });

  it('rejects a mixed-case hex string', () => {
    const mixed = `${lowercaseHash.slice(0, 32).toUpperCase()}${lowercaseHash.slice(32)}`;

    const result = Sha256HashSchema.safeParse(mixed);

    expect(result.success).toBe(false);
  });

  it('rejects a string with a 0x prefix', () => {
    const result = Sha256HashSchema.safeParse(`0x${lowercaseHash.slice(2)}`);

    expect(result.success).toBe(false);
  });

  it('rejects a non-hex character', () => {
    const result = Sha256HashSchema.safeParse(`${lowercaseHash.slice(0, 63)}z`);

    expect(result.success).toBe(false);
  });

  it('rejects a hash shorter than 64 characters', () => {
    const result = Sha256HashSchema.safeParse(lowercaseHash.slice(0, 63));

    expect(result.success).toBe(false);
  });

  it('rejects a hash longer than 64 characters', () => {
    const result = Sha256HashSchema.safeParse(`${lowercaseHash}0`);

    expect(result.success).toBe(false);
  });
});

describe('ParticipantIdHashSchema', () => {
  it('accepts the same canonical lowercase format as Sha256HashSchema', () => {
    const hash =
      '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489';

    const result = ParticipantIdHashSchema.safeParse(hash);

    expect(result.success).toBe(true);
  });

  it('rejects an uppercase hex string', () => {
    const hash =
      '87F633634CC4B02F628685651F0A29B7BFA22A0BD841F725C6772DD00A58D489';

    const result = ParticipantIdHashSchema.safeParse(hash);

    expect(result.success).toBe(false);
  });
});
