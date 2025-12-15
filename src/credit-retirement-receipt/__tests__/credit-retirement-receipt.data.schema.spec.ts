import { describe, it } from 'vitest';

import { expectSchemaInvalid, expectSchemaValid } from '../../test-utils';
import {
  CreditRetirementReceiptData,
  CreditRetirementReceiptDataSchema,
} from '../credit-retirement-receipt.data.schema';
import exampleJson from '../../../schemas/ipfs/credit-retirement-receipt/credit-retirement-receipt.example.json';

describe('CreditRetirementReceiptDataSchema', () => {
  const schema = CreditRetirementReceiptDataSchema;
  const baseData = exampleJson.data as CreditRetirementReceiptData;

  it('validates example data', () => {
    expectSchemaValid(schema, () => structuredClone(baseData));
  });

  it('rejects sum of collections retired_amount greater than total_amount', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].collections[0].retired_amount =
        invalid.certificates[0].total_amount + 1;
    });
  });

  it('requires credits_retired amounts to sum to collections retired_amount', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      const certificateRetiredTotal =
        invalid.certificates[0].collections.reduce(
          (sum, col) => sum + col.retired_amount,
          0,
        );
      invalid.certificates[0].credits_retired[0].amount =
        certificateRetiredTotal - 1;
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

  it('requires certificate collections slug to exist in collections', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].collections[0] = {
        ...invalid.certificates[0].collections[0],
        slug: 'bold-innovators',
      };
    });
  });

  it('requires credits_retired amounts to match collections retired amounts', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].credits_retired[0].amount = 999;
    });
  });

  it('requires certificate credit slug to exist in credits', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].credits_retired[0].credit_slug =
        'unknown-credit' as unknown as (typeof invalid.certificates)[number]['credits_retired'][number]['credit_slug'];
    });
  });

  it('rejects mismatched summary total_certificates', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.summary.total_certificates =
        invalid.summary.total_certificates + 1;
    });
  });

  it('rejects mismatched summary total_credits_retired', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.summary.total_credits_retired =
        invalid.summary.total_credits_retired + 1;
    });
  });

  it('requires smart contract address to be valid Ethereum address', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.collections[0].smart_contract_address = 'invalid-address';
    });
  });

  it('requires purchase_receipt smart_contract_address to be valid Ethereum address', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      if (invalid.purchase_receipt) {
        invalid.purchase_receipt.smart_contract_address = 'invalid-address';
      }
    });
  });

  it('rejects credits_retired credit_slug not in credits', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      const usedCreditSlug =
        invalid.certificates[0].credits_retired[0].credit_slug;
      invalid.credits = invalid.credits.filter(
        (credit) => credit.slug !== usedCreditSlug,
      );
    });
  });

  it('rejects credits_retired credit_symbol not in credits', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      const firstCreditSymbol = invalid.credits[0].symbol;
      invalid.certificates[0].credits_retired[0].credit_symbol =
        firstCreditSymbol === 'C-CARB.CH4' ? 'C-BIOW' : 'C-CARB.CH4';
    });
  });

  it('requires credit smart_contract_address to be valid Ethereum address', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.credits[0].smart_contract_address = 'invalid-address';
    });
  });

  it('requires certificate smart_contract_address to be valid Ethereum address', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].smart_contract_address = 'invalid-address';
    });
  });

  it('requires certificate mass_id smart_contract_address to be valid Ethereum address', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].mass_id.smart_contract_address =
        'invalid-address';
    });
  });

  it('requires collection smart_contract_address to be valid Ethereum address', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.collections[0].smart_contract_address = 'invalid-address';
    });
  });

  it('rejects collection with zero retired total', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.collections.push({
        slug: 'bold-innovators',
        external_id: '00000000-0000-0000-0000-000000000000',
        name: 'BOLD Innovators',
        external_url: 'https://example.com/unreferenced',
        ipfs_uri:
          'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm/unreferenced.json',
        smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
      });
    });
  });
});
