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

  it('requires retirement_receipt when certificates have retired_amount > 0', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      Reflect.deleteProperty(
        invalid as Record<string, unknown>,
        'retirement_receipt',
      );
    });
  });

  it('rejects retirement_receipt when no certificates have retired_amount > 0', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.retirement_receipt ??= {
        token_id: '1200',
        external_id: 'a1b2c3d4-e5f6-4b90-8a34-567890abcdef',
        external_url: 'https://explore.carrot.eco/document/test',
        ipfs_uri:
          'ipfs://bafybeiaysiqlz2rcdjfbh264l4d7f5szszw7vvr2wxwb62xtx4tqhy4gmy',
        smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
      };
      invalid.certificates = invalid.certificates.map((cert) => ({
        ...cert,
        retired_amount: 0,
        collections: cert.collections.map((col) => ({
          ...col,
          retired_amount: 0,
        })),
      }));
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

  it('requires certificate credit slug to exist in credits', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].credit_slug =
        'unknown-credit' as unknown as (typeof invalid.certificates)[number]['credit_slug'];
    });
  });

  it('rejects sum of collections purchased_amount greater than total_amount', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].collections[0].purchased_amount =
        invalid.certificates[0].total_amount + 1;
    });
  });

  it('rejects mismatched summary total_certificates', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.summary.total_certificates =
        invalid.summary.total_certificates + 1;
    });
  });

  it('requires certificate collections to have valid amounts', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].collections[0].retired_amount =
        invalid.certificates[0].collections[0].purchased_amount + 1;
    });
  });

  it('requires certificate collection purchased amounts to sum to certificate purchased amount', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].collections[0].purchased_amount = 0;
    });
  });

  it('requires retirement_receipt smart_contract_address to be valid Ethereum address', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      if (invalid.retirement_receipt) {
        invalid.retirement_receipt.smart_contract_address = 'invalid-address';
      }
    });
  });

  it('allows undefined retirement_receipt when no certificate collections have retired_amount > 0', () => {
    expectSchemaValid(schema, () => {
      const valid = structuredClone(baseData);
      Reflect.deleteProperty(valid, 'retirement_receipt');
      valid.certificates = valid.certificates.map((certificate) => ({
        ...certificate,
        collections: certificate.collections.map((col) => ({
          ...col,
          retired_amount: 0,
        })),
      }));

      return valid;
    });
  });

  it('allows buyer identity with only external_url', () => {
    expectSchemaValid(schema, () => {
      const valid = structuredClone(baseData);
      valid.buyer.identity = {
        external_url: 'https://example.com/identity/eco-tech',
      };

      return valid;
    });
  });

  it('requires buyer.id_hash', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      Reflect.deleteProperty(
        invalid.buyer as Record<string, unknown>,
        'id_hash',
      );
    });
  });

  it('rejects buyer.id_hash that is not a SHA-256 hex string', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      (invalid.buyer as Record<string, unknown>).id_hash =
        'b5c6d7e8-f901-4a23-9b45-6789012cdef3';
    });
  });

  it('allows buyer.wallet_address to be omitted', () => {
    expectSchemaValid(schema, () => {
      const valid = structuredClone(baseData);
      Reflect.deleteProperty(
        valid.buyer as Record<string, unknown>,
        'wallet_address',
      );

      return valid;
    });
  });

  it('rejects certificate collection retired_amount greater than purchased_amount', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].collections[0].retired_amount =
        invalid.certificates[0].collections[0].purchased_amount + 1;
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

  it('rejects certificate collection slug not in collections (duplicate test)', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].collections[0] = {
        ...invalid.certificates[0].collections[0],
        slug: 'bold-cold-start-jundiai',
      };
    });
  });

  it('requires purchased_amount on every certificate', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      Reflect.deleteProperty(
        invalid.certificates[0] as Record<string, unknown>,
        'purchased_amount',
      );
    });
  });

  it('rejects when certificate.purchased_amount does not match sum of collections.purchased_amount', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].purchased_amount =
        invalid.certificates[0].purchased_amount + 1;
    });
  });

  it('rejects when certificate.purchased_amount exceeds certificate.total_amount', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.certificates[0].purchased_amount =
        invalid.certificates[0].total_amount + 1;
    });
  });

  it('accepts no-collection variant (data.collections empty + every cert.collections empty)', () => {
    expectSchemaValid(schema, () => {
      const data = structuredClone(baseData);
      data.collections = [];
      data.certificates.forEach((cert) => {
        cert.collections = [];
      });
      Reflect.deleteProperty(
        data as Record<string, unknown>,
        'retirement_receipt',
      );
      return data;
    });
  });

  it('accepts mixed-mode receipt (some certs with collections, some without)', () => {
    expectSchemaValid(schema, () => {
      const data = structuredClone(baseData);
      data.certificates.slice(1).forEach((cert) => {
        cert.collections = [];
      });
      const stillReferenced = new Set<string>(
        data.certificates.flatMap((cert) =>
          cert.collections.map((c) => c.slug),
        ),
      );
      data.collections = data.collections.filter((c) =>
        stillReferenced.has(c.slug),
      );
      const totalRetired = data.certificates.reduce(
        (sum, cert) =>
          sum +
          cert.collections.reduce(
            (s, col) => s + Number(col.retired_amount),
            0,
          ),
        0,
      );
      if (totalRetired === 0) {
        Reflect.deleteProperty(
          data as Record<string, unknown>,
          'retirement_receipt',
        );
      }
      return data;
    });
  });

  it('rejects summary.total_credits === 0', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.summary.total_credits = 0;
      invalid.certificates.forEach((cert) => {
        cert.purchased_amount = 0;
        cert.collections.forEach((col) => {
          col.purchased_amount = 0;
          col.retired_amount = 0;
        });
      });
      Reflect.deleteProperty(
        invalid as Record<string, unknown>,
        'retirement_receipt',
      );
    });
  });

  it('rejects no-collection receipt when summary.total_credits does not match sum of certificates.purchased_amount', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.collections = [];
      invalid.certificates.forEach((cert) => {
        cert.collections = [];
      });
      invalid.summary.total_credits = invalid.summary.total_credits + 1;
      Reflect.deleteProperty(
        invalid as Record<string, unknown>,
        'retirement_receipt',
      );
    });
  });

  it('rejects when data.collections contains a slug not referenced by any certificate', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      (invalid.collections as unknown as Record<string, unknown>[]).push({
        slug: 'bold-innovators',
        name: 'BOLD Innovators',
        external_id: 'aa1bb2cc-3d4e-4f56-7890-1234567890ab',
        external_url: 'https://explore.carrot.eco/collection/bold-innovators',
        ipfs_uri:
          'ipfs://bafybeiaysiqlz2rcdjfbh264l4d7f5szszw7vvr2wxwb62xtx4tqhy4gmy',
      });
    });
  });

  it('rejects no-collection receipt when certificate.purchased_amount exceeds total_amount', () => {
    expectSchemaInvalid(schema, baseData, (invalid) => {
      invalid.collections = [];
      invalid.certificates.forEach((cert) => {
        cert.collections = [];
      });
      invalid.certificates[0].purchased_amount =
        invalid.certificates[0].total_amount + 1;
      Reflect.deleteProperty(
        invalid as Record<string, unknown>,
        'retirement_receipt',
      );
    });
  });
});
