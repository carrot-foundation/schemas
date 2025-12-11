import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
} from '../../test-utils';
import { runReceiptInvalidCases } from '../../shared/schemas/receipt/__tests__/ipfs-receipt.test-helpers';
import { CreditRetirementReceiptIpfsSchema } from '../credit-retirement-receipt.schema';
import exampleJson from '../../../schemas/ipfs/credit-retirement-receipt/credit-retirement-receipt.example.json';

describe('CreditRetirementReceiptIpfsSchema', () => {
  const schema = CreditRetirementReceiptIpfsSchema;
  const base = exampleJson as z.input<typeof schema>;

  it('validates example.json successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it('rejects missing data', () => {
    expectSchemaInvalidWithout(schema, base, 'data');
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

  runReceiptInvalidCases(schema, base, [
    {
      description: 'rejects invalid schema type',
      mutate: (invalid) => {
        invalid.schema = {
          ...invalid.schema,
          type: 'CreditPurchaseReceipt' as unknown as typeof invalid.schema.type,
        };
      },
    },
    {
      description: 'rejects mismatched totals',
      mutate: (invalid) => {
        invalid.data.summary.total_retirement_amount =
          invalid.data.summary.total_retirement_amount + 1;
      },
    },
    {
      description: 'rejects certificate credit slug not present in credits',
      mutate: (invalid) => {
        invalid.data.certificates[0].credits_retired[0].credit_slug =
          'unknown-credit';
      },
    },
    {
      description: 'rejects attributes that do not align with data totals',
      mutate: (invalid) => {
        invalid.attributes = invalid.attributes.map((attribute) => {
          if (attribute.trait_type === 'Total Credits Retired') {
            return { ...attribute, value: 999999 };
          }
          return attribute;
        }) as typeof invalid.attributes;
      },
    },
    {
      description:
        'rejects retirement date attribute that does not match summary retirement date',
      mutate: (invalid) => {
        invalid.attributes = invalid.attributes.map((attribute) => {
          if (attribute.trait_type === 'Retirement Date') {
            return { ...attribute, value: 1737410400000 };
          }
          return attribute;
        }) as typeof invalid.attributes;
      },
    },
    {
      description: 'rejects missing beneficiary attribute',
      mutate: (invalid) => {
        invalid.attributes = invalid.attributes.filter(
          (attribute) => attribute.trait_type !== 'Beneficiary',
        );
      },
    },
    {
      description:
        'rejects credit attribute value that does not match retired amount',
      mutate: (invalid) => {
        const firstCreditSymbol = invalid.data.summary.credit_symbols[0];
        invalid.attributes = invalid.attributes.map((attribute) => {
          if (attribute.trait_type === firstCreditSymbol) {
            return { ...attribute, value: Number(attribute.value) + 1 };
          }
          return attribute;
        }) as typeof invalid.attributes;
      },
    },
    {
      description:
        'rejects collection attribute value that does not match retired amount',
      mutate: (invalid) => {
        const firstCollectionName = invalid.data.collections[0].name;
        invalid.attributes = invalid.attributes.map((attribute) => {
          if (attribute.trait_type === firstCollectionName) {
            return { ...attribute, value: Number(attribute.value) + 1 };
          }
          return attribute;
        }) as typeof invalid.attributes;
      },
    },
    {
      description: 'rejects missing credit symbol attribute',
      mutate: (invalid) => {
        const firstCreditSymbol = invalid.data.summary.credit_symbols[0];
        invalid.attributes = invalid.attributes.filter(
          (attribute) => attribute.trait_type !== firstCreditSymbol,
        );
      },
    },
    {
      description:
        'rejects missing credit holder attribute when identity is provided',
      mutate: (invalid) => {
        const creditHolderName = invalid.data.credit_holder.identity?.name;
        expect(creditHolderName).toBeDefined();

        invalid.attributes = invalid.attributes.filter(
          (attribute) => attribute.trait_type !== 'Credit Holder',
        );
      },
    },
    {
      description:
        'rejects credit holder attribute that does not match identity name',
      mutate: (invalid) => {
        const creditHolderName = invalid.data.credit_holder.identity?.name;
        expect(creditHolderName).toBeDefined();

        invalid.attributes = invalid.attributes.map((attribute) => {
          if (attribute.trait_type === 'Credit Holder') {
            return { ...attribute, value: `${creditHolderName}-mismatch` };
          }
          return attribute;
        }) as typeof invalid.attributes;
      },
    },
    {
      description: 'rejects missing collection attribute',
      mutate: (invalid) => {
        const firstCollectionName = invalid.data.collections[0].name;
        invalid.attributes = invalid.attributes.filter(
          (attribute) => attribute.trait_type !== firstCollectionName,
        );
      },
    },
  ]);

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
