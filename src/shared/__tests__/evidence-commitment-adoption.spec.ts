import { describe, expect, it } from 'vitest';
import { CreditPurchaseReceiptIpfsSchema } from '../../credit-purchase-receipt';
import { CreditRetirementReceiptIpfsSchema } from '../../credit-retirement-receipt';
import { GasIDIpfsSchema } from '../../gas-id';
import { MassIDIpfsSchema } from '../../mass-id';
import { RecycledIDIpfsSchema } from '../../recycled-id';
import purchaseExample from '../../../schemas/ipfs/credit-purchase-receipt/credit-purchase-receipt.example.json';
import retirementExample from '../../../schemas/ipfs/credit-retirement-receipt/credit-retirement-receipt.example.json';
import gasExample from '../../../schemas/ipfs/gas-id/gas-id.example.json';
import massExample from '../../../schemas/ipfs/mass-id/mass-id.example.json';
import recycledExample from '../../../schemas/ipfs/recycled-id/recycled-id.example.json';
import { validEvidenceCommitmentFixture } from '../../test-utils/fixtures';

describe('evidence_commitment on NFT metadata', () => {
  it.each([
    ['MassID', MassIDIpfsSchema, massExample],
    ['GasID', GasIDIpfsSchema, gasExample],
    ['RecycledID', RecycledIDIpfsSchema, recycledExample],
    ['Purchase receipt', CreditPurchaseReceiptIpfsSchema, purchaseExample],
    [
      'Retirement receipt',
      CreditRetirementReceiptIpfsSchema,
      retirementExample,
    ],
  ] as const)('%s', (_name, schema, example) => {
    const withBlock = {
      ...example,
      evidence_commitment: validEvidenceCommitmentFixture,
    };
    const parsed = schema.safeParse(withBlock);
    expect(parsed.success).toBe(true);
    expect(parsed.data).toHaveProperty(
      'evidence_commitment',
      validEvidenceCommitmentFixture,
    );

    expect(example).not.toHaveProperty('evidence_commitment');
    expect(schema.safeParse(example).success).toBe(true);

    const malformed = schema.safeParse({
      ...example,
      evidence_commitment: {
        ...validEvidenceCommitmentFixture,
        root: 'not-a-hash',
      },
    });
    expect(malformed.success).toBe(false);
    expect(malformed.error?.issues[0].path).toEqual([
      'evidence_commitment',
      'root',
    ]);
  });

  it('rejects the block when it is not the commitment object', () => {
    expect(
      MassIDIpfsSchema.safeParse({ ...massExample, evidence_commitment: null })
        .success,
    ).toBe(false);
  });
});
