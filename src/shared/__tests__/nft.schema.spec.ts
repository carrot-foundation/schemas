import { describe, it } from 'vitest';
import { expectIssuesContain, validNftIpfsFixture } from '../../test-utils';
import { NftIpfsSchema } from '../nft.schema';

describe('NftIpfsSchema', () => {
  it('rejects duplicate trait_type in attributes', () => {
    const [firstAttribute] = validNftIpfsFixture.attributes;

    expectIssuesContain(
      NftIpfsSchema,
      () => ({
        ...validNftIpfsFixture,
        attributes: [...validNftIpfsFixture.attributes, { ...firstAttribute }],
      }),
      ['Attribute trait_type values must be unique'],
    );
  });
});
