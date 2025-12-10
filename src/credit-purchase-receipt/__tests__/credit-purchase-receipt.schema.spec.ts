import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectSchemaInvalid,
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
} from '../../test-utils';
import { CreditPurchaseReceiptIpfsSchema } from '../credit-purchase-receipt.schema';
import exampleJson from '../../../schemas/ipfs/credit-purchase-receipt/credit-purchase-receipt.example.json';

describe('CreditPurchaseReceiptIpfsSchema', () => {
  const schema = CreditPurchaseReceiptIpfsSchema;
  const base = exampleJson as z.input<typeof schema>;

  it('validates example.json successfully', () => {
    expectSchemaValid(schema, () => structuredClone(base));
  });

  it('rejects invalid schema type', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.schema = {
        ...invalid.schema,
        type: 'PurchaseID' as unknown as typeof invalid.schema.type,
      };
    });
  });

  it('rejects missing data', () => {
    expectSchemaInvalidWithout(schema, base, 'data');
  });

  it('rejects mismatched totals', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.data.summary.total_credits =
        invalid.data.summary.total_credits + 1;
    });
  });

  it('rejects certificate credit slug not present in credits', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.data.certificates[0].credit_slug = 'unknown-credit';
    });
  });

  it('rejects attributes that do not align with data totals', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.attributes = invalid.attributes.map((attribute) =>
        attribute.trait_type === 'Total USDC Amount'
          ? { ...attribute, value: 999999 }
          : attribute,
      ) as typeof invalid.attributes;
    });
  });

  it('rejects receiver attribute that does not match receiver identity name', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.attributes = invalid.attributes.map((attribute) =>
        attribute.trait_type === 'Receiver'
          ? { ...attribute, value: 'Wrong Receiver' }
          : attribute,
      ) as typeof invalid.attributes;
    });
  });

  it('rejects purchase date attribute that does not match summary purchase date', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      invalid.attributes = invalid.attributes.map((attribute) =>
        attribute.trait_type === 'Purchase Date'
          ? { ...attribute, value: 1738627200000 }
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

  it('rejects credit attribute value that does not match purchase amount', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      const firstCreditSymbol = invalid.data.summary.credit_symbols[0];
      invalid.attributes = invalid.attributes.map((attribute) =>
        attribute.trait_type === firstCreditSymbol
          ? { ...attribute, value: Number(attribute.value) + 1 }
          : attribute,
      ) as typeof invalid.attributes;
    });
  });

  it('rejects missing collection name attribute', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      const firstCollectionName = invalid.data.collections[0].name;
      invalid.attributes = invalid.attributes.filter(
        (attribute) => attribute.trait_type !== firstCollectionName,
      );
    });
  });

  it('rejects collection attribute value that does not match credit amount', () => {
    expectSchemaInvalid(schema, base, (invalid) => {
      const firstCollectionName = invalid.data.collections[0].name;
      invalid.attributes = invalid.attributes.map((attribute) =>
        attribute.trait_type === firstCollectionName
          ? { ...attribute, value: Number(attribute.value) + 1 }
          : attribute,
      ) as typeof invalid.attributes;
    });
  });

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
