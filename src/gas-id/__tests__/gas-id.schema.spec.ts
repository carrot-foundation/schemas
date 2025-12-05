import { describe, it, expect } from 'vitest';
import { GasIDIpfsSchema } from '../gas-id.schema';
import exampleJson from '../../../schemas/ipfs/gas-id/gas-id.example.json';

describe('GasIDIpfsSchema', () => {
  it('validates example.json successfully', () => {
    const result = GasIDIpfsSchema.safeParse(exampleJson);

    expect(result.success).toBe(true);
  });

  it('rejects invalid data', () => {
    const invalid = {
      ...exampleJson,
      blockchain: {
        ...exampleJson.blockchain,
        token_id: 'invalid',
      },
    };
    const result = GasIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { schema, ...withoutSchema } = exampleJson;
    const result = GasIDIpfsSchema.safeParse(withoutSchema);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = GasIDIpfsSchema.safeParse(exampleJson);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.schema.type).toBe('GasID');
      expect(data.blockchain.token_id).toBe('456');
    }
  });

  it('rejects invalid schema type', () => {
    const invalid = {
      ...exampleJson,
      schema: {
        ...exampleJson.schema,
        type: 'InvalidType',
      },
    };
    const result = GasIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects attributes array with wrong length', () => {
    const invalid = {
      ...exampleJson,
      attributes: exampleJson.attributes.slice(0, 11),
    };
    const result = GasIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects attributes array with wrong order', () => {
    const attributes = [...exampleJson.attributes];
    [attributes[0], attributes[1]] = [attributes[1], attributes[0]];
    const invalid = {
      ...exampleJson,
      attributes,
    };
    const result = GasIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects missing data fields', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, ...withoutData } = exampleJson;
    const result = GasIDIpfsSchema.safeParse(withoutData);

    expect(result.success).toBe(false);
  });

  it('rejects missing summary in data', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { summary, ...dataWithoutSummary } = exampleJson.data;
    const invalidData = {
      ...exampleJson,
      data: dataWithoutSummary,
    };
    const result = GasIDIpfsSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });
});
