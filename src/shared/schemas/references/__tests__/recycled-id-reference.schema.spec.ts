import { describe, expect } from 'vitest';

import { validRecycledIdReferenceFixture } from '../../../../test-utils';
import { runReferenceSchemaTests } from './reference.test-helpers';
import { RecycledIDReferenceSchema } from '../recycled-id-reference.schema';

describe('RecycledIDReferenceSchema', () => {
  runReferenceSchemaTests({
    schema: RecycledIDReferenceSchema,
    base: validRecycledIdReferenceFixture,
    requiredFields: [
      'external_id',
      'token_id',
      'external_url',
      'ipfs_uri',
      'smart_contract_address',
    ],
    invalidCases: [
      {
        description: 'rejects invalid UUID for external_id',
        mutate: (invalid) => {
          invalid.external_id = 'not-a-uuid';
        },
      },
      {
        description: 'rejects invalid token_id (non-numeric)',
        mutate: (invalid) => {
          invalid.token_id = 'abc';
        },
      },
      {
        description: 'rejects invalid URL for external_url',
        mutate: (invalid) => {
          invalid.external_url = 'not-a-url';
        },
      },
      {
        description: 'rejects invalid IPFS URI format',
        mutate: (invalid) => {
          invalid.ipfs_uri = 'https://example.com/file.json';
        },
      },
      {
        description: 'rejects invalid smart_contract_address',
        mutate: (invalid) => {
          invalid.smart_contract_address = 'not-an-address';
        },
      },
    ],
    typeCheck: (data, base) => {
      expect(data.external_id).toBe(base.external_id);
      expect(data.token_id).toBe(base.token_id);
      expect(data.external_url).toBe(base.external_url);
      expect(data.ipfs_uri).toBe(base.ipfs_uri);
      expect(data.smart_contract_address).toBe(base.smart_contract_address);
    },
  });
});
