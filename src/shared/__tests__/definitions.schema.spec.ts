import { describe, it } from 'vitest';
import {
  expectIssues,
  expectSchemaValid,
} from '../../test-utils/schema-assertions';
import { IsoTimestampSchema } from '../definitions.schema';

describe('IsoTimestampSchema', () => {
  it('accepts a valid ISO 8601 timestamp', () => {
    expectSchemaValid(IsoTimestampSchema, () => '2024-12-05T11:02:47.000Z');
  });

  it('rejects values that match the regex but are not parseable dates', () => {
    expectIssues(IsoTimestampSchema, () => '2024-13-01T00:00:00Z', [
      'Must be a valid ISO 8601 timestamp with timezone information',
    ]);
  });
});
