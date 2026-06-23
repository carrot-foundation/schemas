import { describe, it } from 'vitest';

import { expectSchemaInvalid, expectSchemaValid } from '../../../../test-utils';
import {
  OriginalSaleReference,
  OriginalSaleReferenceSchema,
} from '../original-sale-reference.schema';

const validOriginalSaleReference: OriginalSaleReference = {
  order_id: 'ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
  sold_at: '2024-12-05T11:02:47.000Z',
  original_nft: {
    chain_id: 137,
    smart_contract_address: '0x742d35cc6634c0532925a3b8d8b5c2d4c7f8e1a9',
    token_id: '456789',
  },
};

describe('OriginalSaleReferenceSchema', () => {
  const schema = OriginalSaleReferenceSchema;

  it('validates a full valid original sale reference', () => {
    expectSchemaValid(schema, () =>
      structuredClone(validOriginalSaleReference),
    );
  });

  it('rejects unknown top-level properties', () => {
    expectSchemaInvalid(schema, validOriginalSaleReference, (invalid) => {
      (invalid as Record<string, unknown>).extra_field = 'not allowed';
    });
  });

  it('rejects unknown properties on original_nft', () => {
    expectSchemaInvalid(schema, validOriginalSaleReference, (invalid) => {
      (invalid.original_nft as Record<string, unknown>).extra_field =
        'not allowed';
    });
  });

  it('rejects missing order_id', () => {
    expectSchemaInvalid(schema, validOriginalSaleReference, (invalid) => {
      Reflect.deleteProperty(invalid as Record<string, unknown>, 'order_id');
    });
  });

  it('rejects an order_id that is not a UUID', () => {
    expectSchemaInvalid(schema, validOriginalSaleReference, (invalid) => {
      invalid.order_id = 'not-a-uuid';
    });
  });

  it('rejects a sold_at without timezone information', () => {
    expectSchemaInvalid(schema, validOriginalSaleReference, (invalid) => {
      invalid.sold_at = '2024-12-05T11:02:47';
    });
  });

  it('rejects a missing original_nft', () => {
    expectSchemaInvalid(schema, validOriginalSaleReference, (invalid) => {
      Reflect.deleteProperty(
        invalid as Record<string, unknown>,
        'original_nft',
      );
    });
  });

  it('rejects a non-integer chain_id', () => {
    expectSchemaInvalid(schema, validOriginalSaleReference, (invalid) => {
      invalid.original_nft.chain_id = 1.5;
    });
  });

  it('rejects an invalid smart_contract_address', () => {
    expectSchemaInvalid(schema, validOriginalSaleReference, (invalid) => {
      invalid.original_nft.smart_contract_address = 'invalid-address';
    });
  });

  it('rejects a non-numeric token_id', () => {
    expectSchemaInvalid(schema, validOriginalSaleReference, (invalid) => {
      invalid.original_nft.token_id = 'abc';
    });
  });
});
