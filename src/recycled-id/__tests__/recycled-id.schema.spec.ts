import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectSchemaInvalid,
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
} from '../../test-utils';
import { RecycledIDIpfsSchema } from '../recycled-id.schema';
import exampleJson from '../../../schemas/ipfs/recycled-id/recycled-id.example.json';

describe('RecycledIDIpfsSchema', () => {
  const schema = RecycledIDIpfsSchema;
  const base = exampleJson as z.input<typeof schema>;

  it('validates example.json successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it('rejects invalid schema type', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.schema = {
        ...invalid.schema,
        type: 'InvalidType' as unknown as typeof invalid.schema.type,
      };
    });
  });

  it('rejects missing required fields', () => {
    expectSchemaInvalidWithout(schema, base, 'schema');
  });

  it('rejects attributes array with wrong length', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.attributes = invalid.attributes.slice(
        0,
        10,
      ) as typeof invalid.attributes;
    });
  });

  it('rejects attributes array with wrong order', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      const attributes = invalid.attributes.slice() as unknown[];
      [attributes[0], attributes[1]] = [attributes[1], attributes[0]];
      invalid.attributes = attributes as typeof invalid.attributes;
    });
  });

  it('rejects missing summary in data', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      Reflect.deleteProperty(
        invalid.data as Record<string, unknown>,
        'summary',
      );
    });
  });

  it('rejects invalid facility type', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.data = {
        ...invalid.data,
        origin_location: {
          ...invalid.data.origin_location,
          facility_type: 'Invalid Facility' as unknown as
            | 'Collection Point'
            | 'Recycling Facility'
            | 'Administrative Office'
            | 'Other'
            | undefined,
        },
      };
    });
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => structuredClone(base),
      (data) => {
        expect(data.schema.type).toBe('RecycledID');
        expect(data.attributes).toHaveLength(11);
        expect(data.data.summary.recycled_mass_kg).toBeGreaterThan(0);
      },
    );
  });
});
