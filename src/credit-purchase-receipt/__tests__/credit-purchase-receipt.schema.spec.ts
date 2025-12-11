import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
} from '../../test-utils';
import { runReceiptInvalidCases } from '../../shared/schemas/receipt/__tests__/ipfs-receipt.test-helpers';
import { CreditPurchaseReceiptIpfsSchema } from '../credit-purchase-receipt.schema';
import exampleJson from '../../../schemas/ipfs/credit-purchase-receipt/credit-purchase-receipt.example.json';

describe('CreditPurchaseReceiptIpfsSchema', () => {
  const schema = CreditPurchaseReceiptIpfsSchema;
  const base = exampleJson as z.input<typeof schema>;

  it('validates example.json successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it('rejects missing data', () => {
    expectSchemaInvalidWithout(schema, base, 'data');
  });

  runReceiptInvalidCases(schema, base, [
    {
      description: 'rejects invalid schema type',
      mutate: (invalid) => {
        invalid.schema = {
          ...invalid.schema,
          type: 'PurchaseID' as unknown as typeof invalid.schema.type,
        };
      },
    },
    {
      description: 'rejects mismatched totals',
      mutate: (invalid) => {
        invalid.data.summary.total_credits =
          invalid.data.summary.total_credits + 1;
      },
    },
    {
      description: 'rejects certificate credit slug not present in credits',
      mutate: (invalid) => {
        invalid.data.certificates[0].credit_slug = 'unknown-credit';
      },
    },
    {
      description: 'rejects attributes that do not align with data totals',
      mutate: (invalid) => {
        invalid.attributes = invalid.attributes.map((attribute) => {
          if (attribute.trait_type === 'Total USDC Amount') {
            return { ...attribute, value: 999999 };
          }
          return attribute;
        }) as typeof invalid.attributes;
      },
    },
    {
      description:
        'rejects receiver attribute that does not match receiver identity name',
      mutate: (invalid) => {
        invalid.attributes = invalid.attributes.map((attribute) => {
          if (attribute.trait_type === 'Receiver') {
            return { ...attribute, value: 'Wrong Receiver' };
          }
          return attribute;
        }) as typeof invalid.attributes;
      },
    },
    {
      description:
        'rejects purchase date attribute that does not match summary purchase date',
      mutate: (invalid) => {
        invalid.attributes = invalid.attributes.map((attribute) => {
          if (attribute.trait_type === 'Purchase Date') {
            return { ...attribute, value: 1738627200000 };
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
        'rejects credit attribute value that does not match purchase amount',
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
      description: 'rejects missing collection name attribute',
      mutate: (invalid) => {
        const firstCollectionName = invalid.data.collections[0].name;
        invalid.attributes = invalid.attributes.filter(
          (attribute) => attribute.trait_type !== firstCollectionName,
        );
      },
    },
    {
      description:
        'rejects collection attribute value that does not match credit amount',
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
  ]);

  it('allows receiver identity to be omitted', () => {
    expectSchemaValid(schema, () => {
      const withoutReceiverIdentity = structuredClone(base);
      Reflect.deleteProperty(
        withoutReceiverIdentity.data.parties.receiver as Record<
          string,
          unknown
        >,
        'identity',
      );
      withoutReceiverIdentity.attributes =
        withoutReceiverIdentity.attributes.filter(
          (attribute) => attribute.trait_type !== 'Receiver',
        );
      return withoutReceiverIdentity;
    });
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => structuredClone(base),
      (data) => {
        expect(data.schema.type).toBe('CreditPurchaseReceipt');
        expect(data.data.summary.total_certificates).toBe(3);
        expect(data.data.certificates[0].mass_id.token_id).toBe('123');
      },
    );
  });
});
