import { expect, it } from 'vitest';
import { z } from 'zod';

import type { WasteSubtype } from '../shared';
import { expectSchemaInvalid } from './schema-assertions';

type SourceWasteSubtypeRecord = {
  data: { waste_properties: { subtype: WasteSubtype } };
};

/**
 * Registers the tests proving that a certificate schema accepts and preserves the
 * `Pulp, Paper and Cardboard` and `Textile` subtypes in the waste properties it
 * inherits from its source MassID, and rejects a subtype outside the canonical list.
 */
export function runSourceWasteSubtypeCases<T extends SourceWasteSubtypeRecord>(
  schema: z.ZodType<T>,
  base: T,
) {
  it.each(['Pulp, Paper and Cardboard', 'Textile'] as const)(
    'accepts and preserves the "%s" source waste subtype',
    (subtype) => {
      const input: SourceWasteSubtypeRecord = structuredClone(base);
      input.data.waste_properties.subtype = subtype;

      expect(schema.safeParse(input)).toEqual({ success: true, data: input });
    },
  );

  it('rejects a source waste subtype outside the canonical list', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      const draft: SourceWasteSubtypeRecord = invalid;
      draft.data.waste_properties.subtype =
        'Textiles' as unknown as WasteSubtype;
    });
  });
}
