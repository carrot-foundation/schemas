import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectSchemaInvalid,
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
} from '../../test-utils';
import { CreditRetirementReceiptIpfsSchema } from '../credit-retirement-receipt.schema';
import exampleJson from '../../../schemas/ipfs/credit-retirement-receipt/credit-retirement-receipt.example.json';

describe('CreditRetirementReceiptIpfsSchema', () => {
  const schema = CreditRetirementReceiptIpfsSchema;
  const base = exampleJson as z.input<typeof schema>;

  it('validates example.json successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it('rejects invalid schema type', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.schema = {
        ...invalid.schema,
        type: 'CreditPurchaseReceipt' as unknown as typeof invalid.schema.type,
      };
    });
  });

  it('rejects missing data', () => {
    expectSchemaInvalidWithout(schema, base, 'data');
  });

  it('rejects mismatched totals', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.data.summary.total_retirement_amount =
        invalid.data.summary.total_retirement_amount + 1;
    });
  });

  it('rejects certificate credit slug not present in credits', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.data.certificates[0].credits_retired[0].credit_slug =
        'unknown-credit';
    });
  });

  it('rejects attributes that do not align with data totals', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.attributes = invalid.attributes.map((attribute) =>
        attribute.trait_type === 'Total Credits Retired'
          ? { ...attribute, value: 999999 }
          : attribute,
      ) as typeof invalid.attributes;
    });
  });

  it('rejects retirement date attribute that does not match summary retirement date', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.attributes = invalid.attributes.map((attribute) =>
        attribute.trait_type === 'Retirement Date'
          ? { ...attribute, value: 1737410400000 }
          : attribute,
      ) as typeof invalid.attributes;
    });
  });

  it('rejects missing beneficiary attribute', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.attributes = invalid.attributes.filter(
        (attribute) => attribute.trait_type !== 'Beneficiary',
      );
    });
  });

  it('rejects credit attribute value that does not match retired amount', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      const firstCreditSymbol = invalid.data.summary.credit_symbols[0];
      invalid.attributes = invalid.attributes.map((attribute) =>
        attribute.trait_type === firstCreditSymbol
          ? { ...attribute, value: Number(attribute.value) + 1 }
          : attribute,
      ) as typeof invalid.attributes;
    });
  });

  it('rejects collection attribute value that does not match retired amount', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      const firstCollectionName = invalid.data.collections[0].name;
      invalid.attributes = invalid.attributes.map((attribute) =>
        attribute.trait_type === firstCollectionName
          ? { ...attribute, value: Number(attribute.value) + 1 }
          : attribute,
      ) as typeof invalid.attributes;
    });
  });

  it('rejects missing credit symbol attribute', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      const firstCreditSymbol = invalid.data.summary.credit_symbols[0];
      invalid.attributes = invalid.attributes.filter(
        (attribute) => attribute.trait_type !== firstCreditSymbol,
      );
    });
  });

  it('allows credit holder identity to be omitted', () => {
    expectSchemaValid(schema, () => {
      const withoutCreditHolderIdentity = structuredClone(base);
      Reflect.deleteProperty(
        withoutCreditHolderIdentity.data.credit_holder as Record<
          string,
          unknown
        >,
        'identity',
      );
      withoutCreditHolderIdentity.attributes =
        withoutCreditHolderIdentity.attributes.filter(
          (attribute) => attribute.trait_type !== 'Credit Holder',
        );

      return withoutCreditHolderIdentity;
    });
  });

  it('rejects missing collection attribute', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      const firstCollectionName = invalid.data.collections[0].name;
      invalid.attributes = invalid.attributes.filter(
        (attribute) => attribute.trait_type !== firstCollectionName,
      );
    });
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => structuredClone(base),
      (data) => {
        expect(data.schema.type).toBe('CreditRetirementReceipt');
        expect(data.data.summary.total_certificates).toBe(3);
        expect(data.data.certificates[0].mass_id.token_id).toBe('123');
      },
    );
  });
});
