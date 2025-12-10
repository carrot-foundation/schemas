import { describe, it } from 'vitest';
import { expectIssuesContain, validNftIpfsFixture } from '../../test-utils';
import { NftIpfsSchema } from '../nft.schema';

describe('NftIpfsSchema', () => {
  it('rejects duplicate trait_type in attributes', () => {
    expectIssuesContain(
      NftIpfsSchema,
      () => ({
        ...validNftIpfsFixture,
        attributes: [
          ...validNftIpfsFixture.attributes,
          {
            trait_type: 'Type',
            value: 'Plastic',
          },
        ],
      }),
      ['Attribute trait_type values must be unique'],
    );
  });
});
