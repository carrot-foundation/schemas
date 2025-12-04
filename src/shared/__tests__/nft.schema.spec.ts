import { describe, it, expect } from 'vitest';
import { NftIpfsSchema } from '../nft.schema';
import { minimalValidNft } from '../../test-utils';

describe('NftIpfsSchema', () => {
  it('rejects duplicate trait_type in attributes', () => {
    const invalid = {
      ...minimalValidNft,
      attributes: [
        ...minimalValidNft.attributes,
        {
          trait_type: 'Type',
          value: 'Plastic',
        },
      ],
    };
    const result = NftIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);

    if (!result.success) {
      const errorMessages = result.error.issues
        .map((issue) => issue.message)
        .join(' ');

      expect(errorMessages).toContain(
        'Attribute trait_type values must be unique',
      );
    }
  });
});
