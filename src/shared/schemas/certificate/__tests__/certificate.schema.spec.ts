import { describe, expect, it } from 'vitest';
import {
  expectSchemaInvalid,
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
  validWastePropertiesFixture,
} from '../../../../test-utils';
import { WastePropertiesSchema } from '../certificate.schema';

describe('WastePropertiesSchema', () => {
  const schema = WastePropertiesSchema;
  const base = validWastePropertiesFixture;

  it('validates valid waste properties successfully', () => {
    expectSchemaValid(schema, () => ({ ...base }));
  });

  it('rejects missing type', () => {
    expectSchemaInvalidWithout(schema, base, 'type');
  });

  it('rejects missing subtype', () => {
    expectSchemaInvalidWithout(schema, base, 'subtype');
  });

  it('rejects missing weight_kg', () => {
    expectSchemaInvalidWithout(schema, base, 'weight_kg');
  });

  it('rejects empty type', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.type = '' as unknown as (typeof invalid)['type'];
    });
  });

  it('rejects negative weight_kg', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.weight_kg = -100;
    });
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => ({ ...base }),
      (data) => {
        expect(data.type).toBe(base.type);
        expect(data.subtype).toBe(base.subtype);
        expect(data.weight_kg).toBe(base.weight_kg);
      },
    );
  });

  it('rejects additional properties', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      (invalid as typeof base & { extra_field?: string }).extra_field =
        'not allowed';
    });
  });
});
