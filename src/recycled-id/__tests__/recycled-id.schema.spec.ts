import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectSchemaInvalid,
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

  it.each([
    {
      description: 'rejects invalid schema type',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.schema = {
          ...invalid.schema,
          type: 'InvalidType' as unknown as typeof invalid.schema.type,
        };
      },
    },
    {
      description: 'rejects missing required fields',
      mutate: (invalid: z.input<typeof schema>) => {
        Reflect.deleteProperty(invalid as Record<string, unknown>, 'schema');
      },
    },
    {
      description: 'rejects attributes array with wrong length',
      mutate: (invalid: z.input<typeof schema>) => {
        invalid.attributes = invalid.attributes.slice(
          0,
          10,
        ) as typeof invalid.attributes;
      },
    },
    {
      description: 'rejects attributes array with wrong order',
      mutate: (invalid: z.input<typeof schema>) => {
        const attributes = invalid.attributes.slice() as unknown[];
        [attributes[0], attributes[1]] = [attributes[1], attributes[0]];
        invalid.attributes = attributes as typeof invalid.attributes;
      },
    },
    {
      description: 'rejects missing summary in data',
      mutate: (invalid: z.input<typeof schema>) => {
        Reflect.deleteProperty(
          invalid.data as Record<string, unknown>,
          'summary',
        );
      },
    },
    {
      description: 'rejects invalid facility type',
      mutate: (invalid: z.input<typeof schema>) => {
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
      },
    },
  ])('$description', ({ mutate }) => {
    expectSchemaInvalid(schema, base, mutate);
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
