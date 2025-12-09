import { describe, it, expect } from 'vitest';
import { RecycledIDIpfsSchema } from '../recycled-id.schema';
import exampleJson from '../../../schemas/ipfs/recycled-id/recycled-id.example.json';

describe('RecycledIDIpfsSchema', () => {
  it('validates example.json successfully', () => {
    const result = RecycledIDIpfsSchema.safeParse(exampleJson);

    expect(result.success).toBe(true);
  });

  it('rejects invalid schema type', () => {
    const invalid = {
      ...exampleJson,
      schema: {
        ...exampleJson.schema,
        type: 'InvalidType',
      },
    };
    const result = RecycledIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { schema, ...withoutSchema } = exampleJson;
    const result = RecycledIDIpfsSchema.safeParse(withoutSchema);

    expect(result.success).toBe(false);
  });

  it('rejects attributes array with wrong length', () => {
    const invalid = {
      ...exampleJson,
      attributes: exampleJson.attributes.slice(0, 10),
    };
    const result = RecycledIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects attributes array with wrong order', () => {
    const attributes = [...exampleJson.attributes];
    [attributes[0], attributes[1]] = [attributes[1], attributes[0]];
    const invalid = {
      ...exampleJson,
      attributes,
    };
    const result = RecycledIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects missing summary in data', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { summary, ...dataWithoutSummary } = exampleJson.data;
    const invalidData = {
      ...exampleJson,
      data: dataWithoutSummary,
    };
    const result = RecycledIDIpfsSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it('rejects invalid facility type', () => {
    const invalid = {
      ...exampleJson,
      data: {
        ...exampleJson.data,
        origin_location: {
          ...exampleJson.data.origin_location,
          facility_type: 'Invalid Facility',
        },
      },
    };
    const result = RecycledIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = RecycledIDIpfsSchema.safeParse(exampleJson);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.schema.type).toBe('RecycledID');
      expect(data.attributes).toHaveLength(11);
      expect(data.data.summary.recycled_mass_kg).toBeGreaterThan(0);
    }
  });
});
