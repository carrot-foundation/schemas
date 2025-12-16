import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectIssuesContain,
  expectSchemaInvalidWithout,
  expectSchemaTyped,
  expectSchemaValid,
  runReceiptInvalidCases,
} from '../../test-utils';
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
        invalid.data.certificates[0].credit_slug =
          'unknown-credit' as unknown as (typeof invalid.data.certificates)[number]['credit_slug'];
      },
    },
    {
      description:
        'rejects when all certificates reference a credit_slug with no matching credit',
      mutate: (invalid) => {
        const unknownSlug =
          'unknown-credit' as (typeof invalid.data.certificates)[number]['credit_slug'];

        invalid.data.certificates = invalid.data.certificates.map(
          (certificate) => ({
            ...certificate,
            credit_slug: unknownSlug,
          }),
        );
      },
    },
    {
      description: 'rejects attributes that do not align with data totals',
      mutate: (invalid) => {
        invalid.attributes = invalid.attributes.map((attribute) => {
          if (attribute.trait_type === 'Total Amount (USDC)') {
            return { ...attribute, value: 999999 };
          }
          return attribute;
        });
      },
    },
    {
      description:
        'rejects buyer attribute that does not match buyer identity name',
      mutate: (invalid) => {
        invalid.attributes = invalid.attributes.map((attribute) => {
          if (attribute.trait_type === 'Buyer') {
            return { ...attribute, value: 'Wrong Buyer' };
          }
          return attribute;
        });
      },
    },
    {
      description:
        'rejects purchase date attribute that does not match summary purchased_at',
      mutate: (invalid) => {
        invalid.attributes = invalid.attributes.map((attribute) => {
          if (attribute.trait_type === 'Purchase Date') {
            return { ...attribute, value: 1738627200000 };
          }
          return attribute;
        });
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
    {
      description:
        'rejects credit attribute value that does not match certificate totals',
      mutate: (invalid) => {
        const firstCreditSymbol = invalid.data.credits[0].symbol;
        invalid.attributes = invalid.attributes.map((attribute) => {
          if (attribute.trait_type === firstCreditSymbol) {
            return { ...attribute, value: Number(attribute.value) + 1 };
          }
          return attribute;
        });
      },
    },
    {
      description: 'rejects missing Purchase Date attribute',
      mutate: (invalid) => {
        invalid.attributes = invalid.attributes.filter(
          (attribute) => attribute.trait_type !== 'Purchase Date',
        );
      },
    },
    {
      description: 'rejects invalid purchased_at date in summary',
      mutate: (invalid) => {
        invalid.data.summary.purchased_at = 'invalid-date';
      },
    },
    {
      description:
        'rejects Purchase Date attribute that does not match purchased_at timestamp',
      mutate: (invalid) => {
        invalid.attributes = invalid.attributes.map((attribute) => {
          if (attribute.trait_type === 'Purchase Date') {
            return { ...attribute, value: 1738627200000 };
          }
          return attribute;
        });
      },
    },
    {
      description:
        'rejects Retirement Receipt attribute that does not match retirement_receipt.token_id',
      mutate: (invalid) => {
        if (invalid.data.retirement_receipt) {
          invalid.attributes = invalid.attributes.map((attribute) => {
            if (attribute.trait_type === 'Retirement Receipt') {
              return { ...attribute, value: '#9999' };
            }
            return attribute;
          });
        }
      },
    },
  ]);

  it('allows buyer identity to be omitted', () => {
    expectSchemaValid(schema, () => {
      const withoutBuyerIdentity = structuredClone(base);
      Reflect.deleteProperty(
        withoutBuyerIdentity.data.buyer as Record<string, unknown>,
        'identity',
      );
      withoutBuyerIdentity.attributes = withoutBuyerIdentity.attributes.filter(
        (attribute) => attribute.trait_type !== 'Buyer',
      );
      return withoutBuyerIdentity;
    });
  });

  it('validates type inference works correctly', () => {
    expectSchemaTyped(
      schema,
      () => structuredClone(base),
      (data) => {
        expect(data.schema.type).toBe('CreditPurchaseReceipt');
        expect(data.data.summary.total_certificates).toBe(3);
        expect(data.data.certificates[0].mass_id.token_id).toBe('1034');
      },
    );
  });

  it('allows Retirement Receipt attribute to be omitted when retirement_receipt is present', () => {
    expectSchemaValid(schema, () => {
      const withoutTokenId = structuredClone(base);
      withoutTokenId.attributes = withoutTokenId.attributes.filter(
        (attribute) => attribute.trait_type !== 'Retirement Receipt',
      );
      return withoutTokenId;
    });
  });

  it('allows retirement_receipt to be omitted when no certificate collections have retired_amount', () => {
    expectSchemaValid(schema, () => {
      const withoutRetirement = structuredClone(base);
      Reflect.deleteProperty(withoutRetirement.data, 'retirement_receipt');
      withoutRetirement.data.certificates =
        withoutRetirement.data.certificates.map((cert) => ({
          ...cert,
          collections: cert.collections.map((col) => ({
            ...col,
            retired_amount: 0,
          })),
        }));
      withoutRetirement.attributes = withoutRetirement.attributes.filter(
        (attribute) =>
          attribute.trait_type !== 'Retirement Receipt' &&
          attribute.trait_type !== 'Retirement Date',
      );
      return withoutRetirement;
    });
  });

  it('validates credit attribute with zero total when credit is not referenced by certificates', () => {
    expectSchemaValid(schema, () => {
      const withUnusedCredit = structuredClone(base);
      const biowasteCredit = withUnusedCredit.data.credits.find(
        (c) => c.symbol === 'C-BIOW',
      );
      if (!biowasteCredit) {
        throw new Error('C-BIOW credit not found in example');
      }
      withUnusedCredit.data.certificates =
        withUnusedCredit.data.certificates.filter(
          (cert) => cert.credit_slug !== biowasteCredit.slug,
        );
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
      withUnusedCredit.data.summary.total_certificates =
        withUnusedCredit.data.certificates.length;
      const totalCredits = withUnusedCredit.data.certificates.reduce(
        (sum, cert) =>
          sum +
          cert.collections.reduce(
            (certSum, col) => certSum + Number(col.purchased_amount),
            0,
          ),
        0,
      );
      withUnusedCredit.data.summary.total_credits = totalCredits;
      const totalCreditsAttribute = withUnusedCredit.attributes.find(
        (attr) => attr.trait_type === 'Total Credits Purchased',
      );
      if (totalCreditsAttribute) {
        totalCreditsAttribute.value = totalCredits;
      }
      const certificatesAttribute = withUnusedCredit.attributes.find(
        (attr) => attr.trait_type === 'Certificates Purchased',
      );
      if (certificatesAttribute) {
        certificatesAttribute.value = withUnusedCredit.data.certificates.length;
      }
      return withUnusedCredit;
    });
  });

  it('rejects name with mismatched token_id', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.name = 'Credit Purchase Receipt #999 • 8.5 Credits Purchased';
      return next;
    }, ['Name token_id must match blockchain.token_id: 987']);
  });

  it('rejects short_name with mismatched token_id', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.short_name = 'Purchase Receipt #999';
      return next;
    }, ['Short name token_id must match blockchain.token_id: 987']);
  });

  it('rejects name that does not match regex pattern', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.name = 'Invalid Name Format';
      return next;
    }, ['Name token_id must match blockchain.token_id: 987']);
  });

  it('rejects short_name that does not match regex pattern', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.short_name = 'Invalid Short Name';
      return next;
    }, ['Short name token_id must match blockchain.token_id: 987']);
  });

  it('rejects name with correct token_id but invalid format', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.name = 'Credit Purchase Receipt #987 • Invalid Format';
      return next;
    }, ['Name must match format']);
  });

  it('rejects short_name with correct token_id but invalid format', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.short_name = 'Purchase Receipt #987 Extra';
      return next;
    }, ['Short name must match format']);
  });
});
