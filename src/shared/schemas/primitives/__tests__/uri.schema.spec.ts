import { describe, expect, it } from 'vitest';

import { IpfsUriSchema } from '../uri.schema';

describe('IpfsUriSchema', () => {
  const validUris = [
    'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
    'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
    'ipfs://bafybeigdyrztp6unv7rbhmqzfrd6xuidkf5p6qulisz2nbyzj6x4c6q3rm/metadata.json',
    'ipfs://zb2rhk6nF5keBniWTdCu1Vq4iAFz2uVH54camzSjZYUxXkH9z',
  ];

  it.each(validUris)('accepts valid IPFS URI: %s', (uri) => {
    expect(IpfsUriSchema.safeParse(uri).success).toBe(true);
  });

  const invalidUris = [
    'https://QmTy8w65yBXgyfG2ZBg5TrfB2hPjrDQH3RCQFJGkARStJb',
    'ipfs://Qm123',
    'ipfs://bafyshort',
    'ipfs://zb2rhk6nF5keBniWTdCu1Vq4iAFz2uVH54camzSjZYUxXkH9z/has space',
    'ipfs://notcidwithspecialchars!@#',
  ];

  it.each(invalidUris)('rejects invalid IPFS URI: %s', (uri) => {
    expect(IpfsUriSchema.safeParse(uri).success).toBe(false);
  });
});
