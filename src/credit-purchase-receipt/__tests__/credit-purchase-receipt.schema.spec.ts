import { describe, it, expect } from 'vitest';
import { CreditPurchaseReceiptIpfsSchema } from '../credit-purchase-receipt.schema';
import exampleJson from '../../../schemas/ipfs/credit-purchase-receipt/credit-purchase-receipt.example.json';

describe('CreditPurchaseReceiptIpfsSchema', () => {
  it('validates example.json successfully', () => {
    const result = CreditPurchaseReceiptIpfsSchema.safeParse(exampleJson);

    expect(result.success).toBe(true);
  });

  it('rejects invalid schema type', () => {
    const invalid = {
      ...exampleJson,
      schema: {
        ...exampleJson.schema,
        type: 'PurchaseID',
      },
    };

    const result = CreditPurchaseReceiptIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects missing data', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, ...withoutData } = exampleJson;
    const result = CreditPurchaseReceiptIpfsSchema.safeParse(withoutData);

    expect(result.success).toBe(false);
  });

  it('rejects mismatched totals', () => {
    const invalid = structuredClone(exampleJson);
    invalid.data.summary.total_credits = invalid.data.summary.total_credits + 1;

    const result = CreditPurchaseReceiptIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects certificate credit slug not present in credits', () => {
    const invalid = structuredClone(exampleJson);
    invalid.data.certificates[0].credit_slug = 'unknown-credit';

    const result = CreditPurchaseReceiptIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects attributes that do not align with data totals', () => {
    const invalid = structuredClone(exampleJson);
    invalid.attributes = invalid.attributes.map((attribute) =>
      attribute.trait_type === 'Total USDC Amount'
        ? { ...attribute, value: 999999 }
        : attribute,
    ) as typeof invalid.attributes;

    const result = CreditPurchaseReceiptIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = CreditPurchaseReceiptIpfsSchema.safeParse(exampleJson);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.schema.type).toBe('CreditPurchaseReceipt');
      expect(data.data.summary.total_certificates).toBe(3);
      expect(data.data.certificates[0].mass_id.token_id).toBe('123');
    }
  });
});
