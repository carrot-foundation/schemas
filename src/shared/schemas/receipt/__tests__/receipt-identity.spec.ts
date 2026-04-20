import { describe, expect, it } from 'vitest';

import { ReceiptIdentitySchema } from '../receipt.schemas';

describe('ReceiptIdentitySchema', () => {
  const validName = 'EcoTech Solutions Inc.';
  const validExternalId = 'ad44dd3f-f176-4b98-bf78-5ee6e77d0530';
  const validExternalUrl = 'https://example.com/identity/eco-tech';

  it.each([
    [
      'all three fields set',
      {
        name: validName,
        external_id: validExternalId,
        external_url: validExternalUrl,
      },
    ],
    ['only name', { name: validName }],
    ['only external_id', { external_id: validExternalId }],
    ['only external_url', { external_url: validExternalUrl }],
    ['name + external_id', { name: validName, external_id: validExternalId }],
    [
      'external_id + external_url',
      { external_id: validExternalId, external_url: validExternalUrl },
    ],
  ])('accepts identity with %s', (_label, input) => {
    const result = ReceiptIdentitySchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('rejects empty identity object', () => {
    const result = ReceiptIdentitySchema.safeParse({});
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toContain(
      'at least one of: name, external_id, external_url',
    );
  });

  it('rejects empty string name', () => {
    const result = ReceiptIdentitySchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects non-uuid external_id', () => {
    const result = ReceiptIdentitySchema.safeParse({
      external_id: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
  });

  it('rejects malformed external_url', () => {
    const result = ReceiptIdentitySchema.safeParse({
      external_url: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('rejects unknown fields (strict)', () => {
    const result = ReceiptIdentitySchema.safeParse({
      name: validName,
      unknown_field: 'x',
    });
    expect(result.success).toBe(false);
  });
});
