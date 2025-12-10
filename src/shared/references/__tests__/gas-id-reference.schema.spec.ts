import { describe, expect } from 'vitest';

import { validGasIdReferenceFixture } from '../../../test-utils';
import { runReferenceSchemaTests } from './reference.test-helpers';
import { GasIDReferenceSchema } from '../gas-id-reference.schema';

describe('GasIDReferenceSchema', () => {
  runReferenceSchemaTests({
    schema: GasIDReferenceSchema,
    base: validGasIdReferenceFixture,
    requiredFields: ['external_id', 'token_id', 'external_url', 'uri'],
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
          invalid.uri = 'https://example.com/file.json';
        },
      },
    ],
    typeCheck: (data, base) => {
      expect(data.external_id).toBe(base.external_id);
      expect(data.token_id).toBe(base.token_id);
      expect(data.external_url).toBe(base.external_url);
      expect(data.uri).toBe(base.uri);
    },
  });
});
