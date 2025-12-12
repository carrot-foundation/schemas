import { describe, it } from 'vitest';

import { expectSchemaInvalid, expectSchemaValid } from '../../test-utils';
import {
  CreditPurchaseReceiptData,
  CreditPurchaseReceiptDataSchema,
} from '../credit-purchase-receipt.data.schema';
import exampleJson from '../../../schemas/ipfs/credit-purchase-receipt/credit-purchase-receipt.example.json';

describe('CreditPurchaseReceiptDataSchema', () => {
  const schema = CreditPurchaseReceiptDataSchema;
  const baseData = exampleJson.data as CreditPurchaseReceiptData;

  it('validates example data', () => {
    expectSchemaValid(schema, () => structuredClone(baseData));
  });

  it('requires retirement details when credits include retirement amounts', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      Reflect.deleteProperty(invalid as Record<string, unknown>, 'retirement');
    });
  });

  it('rejects retirement details when no credits have retirement amounts', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.credits = invalid.credits.map((credit) => ({
        ...credit,
        retirement_amount: 0,
      }));
    });
  });

  it('requires certificate collection slug to exist in collections', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].collection_slug =
        'unknown-collection' as unknown as (typeof invalid.certificates)[number]['collection_slug'];
    });
  });

  it('rejects retired_amount greater than purchased_amount', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].retired_amount =
        invalid.certificates[0].purchased_amount + 1;
    });
  });

  it('requires summary certificate_types to match certificates', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.summary.certificate_types = [
        ...invalid.summary.certificate_types,
        'NewType',
      ] as unknown as typeof invalid.summary.certificate_types;
    });
  });

  it('requires certificate types to be listed in summary', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].type =
        'NewType' as unknown as (typeof invalid.certificates)[number]['type'];
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

  it('requires certificate credit slug to exist in credits', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].credit_slug = 'unknown-credit';
    });
  });

  it('rejects purchased_amount greater than total_amount', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].purchased_amount =
        invalid.certificates[0].total_amount + 1;
    });
  });

  it('requires credit retirement totals to match certificate retired amounts', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.credits[0].retirement_amount = 0;
    });
  });

  it('rejects mismatched summary total_certificates', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.summary.total_certificates =
        invalid.summary.total_certificates + 1;
    });
  });

  it('rejects mismatched summary total_usdc_amount', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.summary.total_usdc_amount = invalid.summary.total_usdc_amount + 1;
    });
  });

  it('requires certificate retired amounts to align with credit retirement totals', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].retired_amount = 0;
    });
  });

  it('requires credit purchase totals to match certificates', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.credits[0].purchase_amount = 0;
    });
  });

  it('validates credit and collection totals when certificates are missing matching slugs', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates = invalid.certificates.map((certificate) => ({
        ...certificate,
        credit_slug:
          'unknown-credit' as unknown as (typeof invalid.certificates)[number]['credit_slug'],
        collection_slug:
          'unknown-collection' as unknown as (typeof invalid.certificates)[number]['collection_slug'],
      }));
    });
  });

  it('allows undefined retirement_amount when no retirement details are provided', () => {
    expectSchemaValid(schema, () => {
      const valid = structuredClone(baseData);
      Reflect.deleteProperty(valid, 'retirement');
      valid.credits = valid.credits.map((credit) => {
        const creditWithoutRetirement = structuredClone(credit);
        Reflect.deleteProperty(creditWithoutRetirement, 'retirement_amount');
        return creditWithoutRetirement;
      });
      valid.certificates = valid.certificates.map((certificate) => ({
        ...certificate,
        retired_amount: 0,
      }));

      return valid;
    });
  });

  it('validates collection credit_amount equals sum of certificate purchases', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.collections[0].credit_amount = 0;
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

  it('rejects credit purchase_amount not matching certificate totals', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      const firstCreditSlug = invalid.credits[0].slug;
      invalid.certificates = invalid.certificates.filter(
        (cert) => cert.credit_slug !== firstCreditSlug,
      );
      invalid.summary.total_credits =
        invalid.summary.total_credits -
        (invalid.credits[0].purchase_amount as number);
    });
  });

  it('rejects credit retirement_amount not matching certificate totals', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      const firstCreditSlug = invalid.credits[0].slug;
      invalid.certificates = invalid.certificates.filter(
        (cert) => cert.credit_slug !== firstCreditSlug,
      );
      if (invalid.credits[0].retirement_amount) {
        invalid.summary.total_credits =
          invalid.summary.total_credits -
          (invalid.credits[0].purchase_amount as number);
      }
    });
  });

  it('rejects collection credit_amount not matching certificate totals', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      const firstCollectionSlug = invalid.collections[0].slug;
      invalid.certificates = invalid.certificates.filter(
        (cert) => cert.collection_slug !== firstCollectionSlug,
      );
      invalid.summary.collection_slugs =
        invalid.summary.collection_slugs.filter(
          (slug) => slug !== firstCollectionSlug,
        );
      invalid.summary.total_credits =
        invalid.summary.total_credits -
        (invalid.collections[0].credit_amount as number);
    });
  });
});
