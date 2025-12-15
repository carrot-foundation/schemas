import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
  runReceiptInvalidCases,
} from '../../test-utils';
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
        invalid.data.summary.total_credits_retired =
          invalid.data.summary.total_credits_retired + 1;
      },
    },
    {
      description: 'rejects certificate credit slug not present in credits',
      mutate: (invalid) => {
        invalid.data.certificates[0].credits_retired[0].credit_slug =
          'unknown-credit' as unknown as (typeof invalid.data.certificates)[number]['credits_retired'][number]['credit_slug'];
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
        'rejects retirement date attribute that does not match summary retired_at',
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
        'rejects credit attribute value that does not match certificate retired totals',
      mutate: (invalid) => {
        const firstCreditSymbol = invalid.data.credits[0].symbol;
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
        'rejects missing credit holder attribute when identity is provided',
      mutate: (invalid) => {
        invalid.data.credit_holder.identity = {
          name: 'Test Credit Holder',
          external_id: '00000000-0000-0000-0000-000000000000',
          external_url: 'https://example.com/test',
        };

        invalid.attributes = invalid.attributes.filter(
          (attribute) => attribute.trait_type !== 'Credit Holder',
        );
      },
    },
    {
      description:
        'rejects credit holder attribute that does not match identity name',
      mutate: (invalid) => {
        invalid.data.credit_holder.identity = {
          name: 'Test Credit Holder',
          external_id: '00000000-0000-0000-0000-000000000000',
          external_url: 'https://example.com/test',
        };

        invalid.attributes = invalid.attributes.map((attribute) => {
          if (attribute.trait_type === 'Credit Holder') {
            return { ...attribute, value: 'Test Credit Holder-mismatch' };
          }
          return attribute;
        }) as typeof invalid.attributes;
      },
    },
    {
      description: 'rejects missing Retirement Date attribute',
      mutate: (invalid) => {
        invalid.attributes = invalid.attributes.filter(
          (attribute) => attribute.trait_type !== 'Retirement Date',
        );
      },
    },
    {
      description: 'rejects invalid retired_at date in summary',
      mutate: (invalid) => {
        invalid.data.summary.retired_at = 'invalid-date';
      },
    },
    {
      description:
        'rejects Retirement Date attribute that does not match retired_at timestamp',
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
      description:
        'rejects Purchase Receipt attribute that does not match purchase_receipt.token_id',
      mutate: (invalid) => {
        if (invalid.data.purchase_receipt) {
          invalid.attributes = invalid.attributes.map((attribute) => {
            if (attribute.trait_type === 'Purchase Receipt') {
              return { ...attribute, value: '#9999' };
            }
            return attribute;
          }) as typeof invalid.attributes;
        }
      },
    },
    {
      description: 'rejects missing credit symbol attribute',
      mutate: (invalid) => {
        const firstCreditSymbol = invalid.data.credits[0].symbol;
        invalid.attributes = invalid.attributes.filter(
          (attribute) => attribute.trait_type !== firstCreditSymbol,
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

  it('allows Purchase Receipt attribute to be omitted when purchase_receipt is present', () => {
    expectSchemaValid(schema, () => {
      const withoutTokenId = structuredClone(base);
      withoutTokenId.attributes = withoutTokenId.attributes.filter(
        (attribute) => attribute.trait_type !== 'Purchase Receipt',
      );
      return withoutTokenId;
    });
  });

  it('allows purchase_receipt to be omitted', () => {
    expectSchemaValid(schema, () => {
      const withoutPurchase = structuredClone(base);
      Reflect.deleteProperty(withoutPurchase.data, 'purchase_receipt');
      withoutPurchase.attributes = withoutPurchase.attributes.filter(
        (attribute) =>
          attribute.trait_type !== 'Purchase Receipt' &&
          attribute.trait_type !== 'Purchase Date',
      );
      return withoutPurchase;
    });
  });

  it('validates credit attribute with zero total when credit is not retired by certificates', () => {
    expectSchemaValid(schema, () => {
      const withUnusedCredit = structuredClone(base);
      const biowasteCredit = withUnusedCredit.data.credits.find(
        (c) => c.symbol === 'C-BIOW',
      );
      const carbonCredit = withUnusedCredit.data.credits.find(
        (c) => c.symbol === 'C-CARB.CH4',
      );
      if (!biowasteCredit || !carbonCredit) {
        throw new Error('Required credits not found in example');
      }
      withUnusedCredit.data.certificates =
        withUnusedCredit.data.certificates.map((cert) => {
          const biowasteCreditsRetired = cert.credits_retired.filter(
            (cr) => cr.credit_symbol === biowasteCredit.symbol,
          );
          if (biowasteCreditsRetired.length === 0) {
            return cert;
          }
          const biowasteTotal = biowasteCreditsRetired.reduce(
            (sum, cr) => sum + Number(cr.amount),
            0,
          );
          const otherCreditsRetired = cert.credits_retired.filter(
            (cr) => cr.credit_symbol !== biowasteCredit.symbol,
          );
          const newCreditsRetired = [
            ...otherCreditsRetired,
            {
              credit_symbol: carbonCredit.symbol,
              credit_slug: carbonCredit.slug,
              amount: biowasteTotal,
              external_id: carbonCredit.external_id,
              external_url: carbonCredit.external_url,
            } as (typeof cert)['credits_retired'][number],
          ];
          return {
            ...cert,
            credits_retired: newCreditsRetired,
          };
        });
      const biowasteAttribute = withUnusedCredit.attributes.find(
        (attr) => attr.trait_type === 'C-BIOW',
      );
      if (biowasteAttribute) {
        biowasteAttribute.value = 0;
      } else {
        withUnusedCredit.attributes.push({
          trait_type: 'C-BIOW',
          value: 0,
          display_type: 'number',
        });
      }
      const carbonAttribute = withUnusedCredit.attributes.find(
        (attr) => attr.trait_type === 'C-CARB.CH4',
      );
      if (carbonAttribute) {
        const carbonTotal = withUnusedCredit.data.certificates.reduce(
          (sum, cert) =>
            sum +
            cert.credits_retired
              .filter((cr) => cr.credit_symbol === carbonCredit.symbol)
              .reduce((certSum, cr) => certSum + Number(cr.amount), 0),
          0,
        );
        carbonAttribute.value = carbonTotal;
      }
      const totalRetired = withUnusedCredit.data.certificates.reduce(
        (sum, cert) =>
          sum +
          cert.collections.reduce(
            (certSum, col) => certSum + Number(col.retired_amount),
            0,
          ),
        0,
      );
      withUnusedCredit.data.summary.total_credits_retired = totalRetired;
      const totalCreditsAttribute = withUnusedCredit.attributes.find(
        (attr) => attr.trait_type === 'Total Credits Retired',
      );
      if (totalCreditsAttribute) {
        totalCreditsAttribute.value = totalRetired;
      }
      return withUnusedCredit;
    });
  });
});
