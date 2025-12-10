import { describe, it, expect } from 'vitest';

import { CreditRetirementReceiptDataSchema } from '../credit-retirement-receipt.data.schema';
import exampleJson from '../../../schemas/ipfs/credit-retirement-receipt/credit-retirement-receipt.example.json';

describe('CreditRetirementReceiptDataSchema', () => {
  it('validates example data', () => {
    const result = CreditRetirementReceiptDataSchema.safeParse(
      exampleJson.data,
    );

    expect(result.success).toBe(true);
  });

  it('rejects retired_amount greater than total_amount', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.certificates[0].retired_amount =
      invalid.certificates[0].total_amount + 1;

    const result = CreditRetirementReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires credits_retired amounts to sum to retired_amount', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.certificates[0].credits_retired[0].amount =
      invalid.certificates[0].retired_amount - 1;

    const result = CreditRetirementReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires credit_symbol to exist in credits list', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.certificates[0].credits_retired[0].credit_symbol = 'UNKNOWN';

    const result = CreditRetirementReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires credit_symbol to match referenced credit slug symbol', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.certificates[0].credits_retired[0].credit_symbol = 'C-BIOW';

    const result = CreditRetirementReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires certificate collection slug to exist in collections', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.certificates[0].collection_slug = 'unknown-collection';

    const result = CreditRetirementReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires summary collection_slugs to include all collections', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.summary.collection_slugs =
      invalid.summary.collection_slugs.slice(1);

    const result = CreditRetirementReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires summary certificate_types to include all certificates', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.summary.certificate_types =
      invalid.summary.certificate_types.slice(1);

    const result = CreditRetirementReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires summary credit symbols to appear in certificate retirements', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.certificates.forEach((certificate) => {
      certificate.credits_retired = certificate.credits_retired.map(
        (credit) => ({
          ...credit,
          credit_symbol: 'C-CARB',
        }),
      );
    });

    const result = CreditRetirementReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires credit amounts to equal retired totals by symbol', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.credits[0].amount = 0;

    const result = CreditRetirementReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires certificate credit slug to exist in credits', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.certificates[0].credits_retired[0].credit_slug = 'unknown-credit';

    const result = CreditRetirementReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('requires summary credit_symbols to include all credits', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.summary.credit_symbols = invalid.summary.credit_symbols.slice(1);

    const result = CreditRetirementReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects summary credit_symbols not present in credits', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.summary.credit_symbols = [
      ...invalid.summary.credit_symbols,
      'EXTRA-CREDIT',
    ];

    const result = CreditRetirementReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects summary collection_slugs not present in collections', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.summary.collection_slugs = [
      ...invalid.summary.collection_slugs,
      'extra-collection',
    ];

    const result = CreditRetirementReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects summary certificate_types not present in certificates', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.summary.certificate_types = [
      ...invalid.summary.certificate_types,
      'ExtraType',
    ];

    const result = CreditRetirementReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates totals when certificates lack matching slugs', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.certificates = invalid.certificates.map((certificate) => ({
      ...certificate,
      collection_slug: 'unknown-collection',
      credit_slug: 'unknown-credit',
    }));

    const result = CreditRetirementReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('handles collections without certificate references', () => {
    const valid = structuredClone(exampleJson.data);
    valid.collections.push({
      slug: 'unused-collection',
      external_id: '00000000-0000-0000-0000-000000000000',
      name: 'Unused Collection',
      external_url: 'https://example.com/unused-collection',
      uri: 'ipfs://unused-collection',
      amount: 0,
    });
    valid.summary.collection_slugs = [
      ...valid.summary.collection_slugs,
      'unused-collection',
    ];

    const result = CreditRetirementReceiptDataSchema.safeParse(valid);

    expect(result.success).toBe(false);
  });

  it('requires collection amounts to equal retired totals', () => {
    const invalid = structuredClone(exampleJson.data);
    invalid.collections[0].amount = 0;

    const result = CreditRetirementReceiptDataSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });
});
