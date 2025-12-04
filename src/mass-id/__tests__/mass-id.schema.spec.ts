import { describe, it, expect } from 'vitest';
import { MassIDIpfsSchema } from '../mass-id.schema';
import exampleJson from '../../../schemas/ipfs/mass-id/mass-id.example.json';

describe('MassIDIpfsSchema', () => {
  it('validates example.json successfully', () => {
    const result = MassIDIpfsSchema.safeParse(exampleJson);

    expect(result.success).toBe(true);
  });

  it('rejects invalid data', () => {
    const invalid = { ...exampleJson, tokenId: 'invalid' };
    const result = MassIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { schema, ...withoutSchema } = exampleJson;
    const result = MassIDIpfsSchema.safeParse(withoutSchema);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = MassIDIpfsSchema.safeParse(exampleJson);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.schema.type).toBe('MassID');
      expect(data.blockchain.token_id).toBe('123');
    }
  });

  it('rejects duplicate trait_type in attributes', () => {
    // Create duplicate by adding an attribute with same trait_type as existing one
    const attributes = exampleJson.attributes.slice(0, -1); // Remove last to stay under max
    attributes.push({
      trait_type: attributes[0].trait_type,
      value: 'Different Value',
    });

    const invalid = {
      ...exampleJson,
      attributes,
    };
    const result = MassIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);

    if (!result.success) {
      const errorMessages = result.error.issues
        .map((issue) => issue.message)
        .join(' ');
      expect(errorMessages).toContain('Items must be unique');
    }
  });

  it('rejects duplicate URLs in external_links', () => {
    const invalid = {
      ...exampleJson,
      external_links: [
        ...exampleJson.external_links,
        {
          label: 'Duplicate Link',
          url: exampleJson.external_links[0].url,
          description: 'This has a duplicate URL',
        },
      ],
    };
    const result = MassIDIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.issues.some((issue) =>
          issue.message.includes('External link URLs must be unique'),
        ),
      ).toBe(true);
    }
  });
});
