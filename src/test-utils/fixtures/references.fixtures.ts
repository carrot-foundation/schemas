import type {
  AuditReference,
  CertificateReferenceBase,
  CreditPurchaseReceiptReference,
  CreditReference,
  CreditRetirementReceiptReference,
  GasIDReference,
  MassIDReference,
  MethodologyReference,
  RecycledIDReference,
} from '../../shared';

/**
 * Minimal audit reference stub for testing.
 *
 * Contains only required fields for audit reference schema validation.
 * Used as a base for creating custom audit reference fixtures in tests.
 */
export const minimalAuditReferenceStub: AuditReference = {
  completed_at: '2025-06-24T13:02:25.000Z',
  external_id: 'a1b2c3d4-e5f6-4890-8234-567890abcdef',
  external_url:
    'https://explore.carrot.eco/document/a1b2c3d4-e5f6-4890-8234-567890abcdef',
  result: 'PASSED',
  rules_executed: 21,
  report_uri:
    'ipfs://bafybeiaysiqlz2rcdjfbh264l4d7f5szszw7vvr2wxwb62xtx4tqhy4gmy',
};

/**
 * Valid audit reference fixture for testing.
 *
 * Represents a complete audit reference that satisfies the audit reference schema.
 * Used in tests to validate audit reference schema parsing and validation.
 */
