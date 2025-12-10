import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectIssuesContain,
  expectSchemaInvalid,
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
} from '../../test-utils';
import { MassIDIpfsSchema } from '../mass-id.schema';
import exampleJson from '../../../schemas/ipfs/mass-id/mass-id.example.json';

describe('MassIDIpfsSchema', () => {
  const schema = MassIDIpfsSchema;
  const base = exampleJson as z.input<typeof schema>;

  it('validates example.json successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it('rejects invalid data', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      (invalid as typeof base & { tokenId?: string }).tokenId = 'invalid';
    });
  });

  it('rejects missing required fields', () => {
    expectSchemaInvalidWithout(schema, base, 'schema');
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => structuredClone(base),
      (data) => {
        expect(data.schema.type).toBe('MassID');
        expect(data.blockchain.token_id).toBe('123');
      },
    );
  });

  it('rejects duplicate trait_type in attributes', () => {
    expectIssuesContain(schema, () => {
      const attributes = base.attributes.slice(0, -1);
      attributes.push(structuredClone(attributes[0]));

      return {
        ...base,
        attributes,
      };
    }, ['Items must be unique']);
  });

  it('rejects duplicate URLs in external_links', () => {
    expectIssuesContain(schema, () => {
      const externalLinks = base.external_links ?? [];
      return {
        ...base,
        external_links: [
          ...externalLinks,
          {
            label: 'Duplicate Link',
            url: externalLinks[0]?.url ?? 'ipfs://duplicate',
            description: 'This has a duplicate URL',
          },
        ],
      };
    }, ['External link URLs must be unique']);
  });
});
