import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectIssuesContain,
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
          9,
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
  ])('$description', ({ mutate }) => {
    expectSchemaInvalid(schema, base, mutate);
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => structuredClone(base),
      (data) => {
        expect(data.schema.type).toBe('RecycledID');
        expect(data.attributes).toHaveLength(10);
        expect(data.data.summary.recycled_mass_kg).toBeGreaterThan(0);
      },
    );
  });

  it('rejects name with mismatched token_id', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.name = 'RecycledID #999 • BOLD Recycling • 3.25t Recycled';
      return next;
    }, ['Name token_id must match blockchain.token_id: 789']);
  });

  it('rejects short_name with mismatched token_id', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.short_name = 'RecycledID #999';
      return next;
    }, ['Short name token_id must match blockchain.token_id: 789']);
  });

  it('rejects name that does not match regex pattern', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.name = 'Invalid Name Format';
      return next;
    }, ['Name token_id must match blockchain.token_id: 789']);
  });

  it('rejects short_name that does not match regex pattern', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.short_name = 'Invalid Short Name';
      return next;
    }, ['Short name token_id must match blockchain.token_id: 789']);
  });

  it('rejects name with correct token_id but invalid format', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.name = 'RecycledID #789 • Invalid Format';
      return next;
    }, ['Name must match format']);
  });

  it('rejects short_name with correct token_id but invalid format', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.short_name = 'RecycledID #789 Extra';
      return next;
    }, ['Short name must match format']);
  });

  it('requires attributes to match data properties', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      const recycledMassAttrIndex = next.attributes.findIndex(
        (attr) => attr.trait_type === 'Recycled Mass Weight (kg)',
      );
      if (recycledMassAttrIndex >= 0) {
        next.attributes[recycledMassAttrIndex].value = 999.99;
      }
      return next;
    }, [
      'Recycled Mass Weight (kg) attribute must equal data.summary.recycled_mass_kg',
    ]);
  });

  it('requires Credit Amount attribute to match summary', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      const creditAmountAttrIndex = next.attributes.findIndex(
        (attr) => attr.trait_type === 'Credit Amount',
      );
      if (creditAmountAttrIndex >= 0) {
        next.attributes[creditAmountAttrIndex].value = 999.99;
      }
      return next;
    }, ['Credit Amount attribute must equal data.summary.credit_amount']);
  });

  it('requires MassID attribute to match data.mass_id.token_id', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      const massIdAttrIndex = next.attributes.findIndex(
        (attr) => attr.trait_type === 'MassID',
      );
      if (massIdAttrIndex >= 0) {
        next.attributes[massIdAttrIndex].value = '#999';
      }
      return next;
    }, ['MassID attribute must equal data.mass_id.token_id as #<token_id>']);
  });

  it('requires Origin City attribute to match data', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      const originCityAttrIndex = next.attributes.findIndex(
        (attr) => attr.trait_type === 'Origin City',
      );
      if (originCityAttrIndex >= 0) {
        next.attributes[originCityAttrIndex].value = 'Invalid City';
      }
      return next;
    }, ['Origin City attribute must equal data.origin_location.city']);
  });
});
