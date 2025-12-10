import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectSchemaInvalid,
  expectSchemaTyped,
  expectSchemaValid,
} from '../../test-utils';
import { CollectionSchema } from '../collection.schema';
import exampleJson from '../../../schemas/ipfs/collection/collection.example.json';

describe('CollectionSchema', () => {
  const schema = CollectionSchema;
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
          type: 'Invalid' as unknown as typeof invalid.schema.type,
        };
      },
    },
    {
      description: 'rejects missing required fields',
      mutate: (invalid: z.input<typeof schema>) => {
        Reflect.deleteProperty(invalid as Record<string, unknown>, 'image');
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
        expect(data.schema.type).toBe('Collection');
        expect(data.name).toBe(exampleJson.name);
      },
    );
  });
});
