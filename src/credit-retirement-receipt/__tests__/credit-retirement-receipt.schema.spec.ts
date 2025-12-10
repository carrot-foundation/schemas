import { describe, it, expect } from 'vitest';
import { CreditRetirementReceiptIpfsSchema } from '../credit-retirement-receipt.schema';
import exampleJson from '../../../schemas/ipfs/credit-retirement-receipt/credit-retirement-receipt.example.json';

describe('CreditRetirementReceiptIpfsSchema', () => {
  it('validates example.json successfully', () => {
    const result = CreditRetirementReceiptIpfsSchema.safeParse(exampleJson);

    expect(result.success).toBe(true);
  });

  it('rejects invalid schema type', () => {
    const invalid = {
      ...exampleJson,
      schema: {
        ...exampleJson.schema,
        type: 'CreditPurchaseReceipt',
      },
    };

    const result = CreditRetirementReceiptIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects missing data', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, ...withoutData } = exampleJson;
    const result = CreditRetirementReceiptIpfsSchema.safeParse(withoutData);

    expect(result.success).toBe(false);
  });

  it('rejects mismatched totals', () => {
    const invalid = structuredClone(exampleJson);
    invalid.data.summary.total_retirement_amount =
      invalid.data.summary.total_retirement_amount + 1;

    const result = CreditRetirementReceiptIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects certificate credit slug not present in credits', () => {
    const invalid = structuredClone(exampleJson);
    invalid.data.certificates[0].credits_retired[0].credit_slug =
      'unknown-credit';

    const result = CreditRetirementReceiptIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects attributes that do not align with data totals', () => {
    const invalid = structuredClone(exampleJson);
    invalid.attributes = invalid.attributes.map((attribute) =>
      attribute.trait_type === 'Total Credits Retired'
        ? { ...attribute, value: 999999 }
        : attribute,
    ) as typeof invalid.attributes;

    const result = CreditRetirementReceiptIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects retirement date attribute that does not match summary retirement date', () => {
    const invalid = structuredClone(exampleJson);
    invalid.attributes = invalid.attributes.map((attribute) =>
      attribute.trait_type === 'Retirement Date'
        ? { ...attribute, value: 1737410400000 }
        : attribute,
    ) as typeof invalid.attributes;

    const result = CreditRetirementReceiptIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects missing beneficiary attribute', () => {
    const invalid = structuredClone(exampleJson);
    invalid.attributes = invalid.attributes.filter(
      (attribute) => attribute.trait_type !== 'Beneficiary',
    );

    const result = CreditRetirementReceiptIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects credit attribute value that does not match retired amount', () => {
    const invalid = structuredClone(exampleJson);
    const firstCreditSymbol = invalid.data.summary.credit_symbols[0];
    invalid.attributes = invalid.attributes.map((attribute) =>
      attribute.trait_type === firstCreditSymbol
        ? { ...attribute, value: Number(attribute.value) + 1 }
        : attribute,
    ) as typeof invalid.attributes;

    const result = CreditRetirementReceiptIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects collection attribute value that does not match retired amount', () => {
    const invalid = structuredClone(exampleJson);
    const firstCollectionName = invalid.data.collections[0].name;
    invalid.attributes = invalid.attributes.map((attribute) =>
      attribute.trait_type === firstCollectionName
        ? { ...attribute, value: Number(attribute.value) + 1 }
        : attribute,
    ) as typeof invalid.attributes;

    const result = CreditRetirementReceiptIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('rejects missing credit symbol attribute', () => {
    const invalid = structuredClone(exampleJson);
    const firstCreditSymbol = invalid.data.summary.credit_symbols[0];
    invalid.attributes = invalid.attributes.filter(
      (attribute) => attribute.trait_type !== firstCreditSymbol,
    );

    const result = CreditRetirementReceiptIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('allows credit holder identity to be omitted', () => {
    const withoutCreditHolderIdentity = structuredClone(exampleJson);
    Reflect.deleteProperty(
      withoutCreditHolderIdentity.data.credit_holder as Record<string, unknown>,
      'identity',
    );
    withoutCreditHolderIdentity.attributes =
      withoutCreditHolderIdentity.attributes.filter(
        (attribute) => attribute.trait_type !== 'Credit Holder',
      );

    const result = CreditRetirementReceiptIpfsSchema.safeParse(
      withoutCreditHolderIdentity,
    );

    expect(result.success).toBe(true);
  });

  it('rejects missing collection attribute', () => {
    const invalid = structuredClone(exampleJson);
    const firstCollectionName = invalid.data.collections[0].name;
    invalid.attributes = invalid.attributes.filter(
      (attribute) => attribute.trait_type !== firstCollectionName,
    );

    const result = CreditRetirementReceiptIpfsSchema.safeParse(invalid);

    expect(result.success).toBe(false);
  });

  it('validates type inference works correctly', () => {
    const result = CreditRetirementReceiptIpfsSchema.safeParse(exampleJson);

    expect(result.success).toBe(true);

    if (result.success) {
      const data: typeof result.data = result.data;

      expect(data.schema.type).toBe('CreditRetirementReceipt');
      expect(data.data.summary.total_certificates).toBe(3);
      expect(data.data.certificates[0].mass_id.token_id).toBe('123');
    }
  });
});
