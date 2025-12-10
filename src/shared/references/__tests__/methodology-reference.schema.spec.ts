import { describe } from 'vitest';

import { validMethodologyReferenceFixture } from '../../../test-utils';
import { runReferenceSchemaTests } from './reference.test-helpers';
import { MethodologyReferenceSchema } from '../methodology-reference.schema';

describe('MethodologyReferenceSchema', () => {
  runReferenceSchemaTests({
    schema: MethodologyReferenceSchema,
    base: validMethodologyReferenceFixture,
    requiredFields: ['external_id', 'name', 'version', 'external_url'],
    validCases: [
      {
        description: 'validates without optional uri field',
        build: () => {
          const withoutUri = structuredClone(validMethodologyReferenceFixture);
          Reflect.deleteProperty(withoutUri as Record<string, unknown>, 'uri');
          return withoutUri;
        },
      },
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
        description: 'rejects name shorter than 5 characters',
        mutate: (invalid) => {
          invalid.name = 'BOLD';
        },
      },
      {
        description: 'rejects name longer than 150 characters',
        mutate: (invalid) => {
          invalid.name = 'A'.repeat(151);
        },
      },
      {
        description: 'rejects empty name',
        mutate: (invalid) => {
          invalid.name = '';
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
        description: 'rejects invalid IPFS URI format for uri',
        mutate: (invalid) => {
          invalid.uri = 'https://example.com/file.pdf';
        },
      },
    ],
  });
});
