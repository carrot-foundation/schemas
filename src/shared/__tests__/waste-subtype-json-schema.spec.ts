import { describe, expect, it } from 'vitest';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

import gasExample from '../../../schemas/ipfs/gas-id/gas-id.example.json';
import massExample from '../../../schemas/ipfs/mass-id/mass-id.example.json';
import recycledExample from '../../../schemas/ipfs/recycled-id/recycled-id.example.json';

import gasJsonSchema from '../../../schemas/ipfs/gas-id/gas-id.schema.json';
import massJsonSchema from '../../../schemas/ipfs/mass-id/mass-id.schema.json';
import recycledJsonSchema from '../../../schemas/ipfs/recycled-id/recycled-id.schema.json';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const families = [
  {
    name: 'MassID',
    validate: ajv.compile(massJsonSchema),
    example: massExample,
    traitPrefix: '',
  },
  {
    name: 'GasID',
    validate: ajv.compile(gasJsonSchema),
    example: gasExample,
    traitPrefix: 'Source ',
  },
  {
    name: 'RecycledID',
    validate: ajv.compile(recycledJsonSchema),
    example: recycledExample,
    traitPrefix: 'Source ',
  },
] as const;

type Family = (typeof families)[number];

// The generated JSON Schemas carry only the enum; attribute/data agreement is
// a Zod refinement, so the MassID trait is kept in sync to isolate the enum.
function withWasteProperties(
  family: Family,
  overrides: { type?: string; subtype?: string },
) {
  const next = structuredClone(family.example) as {
    data: { waste_properties: { type: string; subtype: string } };
    attributes: { trait_type: string; value: unknown }[];
  };
  Object.assign(next.data.waste_properties, overrides);
  for (const attribute of next.attributes) {
    if (
      overrides.type !== undefined &&
      attribute.trait_type === `${family.traitPrefix}Waste Type`
    ) {
      attribute.value = overrides.type;
    }
    if (
      overrides.subtype !== undefined &&
      attribute.trait_type === 'Waste Subtype'
    ) {
      attribute.value = overrides.subtype;
    }
  }
  return next;
}

describe.each(families)('generated $name JSON Schema', (family) => {
  it('validates the unmodified example', () => {
    expect(family.validate(family.example)).toBe(true);
  });

  it.each(['Pulp, Paper and Cardboard', 'Textile'])(
    'accepts the "%s" waste subtype',
    (subtype) => {
      expect(family.validate(withWasteProperties(family, { subtype }))).toBe(
        true,
      );
    },
  );

  it('rejects a waste subtype outside the canonical list', () => {
    expect(
      family.validate(withWasteProperties(family, { subtype: 'Textiles' })),
    ).toBe(false);
  });

  it('keeps rejecting Textile as the waste type', () => {
    expect(
      family.validate(
        withWasteProperties(family, { type: 'Textile', subtype: 'Textile' }),
      ),
    ).toBe(false);
  });
});