export const validAuditReferenceFixture: AuditReference = {
  completed_at: '2025-06-24T13:02:25.000Z',
  external_id: 'a1b2c3d4-e5f6-4890-8234-567890abcdef',
  external_url:
    'https://explore.carrot.eco/document/a1b2c3d4-e5f6-4890-8234-567890abcdef',
  result: 'PASSED',
  rules_executed: 21,
  report_uri:
    'ipfs://bafybeiaysiqlz2rcdjfbh264l4d7f5szszw7vvr2wxwb62xtx4tqhy4gmy',
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
  ipfs_uri:
    'ipfs://bafybeicnuw2ytgukpr5uzmdyt6gdsbkq2xvula4odrqpnbx2ens4qfoywm/gas-id.json',
  smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
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
  ipfs_uri:
    'ipfs://bafybeicnuw2ytgukpr5uzmdyt6gdsbkq2xvula4odrqpnbx2ens4qfoywm/gas-id.json',
  smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
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
  ipfs_uri:
    'ipfs://bafybeibwzifubdt5epaz43pj4gk7t2r4e6uah6vuvtbtmq5r2mwyrc6yha/mass-id.json',
  smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
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
  ipfs_uri:
    'ipfs://bafybeibwzifubdt5epaz43pj4gk7t2r4e6uah6vuvtbtmq5r2mwyrc6yha/mass-id.json',
  smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
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
  ipfs_uri:
    'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
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
  ipfs_uri:
    'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
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

/**
 * Minimal RecycledID reference stub for testing.
 *
 * Contains only required fields for RecycledID reference schema validation.
 * Used as a base for creating custom RecycledID reference fixtures in tests.
 */
export const minimalRecycledIdReferenceStub: RecycledIDReference = {
  external_id: 'a1b2c3d4-e5f6-4890-8234-567890abcdef',
  token_id: '789',
  external_url:
    'https://explore.carrot.eco/document/a1b2c3d4-e5f6-4890-8234-567890abcdef',
  ipfs_uri:
    'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku/recycled-id.json',
  smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
};

/**
 * Valid RecycledID reference fixture for testing.
 *
 * Represents a complete RecycledID reference that satisfies the RecycledID reference schema.
 * Used in tests to validate RecycledID reference schema parsing and validation.
 */
export const validRecycledIdReferenceFixture: RecycledIDReference = {
  external_id: 'a1b2c3d4-e5f6-4890-8234-567890abcdef',
  token_id: '789',
  external_url:
    'https://explore.carrot.eco/document/a1b2c3d4-e5f6-4890-8234-567890abcdef',
  ipfs_uri:
    'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku/recycled-id.json',
  smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
};

/**
 * Creates a RecycledID reference fixture with optional overrides.
 *
 * @param overrides - Optional partial RecycledID reference to override default values
 * @returns A complete RecycledID reference fixture
 */
export function createRecycledIdReferenceFixture(
  overrides?: Partial<RecycledIDReference>,
): RecycledIDReference {
  return {
    ...minimalRecycledIdReferenceStub,
    ...overrides,
  };
}

/**
 * Minimal credit purchase receipt reference stub for testing.
 *
 * Contains only required fields for credit purchase receipt reference schema validation.
 * Used as a base for creating custom credit purchase receipt reference fixtures in tests.
 */
export const minimalCreditPurchaseReceiptReferenceStub: CreditPurchaseReceiptReference =
  {
    external_id: 'b2c3d4e5-f6a7-4901-9234-678901abcdef',
    token_id: '1001',
    external_url:
      'https://explore.carrot.eco/document/b2c3d4e5-f6a7-4901-9234-678901abcdef',
    ipfs_uri:
      'ipfs://bafybeicnuw2ytgukpr5uzmdyt6gdsbkq2xvula4odrqpnbx2ens4qfoywm/purchase-receipt.json',
    smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
  };

/**
 * Valid credit purchase receipt reference fixture for testing.
 *
 * Represents a complete credit purchase receipt reference that satisfies the credit purchase receipt reference schema.
 * Used in tests to validate credit purchase receipt reference schema parsing and validation.
 */
export const validCreditPurchaseReceiptReferenceFixture: CreditPurchaseReceiptReference =
  {
    external_id: 'b2c3d4e5-f6a7-4901-9234-678901abcdef',
    token_id: '1001',
    external_url:
      'https://explore.carrot.eco/document/b2c3d4e5-f6a7-4901-9234-678901abcdef',
    ipfs_uri:
      'ipfs://bafybeicnuw2ytgukpr5uzmdyt6gdsbkq2xvula4odrqpnbx2ens4qfoywm/purchase-receipt.json',
    smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
  };

/**
 * Creates a credit purchase receipt reference fixture with optional overrides.
 *
 * @param overrides - Optional partial credit purchase receipt reference to override default values
 * @returns A complete credit purchase receipt reference fixture
 */
export function createCreditPurchaseReceiptReferenceFixture(
  overrides?: Partial<CreditPurchaseReceiptReference>,
): CreditPurchaseReceiptReference {
  return {
    ...minimalCreditPurchaseReceiptReferenceStub,
    ...overrides,
  };
}

/**
 * Minimal credit retirement receipt reference stub for testing.
 *
 * Contains only required fields for credit retirement receipt reference schema validation.
 * Used as a base for creating custom credit retirement receipt reference fixtures in tests.
 */
export const minimalCreditRetirementReceiptReferenceStub: CreditRetirementReceiptReference =
  {
    external_id: 'c3d4e5f6-a7b8-4902-9234-789012cdefab',
    token_id: '1002',
    external_url:
      'https://explore.carrot.eco/document/c3d4e5f6-a7b8-4902-9234-789012cdefab',
    ipfs_uri:
      'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku/retirement-receipt.json',
    smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
  };

/**
 * Valid credit retirement receipt reference fixture for testing.
 *
 * Represents a complete credit retirement receipt reference that satisfies the credit retirement receipt reference schema.
 * Used in tests to validate credit retirement receipt reference schema parsing and validation.
 */
export const validCreditRetirementReceiptReferenceFixture: CreditRetirementReceiptReference =
  {
    external_id: 'c3d4e5f6-a7b8-4902-9234-789012cdefab',
    token_id: '1002',
    external_url:
      'https://explore.carrot.eco/document/c3d4e5f6-a7b8-4902-9234-789012cdefab',
    ipfs_uri:
      'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku/retirement-receipt.json',
    smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
  };

/**
 * Creates a credit retirement receipt reference fixture with optional overrides.
 *
 * @param overrides - Optional partial credit retirement receipt reference to override default values
 * @returns A complete credit retirement receipt reference fixture
 */
export function createCreditRetirementReceiptReferenceFixture(
  overrides?: Partial<CreditRetirementReceiptReference>,
): CreditRetirementReceiptReference {
  return {
    ...minimalCreditRetirementReceiptReferenceStub,
    ...overrides,
  };
}

/**
 * Minimal credit reference stub for testing.
 *
 * Contains only required fields for credit reference schema validation.
 * Used as a base for creating custom credit reference fixtures in tests.
 */
export const minimalCreditReferenceStub: CreditReference = {
  external_id: 'd4e5f6a7-b8c9-4903-9234-890123defabc',
  external_url:
    'https://explore.carrot.eco/document/d4e5f6a7-b8c9-4903-9234-890123defabc',
  ipfs_uri:
    'ipfs://bafybeicnuw2ytgukpr5uzmdyt6gdsbkq2xvula4odrqpnbx2ens4qfoywm/credit.json',
  smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
  slug: 'biowaste',
  symbol: 'C-BIOW',
};

/**
 * Valid credit reference fixture for testing.
 *
 * Represents a complete credit reference that satisfies the credit reference schema.
 * Used in tests to validate credit reference schema parsing and validation.
 */
export const validCreditReferenceFixture: CreditReference = {
  external_id: 'd4e5f6a7-b8c9-4903-9234-890123defabc',
  external_url:
    'https://explore.carrot.eco/document/d4e5f6a7-b8c9-4903-9234-890123defabc',
  ipfs_uri:
    'ipfs://bafybeicnuw2ytgukpr5uzmdyt6gdsbkq2xvula4odrqpnbx2ens4qfoywm/credit.json',
  smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
  slug: 'biowaste',
  symbol: 'C-BIOW',
};

/**
 * Creates a credit reference fixture with optional overrides.
 *
 * @param overrides - Optional partial credit reference to override default values
 * @returns A complete credit reference fixture
 */
export function createCreditReferenceFixture(
  overrides?: Partial<CreditReference>,
): CreditReference {
  return {
    ...minimalCreditReferenceStub,
    ...overrides,
  };
}

/**
 * Minimal certificate reference stub for testing.
 *
 * Contains only required fields for certificate reference schema validation.
 * Used as a base for creating custom certificate reference fixtures in tests.
 */
export const minimalCertificateReferenceStub: CertificateReferenceBase = {
  external_id: 'e5f6a7b8-c9d0-4904-9234-901234efabcd',
  token_id: '2001',
  external_url:
    'https://explore.carrot.eco/document/e5f6a7b8-c9d0-4904-9234-901234efabcd',
  ipfs_uri:
    'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku/certificate.json',
  smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
  type: 'GasID',
  total_amount: 100.5,
  mass_id: minimalMassIDReferenceStub,
};

/**
 * Valid certificate reference fixture for testing.
 *
 * Represents a complete certificate reference that satisfies the certificate reference schema.
 * Used in tests to validate certificate reference schema parsing and validation.
 */
export const validCertificateReferenceFixture: CertificateReferenceBase = {
  external_id: 'e5f6a7b8-c9d0-4904-9234-901234efabcd',
  token_id: '2001',
  external_url:
    'https://explore.carrot.eco/document/e5f6a7b8-c9d0-4904-9234-901234efabcd',
  ipfs_uri:
    'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku/certificate.json',
  smart_contract_address: '0x1234567890abcdef1234567890abcdef12345678',
  type: 'GasID',
  total_amount: 100.5,
  mass_id: validMassIDReferenceFixture,
};

/**
 * Creates a certificate reference fixture with optional overrides.
 *
 * @param overrides - Optional partial certificate reference to override default values
 * @returns A complete certificate reference fixture
 */
export function createCertificateReferenceFixture(
  overrides?: Partial<CertificateReferenceBase>,
): CertificateReferenceBase {
  return {
    ...minimalCertificateReferenceStub,
    ...overrides,
  };
}
