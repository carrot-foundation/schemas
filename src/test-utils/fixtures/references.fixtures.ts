import type {
  AuditReference,
  GasIDReference,
  MassIDReference,
  MethodologyReference,
} from '../../shared/references';

export const validAuditReference: AuditReference = {
  date: '2025-06-24',
  external_id: 'a1b2c3d4-e5f6-4890-8234-567890abcdef',
  external_url:
    'https://explore.carrot.eco/document/a1b2c3d4-e5f6-4890-8234-567890abcdef',
  methodology_compliance: 'PASSED',
  rules_executed: 21,
  report: 'ipfs://QmVerificationHash/mass-id-audit.json',
};

export const validGasIDReference: GasIDReference = {
  external_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  token_id: '456',
  external_url:
    'https://explore.carrot.eco/document/f47ac10b-58cc-4372-a567-0e02b2c3d479',
  uri: 'ipfs://QmGasIDHash456/gas-id.json',
};

export const validMassIDReference: MassIDReference = {
  external_id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
  token_id: '123',
  external_url:
    'https://explore.carrot.eco/document/6f520d88-864d-432d-bf9f-5c3166c4818f',
  uri: 'ipfs://QmYx8FdKl2mN9pQ7rS6tV8wB3cE4fG5hI9jK0lM1nO2pQ3r/mass-id.json',
};

export const validMethodologyReference: MethodologyReference = {
  external_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d480',
  name: 'BOLD Carbon (CH₄)',
  version: '1.3.0',
  external_url:
    'https://explore.carrot.eco/document/f47ac10b-58cc-4372-a567-0e02b2c3d480',
  uri: 'ipfs://QmMethodologyHash/bold-carbon-ch4-v1.3.0.pdf',
};
