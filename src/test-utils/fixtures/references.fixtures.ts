import type {
  AuditReference,
  GasIDReference,
  MassIDReference,
  MethodologyReference,
} from '../../shared';

/**
 * Minimal audit reference stub for testing.
 *
 * Contains only required fields for audit reference schema validation.
 * Used as a base for creating custom audit reference fixtures in tests.
 */
export const minimalAuditReferenceStub: AuditReference = {
  date: '2025-06-24',
  external_id: 'a1b2c3d4-e5f6-4890-8234-567890abcdef',
  external_url:
    'https://explore.carrot.eco/document/a1b2c3d4-e5f6-4890-8234-567890abcdef',
  methodology_compliance: 'PASSED',
  rules_executed: 21,
  report:
    'ipfs://bafybeiaysiqlz2rcdjfbh264l4d7f5szszw7vvr2wxwb62xtx4tqhy4gmy/mass-id-audit.json',
};

/**
 * Valid audit reference fixture for testing.
 *
 * Represents a complete audit reference that satisfies the audit reference schema.
 * Used in tests to validate audit reference schema parsing and validation.
 */
export const validAuditReferenceFixture: AuditReference = {
  date: '2025-06-24',
  external_id: 'a1b2c3d4-e5f6-4890-8234-567890abcdef',
  external_url:
    'https://explore.carrot.eco/document/a1b2c3d4-e5f6-4890-8234-567890abcdef',
  methodology_compliance: 'PASSED',
  rules_executed: 21,
  report:
    'ipfs://bafybeiaysiqlz2rcdjfbh264l4d7f5szszw7vvr2wxwb62xtx4tqhy4gmy/mass-id-audit.json',
};

/**
 * Creates an audit reference fixture with optional overrides.
 *
 * @param overrides - Optional partial audit reference to override default values
 * @returns A complete audit reference fixture
 */
export function createAuditReferenceFixture(
  overrides?: Partial<AuditReference>,
): AuditReference {
  return {
    ...minimalAuditReferenceStub,
    ...overrides,
  };
}

/**
 * Minimal GasID reference stub for testing.
 *
 * Contains only required fields for GasID reference schema validation.
 * Used as a base for creating custom GasID reference fixtures in tests.
 */
export const minimalGasIdReferenceStub: GasIDReference = {
  external_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  token_id: '456',
  external_url:
    'https://explore.carrot.eco/document/f47ac10b-58cc-4372-a567-0e02b2c3d479',
  uri: 'ipfs://bafybeicnuw2ytgukpr5uzmdyt6gdsbkq2xvula4odrqpnbx2ens4qfoywm/gas-id.json',
};

/**
 * Valid GasID reference fixture for testing.
 *
 * Represents a complete GasID reference that satisfies the GasID reference schema.
 * Used in tests to validate GasID reference schema parsing and validation.
 */
export const validGasIdReferenceFixture: GasIDReference = {
  external_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  token_id: '456',
  external_url:
    'https://explore.carrot.eco/document/f47ac10b-58cc-4372-a567-0e02b2c3d479',
  uri: 'ipfs://bafybeicnuw2ytgukpr5uzmdyt6gdsbkq2xvula4odrqpnbx2ens4qfoywm/gas-id.json',
};

/**
 * Creates a GasID reference fixture with optional overrides.
 *
 * @param overrides - Optional partial GasID reference to override default values
 * @returns A complete GasID reference fixture
 */
export function createGasIdReferenceFixture(
  overrides?: Partial<GasIDReference>,
): GasIDReference {
  return {
    ...minimalGasIdReferenceStub,
    ...overrides,
  };
}

/**
 * Minimal MassID reference stub for testing.
 *
 * Contains only required fields for MassID reference schema validation.
 * Used as a base for creating custom MassID reference fixtures in tests.
 */
export const minimalMassIDReferenceStub: MassIDReference = {
  external_id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
  token_id: '123',
  external_url:
    'https://explore.carrot.eco/document/6f520d88-864d-432d-bf9f-5c3166c4818f',
  uri: 'ipfs://bafybeibwzifubdt5epaz43pj4gk7t2r4e6uah6vuvtbtmq5r2mwyrc6yha/mass-id.json',
};

/**
 * Valid MassID reference fixture for testing.
 *
 * Represents a complete MassID reference that satisfies the MassID reference schema.
 * Used in tests to validate MassID reference schema parsing and validation.
 */
export const validMassIDReferenceFixture: MassIDReference = {
  external_id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
  token_id: '123',
  external_url:
    'https://explore.carrot.eco/document/6f520d88-864d-432d-bf9f-5c3166c4818f',
  uri: 'ipfs://bafybeibwzifubdt5epaz43pj4gk7t2r4e6uah6vuvtbtmq5r2mwyrc6yha/mass-id.json',
};

/**
 * Creates a MassID reference fixture with optional overrides.
 *
 * @param overrides - Optional partial MassID reference to override default values
 * @returns A complete MassID reference fixture
 */
export function createMassIDReferenceFixture(
  overrides?: Partial<MassIDReference>,
): MassIDReference {
  return {
    ...minimalMassIDReferenceStub,
    ...overrides,
  };
}

/**
 * Minimal methodology reference stub for testing.
 *
 * Contains only required fields for methodology reference schema validation.
 * Used as a base for creating custom methodology reference fixtures in tests.
 */
export const minimalMethodologyReferenceStub: MethodologyReference = {
  external_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
  name: 'AMS-III.F. | BOLD Carbon (CH₄) - SSC',
  version: '1.3.0',
  external_url:
    'https://explore.carrot.eco/document/f47ac10b-58cc-4372-a567-0e02b2c3d480',
  uri: 'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku/bold-carbon-ch4-v1.3.0.pdf',
};

/**
 * Valid methodology reference fixture for testing.
 *
 * Represents a complete methodology reference that satisfies the methodology reference schema.
 * Used in tests to validate methodology reference schema parsing and validation.
 */
export const validMethodologyReferenceFixture: MethodologyReference = {
  external_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
  name: 'AMS-III.F. | BOLD Carbon (CH₄) - SSC',
  version: '1.3.0',
  external_url:
    'https://explore.carrot.eco/document/f47ac10b-58cc-4372-a567-0e02b2c3d480',
  uri: 'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku/bold-carbon-ch4-v1.3.0.pdf',
};

/**
 * Creates a methodology reference fixture with optional overrides.
 *
 * @param overrides - Optional partial methodology reference to override default values
 * @returns A complete methodology reference fixture
 */
export function createMethodologyReferenceFixture(
  overrides?: Partial<MethodologyReference>,
): MethodologyReference {
  return {
    ...minimalMethodologyReferenceStub,
    ...overrides,
  };
}
