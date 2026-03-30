import { describe, expect, it } from 'vitest';
import gasIdSchema from '../../../schemas/ipfs/gas-id/gas-id.schema.json';
import receiptSchema from '../../../schemas/ipfs/credit-purchase-receipt/credit-purchase-receipt.schema.json';

describe('schema tooltip metadata quality', () => {
  it('uses clear shared tooltip copy for viewer-facing schema hints', () => {
    const networkName =
      gasIdSchema.properties.blockchain.properties.network_name;

    expect(networkName.description).toEqual(expect.any(String));
    expect(networkName.description).toMatch(/blockchain network/i);
    expect(networkName.description).not.toMatch(/^network name$/i);
    expect(networkName.examples).toContain('Amoy');
  });

  it('uses concise schema-specific tooltip copy for receipt fields', () => {
    const purchasedAt =
      receiptSchema.properties.data.properties.summary.properties.purchased_at;

    expect(purchasedAt.description).toEqual(expect.any(String));
    expect(purchasedAt.description).toMatch(/purchase/i);
    expect(purchasedAt.description).toMatch(/timestamp/i);
    expect(purchasedAt.description).not.toMatch(/^purchased at$/i);
  });
});
