import { describe, expect, it } from 'vitest';
import gasIdSchema from '../../../schemas/ipfs/gas-id/gas-id.schema.json';

describe('schema tooltip metadata quality', () => {
  it('uses clear shared tooltip copy for viewer-facing schema hints', () => {
    const networkName =
      gasIdSchema.properties.blockchain.properties.network_name;

    expect(networkName.description).toEqual(expect.any(String));
    expect(networkName.description).toMatch(/blockchain network/i);
    expect(networkName.description).not.toMatch(/^network name$/i);
    expect(networkName.examples).toContain('Amoy');
  });
});
