import { describe } from 'vitest';

import { validMethodologyReferenceFixture } from '../../../../test-utils';
import { runReferenceSchemaTests } from './reference.test-helpers';
import { MethodologyReferenceSchema } from '../methodology-reference.schema';

describe('MethodologyReferenceSchema', () => {
  runReferenceSchemaTests({
    schema: MethodologyReferenceSchema,
    base: validMethodologyReferenceFixture,
    requiredFields: [
      'external_id',
      'name',
      'version',
      'external_url',
      'ipfs_uri',
    ],
    validCases: [
      {
        description: 'validates semantic version with v prefix',
        build: () => ({
          ...validMethodologyReferenceFixture,
          version: 'v1.3.0',
        }),
      },
      {
        description: 'validates semantic version with prerelease',
        build: () => ({
          ...validMethodologyReferenceFixture,
          version: '1.3.0-beta',
        }),
      },
    ],
    invalidCases: [
      {
        description: 'rejects invalid UUID for external_id',
        mutate: (invalid) => {
          invalid.external_id = 'not-a-uuid';
        },
      },
      {
        description: 'rejects invalid semantic version format',
        mutate: (invalid) => {
          invalid.version = 'invalid-version';
        },
      },
      {
        description: 'rejects invalid URL for external_url',
        mutate: (invalid) => {
          invalid.external_url = 'not-a-url';
        },
      },
      {
        description: 'rejects invalid IPFS URI format for ipfs_uri',
        mutate: (invalid) => {
          invalid.ipfs_uri = 'https://example.com/file.pdf';
        },
      },
    ],
  });
});
