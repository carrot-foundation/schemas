import { describe, it, expect } from 'vitest';
import { PurchaseIDIpfsSchema } from '../purchase-id.schema';
import exampleJson from '../../../schemas/ipfs/purchase-id/purchase-id.example.json';

describe('PurchaseIDIpfsSchema', () => {
  it('validates example.json successfully', () => {
    const result = PurchaseIDIpfsSchema.safeParse(exampleJson);

    expect(result.success).toBe(true);
  });

  it('rejects invalid schema type', () => {
    const invalid = {
      ...exampleJson,
      schema: {
        ...exampleJson.schema,
        type: 'MassID',
      },
    };

    const result = PurchaseIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects missing data', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, ...withoutData } = exampleJson;
    const result = PurchaseIDIpfsSchema.safeParse(withoutData);

    expect(result.success).toBe(false);
  });

  it('rejects attributes shorter than required minimum', () => {
    const invalid = {
      ...exampleJson,
      attributes: exampleJson.attributes.slice(0, 3),
    };

    const result = PurchaseIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects item with unknown credit slug', () => {
    const invalid = structuredClone(exampleJson);
    invalid.data.items[0].credit_slug = 'unknown-credit';

    const result = PurchaseIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects item with unknown collection slug', () => {
    const invalid = structuredClone(exampleJson);
    invalid.data.items[0].collection_slug = 'unknown-collection';

    const result = PurchaseIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects certificate type not listed in summary', () => {
    const invalid = structuredClone(exampleJson);
    invalid.data.summary.certificate_types = ['GasID'];

    const result = PurchaseIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects summary credit symbols that do not match credits', () => {
    const invalid = structuredClone(exampleJson);
    invalid.data.summary.credit_symbols = [
      exampleJson.data.summary.credit_symbols[0],
    ];

    const result = PurchaseIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = PurchaseIDIpfsSchema.safeParse(exampleJson);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.schema.type).toBe('PurchaseID');
      expect(data.data.summary.total_certificates).toBe(3);
      expect(data.data.items[0].certificate.mass_id.token_id).toBe('123');
    }
  });
});
