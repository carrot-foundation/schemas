import { describe, expect, it } from 'vitest';
import { CreditSchema } from '../credit.schema';
import exampleJson from '../../../schemas/ipfs/credit/credit.example.json';

describe('CreditSchema', () => {
  it('validates example.json successfully', () => {
    const result = CreditSchema.safeParse(exampleJson);

    expect(result.success).toBe(true);
  });

  it('rejects invalid schema type', () => {
    const invalid = {
      ...exampleJson,
      schema: {
        ...exampleJson.schema,
        type: 'Invalid',
      },
    };

    const result = CreditSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { symbol, ...withoutSymbol } = exampleJson;
    const result = CreditSchema.safeParse(withoutSymbol);

    expect(result.success).toBe(false);
  });

  it('rejects invalid decimals', () => {
    const invalid = {
      ...exampleJson,
      decimals: -1,
    };

    const result = CreditSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = CreditSchema.safeParse(exampleJson);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.schema.type).toBe('Credit');
      expect(data.decimals).toBe(18);
    }
  });
});
