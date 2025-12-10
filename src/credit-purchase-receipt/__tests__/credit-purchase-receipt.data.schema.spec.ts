import { describe, it, expect } from 'vitest';

import { CreditPurchaseReceiptDataSchema } from '../credit-purchase-receipt.data.schema';
import exampleJson from '../../../schemas/ipfs/credit-purchase-receipt/credit-purchase-receipt.example.json';

describe('CreditPurchaseReceiptDataSchema', () => {
  it('validates example data', () => {
    const result = CreditPurchaseReceiptDataSchema.safeParse(exampleJson.data);

    expect(result.success).toBe(true);
  });

  it('requires retirement details when credits include retirement amounts', () => {
    const invalid = structuredClone(exampleJson.data);
    Reflect.deleteProperty(invalid as Record<string, unknown>, 'retirement');

    const result = CreditPurchaseReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects retirement details when no credits have retirement amounts', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.credits = invalid.credits.map((credit) => ({
      ...credit,
      retirement_amount: 0,
    }));

    const result = CreditPurchaseReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires certificate collection slug to exist in collections', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.certificates[0].collection_slug = 'unknown-collection';

    const result = CreditPurchaseReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects retired_amount greater than purchased_amount', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.certificates[0].retired_amount =
      invalid.certificates[0].purchased_amount + 1;

    const result = CreditPurchaseReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires summary certificate_types to match certificates', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.summary.certificate_types = [
      ...invalid.summary.certificate_types,
      'NewType',
    ];

    const result = CreditPurchaseReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires certificate types to be listed in summary', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.certificates[0].type = 'NewType';

    const result = CreditPurchaseReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires summary credit_symbols to include all credits', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.summary.credit_symbols = invalid.summary.credit_symbols.slice(1);

    const result = CreditPurchaseReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects summary credit_symbols not present in credits', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.summary.credit_symbols = [
      ...invalid.summary.credit_symbols,
      'EXTRA-CREDIT',
    ];

    const result = CreditPurchaseReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects summary collection_slugs not present in collections', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.summary.collection_slugs = [
      ...invalid.summary.collection_slugs,
      'extra-collection',
    ];

    const result = CreditPurchaseReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires certificate credit slug to exist in credits', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.certificates[0].credit_slug = 'unknown-credit';

    const result = CreditPurchaseReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects purchased_amount greater than total_amount', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.certificates[0].purchased_amount =
      invalid.certificates[0].total_amount + 1;

    const result = CreditPurchaseReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires credit retirement totals to match certificate retired amounts', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.credits[0].retirement_amount = 0;

    const result = CreditPurchaseReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires certificate retired amounts to align with credit retirement totals', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.certificates[0].retired_amount = 0;

    const result = CreditPurchaseReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires credit purchase totals to match certificates', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.credits[0].purchase_amount = 0;

    const result = CreditPurchaseReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates credit and collection totals when certificates are missing matching slugs', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.certificates = invalid.certificates.map((certificate) => ({
      ...certificate,
      credit_slug: 'unknown-credit',
      collection_slug: 'unknown-collection',
    }));

    const result = CreditPurchaseReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('allows undefined retirement_amount when no retirement details are provided', () => {
    const valid = structuredClone(exampleJson.data);
    Reflect.deleteProperty(valid as Record<string, unknown>, 'retirement');
    valid.credits = valid.credits.map((credit) => {
      const creditWithoutRetirement = structuredClone(credit);
      Reflect.deleteProperty(
        creditWithoutRetirement as Record<string, unknown>,
        'retirement_amount',
      );
      return creditWithoutRetirement;
    });
    valid.certificates = valid.certificates.map((certificate) => ({
      ...certificate,
      retired_amount: 0,
    }));

    const result = CreditPurchaseReceiptDataSchema.safeParse(valid);

    expect(result.success).toBe(true);
  });

  it('validates collection credit_amount equals sum of certificate purchases', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.collections[0].credit_amount = 0;

    const result = CreditPurchaseReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });
});
