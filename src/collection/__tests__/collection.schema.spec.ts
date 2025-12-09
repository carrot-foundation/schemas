import { describe, expect, it } from 'vitest';
import { CollectionSchema } from '../collection.schema';
import exampleJson from '../../../schemas/ipfs/collection/collection.example.json';

describe('CollectionSchema', () => {
  it('validates example.json successfully', () => {
    const result = CollectionSchema.safeParse(exampleJson);

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

    const result = CollectionSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image, ...withoutImage } = exampleJson;
    const result = CollectionSchema.safeParse(withoutImage);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = CollectionSchema.safeParse(exampleJson);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.schema.type).toBe('Collection');
      expect(data.name).toBe(exampleJson.name);
    }
  });
});
