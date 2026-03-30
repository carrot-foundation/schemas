import { describe, expect, it } from 'vitest';
import massId from '../../../schemas/ipfs/mass-id/mass-id.example.json';
import gasId from '../../../schemas/ipfs/gas-id/gas-id.example.json';
import recycledId from '../../../schemas/ipfs/recycled-id/recycled-id.example.json';
import audit from '../../../schemas/ipfs/mass-id-audit/mass-id-audit.example.json';
import purchase from '../../../schemas/ipfs/credit-purchase-receipt/credit-purchase-receipt.example.json';

describe('example consistency across committed artifacts', () => {
  it('keeps linked token ids consistent across emitted examples', () => {
    expect(gasId.data.mass_id.token_id).toBe(massId.blockchain.token_id);
    expect(recycledId.data.mass_id.token_id).toBe(massId.blockchain.token_id);
    expect(audit.data.mass_id.token_id).toBe(massId.blockchain.token_id);
    expect(purchase.data.certificates[0].mass_id.token_id).toBe(
      massId.blockchain.token_id,
    );
  });
});
