import type { RecordEnvironment } from '../../shared/schemas/core/base.schema';

/**
 * Minimal record environment stub with required fields only.
 */
export const minimalRecordEnvironmentStub: RecordEnvironment = {
  blockchain_network: 'testnet',
  deployment: 'development',
  data_set_name: 'TEST',
};

/**
 * Creates a record environment fixture with optional overrides.
 */
export function createRecordEnvironmentFixture(
  overrides?: Partial<RecordEnvironment>,
): RecordEnvironment {
  return {
    ...minimalRecordEnvironmentStub,
    ...overrides,
  };
}
