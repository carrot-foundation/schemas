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
  }));
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
      invalid.certificates[0].credits_retired[0].credit_symbol = 'UNKNOWN';
    });
  });

  it('requires credit_symbol to match referenced credit slug symbol', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].credits_retired[0].credit_symbol = 'C-BIOW';
    });
  });

  it('requires certificate collection slug to exist in collections', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].collection_slug = 'unknown-collection';
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
        'C-CARB',
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
      invalid.certificates[0].credits_retired[0].credit_slug = 'unknown-credit';
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
      ];
    });
  });

  it('rejects summary collection_slugs not present in collections', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.summary.collection_slugs = [
        ...invalid.summary.collection_slugs,
        'extra-collection',
      ];
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
        collection_slug: 'unknown-collection',
        credit_slug: 'unknown-credit',
      }));
    });
  });

  it('handles collections without certificate references', () => {
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
      ];
    });
  });

  it('requires collection amounts to equal retired totals', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.collections[0].amount = 0;
    });
  });
});
