import { describe, it } from 'vitest';

import { expectSchemaInvalid, expectSchemaValid } from '../../test-utils';
import {
  CreditRetirementReceiptData,
  CreditRetirementReceiptDataSchema,
} from '../credit-retirement-receipt.data.schema';
import exampleJson from '../../../schemas/ipfs/credit-retirement-receipt/credit-retirement-receipt.example.json';

function applyCreditSymbolOverride(
  certificates: CreditRetirementReceiptData['certificates'],
  creditSymbol: string,
) {
  return certificates.map((certificate) => ({
    ...certificate,
    credits_retired: certificate.credits_retired.map((credit) => ({
      ...credit,
      credit_symbol: creditSymbol,
    })),
  })) as unknown as CreditRetirementReceiptData['certificates'];
}

describe('CreditRetirementReceiptDataSchema', () => {
  const schema = CreditRetirementReceiptDataSchema;
  const baseData = exampleJson.data as CreditRetirementReceiptData;

  it('validates example data', () => {
    expectSchemaValid(schema, () => structuredClone(baseData));
  });

  it('rejects retired_amount greater than total_amount', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].retired_amount =
        invalid.certificates[0].total_amount + 1;
    });
  });

  it('requires credits_retired amounts to sum to retired_amount', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].credits_retired[0].amount =
        invalid.certificates[0].retired_amount - 1;
    });
  });

  it('requires credit_symbol to exist in credits list', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].credits_retired[0].credit_symbol =
        'UNKNOWN' as unknown as (typeof invalid.certificates)[number]['credits_retired'][number]['credit_symbol'];
    });
  });

  it('requires credit_symbol to match referenced credit slug symbol', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].credits_retired[0].credit_symbol = 'C-BIOW';
    });
  });

  it('requires certificate collection slug to exist in collections', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].collection_slug =
        'unknown-collection' as unknown as (typeof invalid.certificates)[number]['collection_slug'];
    });
  });

  it('requires summary collection_slugs to include all collections', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.summary.collection_slugs =
        invalid.summary.collection_slugs.slice(1);
    });
  });

  it('requires summary certificate_types to include all certificates', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.summary.certificate_types =
        invalid.summary.certificate_types.slice(1);
    });
  });

  it('requires summary credit symbols to appear in certificate retirements', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates = applyCreditSymbolOverride(
        invalid.certificates,
        'C-CARB.CH4',
      );
    });
  });

  it('requires credit amounts to equal retired totals by symbol', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.credits[0].amount = 0;
    });
  });

  it('requires certificate credit slug to exist in credits', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].credits_retired[0].credit_slug =
        'unknown-credit' as unknown as (typeof invalid.certificates)[number]['credits_retired'][number]['credit_slug'];
    });
  });

  it('requires summary credit_symbols to include all credits', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.summary.credit_symbols = invalid.summary.credit_symbols.slice(1);
    });
  });

  it('rejects summary credit_symbols not present in credits', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.summary.credit_symbols = [
        ...invalid.summary.credit_symbols,
        'EXTRA-CREDIT',
      ] as unknown as typeof invalid.summary.credit_symbols;
    });
  });

  it('rejects summary collection_slugs not present in collections', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.summary.collection_slugs = [
        ...invalid.summary.collection_slugs,
        'extra-collection',
      ] as unknown as typeof invalid.summary.collection_slugs;
    });
  });

  it('rejects summary certificate_types not present in certificates', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.summary.certificate_types = [
        ...invalid.summary.certificate_types,
        'ExtraType',
      ] as unknown as typeof invalid.summary.certificate_types;
    });
  });

  it('validates totals when certificates lack matching slugs', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates = invalid.certificates.map((certificate) => ({
        ...certificate,
        collection_slug:
          'unknown-collection' as unknown as (typeof invalid.certificates)[number]['collection_slug'],
        credit_slug:
          'unknown-credit' as unknown as (typeof invalid.certificates)[number]['credits_retired'][number]['credit_slug'],
      }));
    });
  });

  it('rejects collections without certificate references', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.collections.push({
        slug: 'unused-collection',
        external_id: '00000000-0000-0000-0000-000000000000',
        name: 'Unused Collection',
        external_url: 'https://example.com/unused-collection',
        uri: 'ipfs://unused-collection',
        amount: 0,
      });
      invalid.summary.collection_slugs = [
        ...invalid.summary.collection_slugs,
        'unused-collection',
      ] as unknown as typeof invalid.summary.collection_slugs;
    });
  });

  it('requires collection amounts to equal retired totals', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.collections[0].amount = 0;
    });
  });

  it('rejects mismatched summary total_certificates', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.summary.total_certificates =
        invalid.summary.total_certificates + 1;
    });
  });

  it('rejects mismatched summary total_retirement_amount', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.summary.total_retirement_amount =
        invalid.summary.total_retirement_amount + 1;
    });
  });

  it('rejects certificate collection_slug not in collections', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      const usedCollectionSlug = invalid.certificates[0].collection_slug;
      invalid.collections = invalid.collections.filter(
        (col) => col.slug !== usedCollectionSlug,
      );
      invalid.summary.collection_slugs =
        invalid.summary.collection_slugs.filter(
          (slug) => slug !== usedCollectionSlug,
        );
    });
  });

  it('rejects credits_retired credit_slug not in credits', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      const usedCreditSlug =
        invalid.certificates[0].credits_retired[0].credit_slug;
      invalid.credits = invalid.credits.filter(
        (credit) => credit.slug !== usedCreditSlug,
      );
      invalid.summary.credit_symbols = invalid.summary.credit_symbols.filter(
        (symbol) => {
          const credit = invalid.credits.find((c) => c.slug === usedCreditSlug);
          return credit ? symbol !== credit.symbol : true;
        },
      );
    });
  });

  it('rejects credits_retired credit_symbol not in credits', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      const firstCreditSymbol = invalid.credits[0].symbol;
      invalid.certificates[0].credits_retired[0].credit_symbol =
        firstCreditSymbol === 'C-CARB.CH4' ? 'C-BIOW' : 'C-CARB.CH4';
      const testSymbol =
        invalid.certificates[0].credits_retired[0].credit_symbol;
      invalid.credits = invalid.credits.filter((c) => c.symbol !== testSymbol);
      invalid.summary.credit_symbols = invalid.summary.credit_symbols.filter(
        (s) => s !== testSymbol,
      );
    });
  });

  it('rejects collections with no retired amount', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.collections.push({
        slug: 'bold-innovators',
        external_id: '00000000-0000-0000-0000-000000000000',
        name: 'BOLD Innovators',
        external_url: 'https://example.com/bold-innovators',
        uri: 'ipfs://bold-innovators',
        amount: 0,
      });
    });
  });
});
