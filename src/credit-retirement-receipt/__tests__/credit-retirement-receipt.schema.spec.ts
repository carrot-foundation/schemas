import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  expectIssuesContain,
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

  it('allows beneficiary identity to be omitted', () => {
    expectSchemaValid(schema, () => {
      const withoutBeneficiaryIdentity = structuredClone(base);
      Reflect.deleteProperty(
        withoutBeneficiaryIdentity.data.beneficiary as Record<string, unknown>,
        'identity',
      );
      withoutBeneficiaryIdentity.attributes =
        withoutBeneficiaryIdentity.attributes.filter(
          (attribute) => attribute.trait_type !== 'Beneficiary',
        );

      return withoutBeneficiaryIdentity;
    });
  });

  it('allows beneficiary identity with only external_id', () => {
    expectSchemaValid(schema, () => {
      const withPartialBeneficiaryIdentity = structuredClone(base);
      withPartialBeneficiaryIdentity.data.beneficiary.identity = {
        external_id: 'ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
      };
      withPartialBeneficiaryIdentity.attributes =
        withPartialBeneficiaryIdentity.attributes.filter(
          (attribute) => attribute.trait_type !== 'Beneficiary',
        );

      return withPartialBeneficiaryIdentity;
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
        });
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
        });
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
        'rejects beneficiary attribute value that does not match identity name',
      mutate: (invalid) => {
        invalid.attributes = invalid.attributes.map((attribute) => {
          if (attribute.trait_type === 'Beneficiary') {
            return { ...attribute, value: 'Totally-Different-Name' };
          }
          return attribute;
        });
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
        });
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
        });
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
        });
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
          });
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
        expect(data.data.certificates[0].mass_id.token_id).toBe('100001');
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

  it('accepts no-collection NFT retirement receipt', () => {
    expectSchemaValid(schema, () => {
      const value = structuredClone(base);
      value.data.collections = [];
      value.data.certificates.forEach((cert) => {
        cert.collections = [];
      });
      return value;
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

  it('rejects name with mismatched token_id', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.name = 'Credit Retirement Receipt #999 • 10.5 Credits Retired';
      return next;
    }, ['Name must match format']);
  });

  it('rejects short_name with mismatched token_id', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.short_name = 'Retirement Receipt #999';
      return next;
    }, ['Short name must be exactly']);
  });

  it('rejects name that does not match regex pattern', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.name = 'Invalid Name Format';
      return next;
    }, ['Name must match format']);
  });

  it('rejects short_name that does not match regex pattern', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.short_name = 'Invalid Short Name';
      return next;
    }, ['Short name must match format']);
  });

  it('rejects name with correct token_id but invalid format', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.name = `Credit Retirement Receipt #${base.blockchain.token_id} \u2022 Invalid Format`;
      return next;
    }, ['Name must match format']);
  });

  it('rejects short_name with correct token_id but invalid format', () => {
    expectIssuesContain(schema, () => {
      const next = structuredClone(base);
      next.short_name = `Retirement Receipt #${base.blockchain.token_id} Extra`;
      return next;
    }, ['Short name must match format']);
  });

  describe('per-symbol credit totals tolerate floating-point summation drift', () => {
    // Regression: a single credit symbol retired across multiple certificates
    // with fractional amounts. Summing the parts in IEEE-754 drifts ~1 ULP from
    // the mathematically-exact attribute value produced upstream (BigNumber in
    // the Smaug builder), so a strict `!==` comparison wrongly rejects an
    // otherwise-valid receipt. Evidence: Sentry SMAUG-API-EV (issue 7624830232).
    const buildFractionalRetirement = (
      biowasteAmounts: [number, number],
      exactBiowasteTotal: number,
    ) => {
      const value = structuredClone(base);
      value.data.collections = [];
      value.data.certificates.forEach((certificate) => {
        certificate.collections = [];
      });

      const biowasteRetirements = value.data.certificates
        .flatMap((certificate) => certificate.credits_retired)
        .filter((creditRetired) => creditRetired.credit_symbol === 'C-BIOW');
      biowasteRetirements[0].amount = biowasteAmounts[0];
      biowasteRetirements[1].amount = biowasteAmounts[1];

      const carbonTotal = value.data.certificates
        .flatMap((certificate) => certificate.credits_retired)
        .filter((creditRetired) => creditRetired.credit_symbol === 'C-CARB.CH4')
        .reduce((sum, creditRetired) => sum + Number(creditRetired.amount), 0);
      const totalCredits = carbonTotal + exactBiowasteTotal;

      value.attributes = value.attributes.map((attribute) => {
        if (attribute.trait_type === 'C-BIOW') {
          return { ...attribute, value: exactBiowasteTotal };
        }
        if (attribute.trait_type === 'Total Credits Retired') {
          return { ...attribute, value: totalCredits };
        }
        return attribute;
      });
      value.data.summary.total_credits_retired = totalCredits;
      value.name = `Credit Retirement Receipt #${value.blockchain.token_id} • ${totalCredits} Credits Retired`;

      return value;
    };

    it.each([
      {
        description: 'classic 0.1 + 0.2 binary drift',
        biowasteAmounts: [0.1, 0.2] as [number, number],
        exactBiowasteTotal: 0.3,
      },
      {
        description: 'six-decimal 1.234567 + 2.345678 drift',
        biowasteAmounts: [1.234567, 2.345678] as [number, number],
        exactBiowasteTotal: 3.580245,
      },
    ])(
      'accepts a fractional multi-certificate retirement ($description)',
      ({ biowasteAmounts, exactBiowasteTotal }) => {
        // Guard the regression premise: the naive float sum must actually drift
        // from the exact total, otherwise the test would pass even unfixed.
        expect(biowasteAmounts[0] + biowasteAmounts[1]).not.toBe(
          exactBiowasteTotal,
        );
        expectSchemaValid(schema, () =>
          buildFractionalRetirement(biowasteAmounts, exactBiowasteTotal),
        );
      },
    );
  });
});
