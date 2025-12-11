import { describe, it } from 'vitest';
import {
  createNftIpfsFixture,
  expectIssues,
  expectIssuesContain,
  validNftIpfsFixture,
} from '../../test-utils';
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

  it('rejects unsupported blockchain chain_id and network_name combinations', () => {
    expectIssuesContain(
      NftIpfsSchema,
      () =>
        createNftIpfsFixture({
          blockchain: {
            ...validNftIpfsFixture.blockchain,
            chain_id: 137,
            network_name: 'Amoy',
          },
        }),
      [
        'chain_id and network_name must match a supported network: 137/Polygon (mainnet) or 80002/Amoy (testnet)',
      ],
    );
  });

  it('enforces blockchain details to match environment network', () => {
    expectIssues(
      NftIpfsSchema,
      () =>
        createNftIpfsFixture({
          blockchain: {
            ...validNftIpfsFixture.blockchain,
            chain_id: 80002,
            network_name: 'Amoy',
          },
          environment: {
            blockchain_network: 'mainnet',
            deployment: 'production',
            data_set_name: 'PROD',
          },
        }),
      [
        'blockchain.chain_id must be 137 when environment.blockchain_network is mainnet',
        'blockchain.network_name must be Polygon when environment.blockchain_network is mainnet',
      ],
    );
  });
});
