import { z } from 'zod';

export const uuid = z.uuidv4('Must be a valid UUID v4 string').meta({
  title: 'UUID',
  examples: [
    'ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
    '6f520d88-864d-432d-bf9f-5c3166c4818f',
    'f77afa89-1c58-40fd-9bf5-8a86703a8af4',
  ],
});

export const ethereumAddress = z
  .string()
  .regex(
    /^0x[a-fA-F0-9]{40}$/,
    'Must be a valid Ethereum address in lowercase hexadecimal format',
  )
  .meta({
    title: 'Ethereum Address',
    examples: [
      '0x1234567890abcdef1234567890abcdef12345678',
      '0xabcdef1234567890abcdef1234567890abcdef12',
    ],
  });

export const isoTimestamp = z.iso
  .datetime({
    message: 'Must be a valid ISO 8601 timestamp with timezone',
  })
  .meta({
    title: 'ISO Timestamp',
    examples: ['2024-12-05T11:02:47.000Z', '2025-02-22T10:35:12.000Z'],
  });

export const isoDate = z.iso
  .date('Must be a valid ISO 8601 date (YYYY-MM-DD)')
  .meta({
    title: 'ISO Date',
    examples: ['2024-12-05', '2025-02-22', '2024-02-10'],
  });

export const isoCountryCode = z
  .string()
  .regex(/^[A-Z]{2}$/, 'Must be a valid ISO 3166-1 alpha-2 country code')
  .meta({
    title: 'ISO Country Code',
    examples: ['BR', 'US', 'DE'],
  });

export const isoAdministrativeDivisionCode = z
  .string()
  .regex(
    /^[A-Z]{2}-[A-Z0-9]{1,3}$/,
    'Must be a valid ISO 3166-2 administrative division code',
  )
  .meta({
    title: 'ISO Administrative Division Code',
    examples: ['BR-AP', 'BR-ES', 'US-CA'],
  });

export const latitude = z
  .number()
  .min(-90)
  .max(90)
  .meta({
    title: 'Latitude',
    examples: [-0.02, -20.38, 40.7128],
  });
export const longitude = z
  .number()
  .min(-180)
  .max(180)
  .meta({
    title: 'Longitude',
    examples: [-51.06, -40.34, -74.006],
  });

export const weightKg = z
  .number()
  .min(0)
  .meta({
    title: 'Weight (kg)',
    examples: [3000, 1500, 500],
  });

export const nonEmptyString = z
  .string()
  .min(1, 'Cannot be empty')
  .meta({
    title: 'Non-Empty String',
    examples: ['Example text', 'Sample value', 'Test string'],
  });

export const name = nonEmptyString.max(200).meta({
  title: 'Name',
  examples: ['Enlatados Produção', 'Eco Reciclagem', 'Green Solutions Ltd'],
});

export const slug = nonEmptyString
  .regex(
    /^[a-z0-9-]+$/,
    'Must contain only lowercase letters, numbers, and hyphens',
  )
  .max(100)
  .meta({
    title: 'Slug',
    examples: ['mass-id-123', 'recycled-plastic', 'organic-waste'],
  });

export const wasteType = nonEmptyString.meta({
  title: 'Waste Type',
  examples: ['Organic', 'Plastic', 'Metal'],
});

export const wasteSubtype = nonEmptyString.max(100).meta({
  title: 'Waste Subtype',
  examples: ['Food, Food Waste and Beverages', 'PET Bottles', 'Aluminum Cans'],
});

export const participantRole = nonEmptyString.max(100).meta({
  title: 'Participant Role',
  examples: ['Waste Generator', 'Hauler', 'Recycler'],
});

export const participantName = nonEmptyString.max(100).meta({
  title: 'Participant Name',
  examples: ['Enlatados Produção', 'Eco Reciclagem', 'Green Tech Corp'],
});

export const facilityType = z
  .enum([
    'Waste Generation',
    'Collection Point',
    'Transfer Station',
    'Sorting Facility',
    'Composting Facility',
    'Recycling Facility',
    'Processing Facility',
    'Disposal Facility',
    'Administrative Office',
  ])
  .meta({
    title: 'Facility Type',
    examples: ['Waste Generation', 'Recycling Facility', 'Collection Point'],
  });

export const chainId = z
  .number()
  .int()
  .min(1)
  .meta({
    title: 'Chain ID',
    examples: [1, 137, 11155111],
  });

export const percentage = z
  .number()
  .min(0)
  .max(100)
  .meta({
    title: 'Percentage',
    examples: [50, 75.5, 100],
  });

export const nonNegativeInteger = z
  .number()
  .int()
  .min(0)
  .meta({
    title: 'Non-Negative Integer',
    examples: [0, 123, 4126],
  });

export const positiveInteger = z
  .number()
  .int()
  .min(1)
  .meta({
    title: 'Positive Integer',
    examples: [1, 123, 456],
  });

export const nonNegativeFloat = z
  .number()
  .min(0)
  .meta({
    title: 'Non-Negative Float',
    examples: [0.0, 45.2, 72.5],
  });

export const hours = z
  .number()
  .min(0)
  .multipleOf(0.1)
  .meta({
    title: 'Hours',
    examples: [72.5, 24.0, 168.5],
  });

export const ipfsUri = nonEmptyString
  .regex(/^ipfs:\/\/[a-zA-Z0-9]+(\/.*)?$/, 'Must be a valid IPFS URI with CID')
  .meta({
    title: 'IPFS URI',
    examples: [
      'ipfs://QmTy8w65yBXgyfG2ZBg5TrfB2hPjrDQH3RCQFJGkARStJb/mass-id-organic.png',
      'ipfs://QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o',
    ],
  });

export const semanticVersion = nonEmptyString
  .regex(
    /^v?\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/,
    'Must be a valid semantic version string',
  )
  .meta({
    title: 'Semantic Version',
    examples: ['0.1.0', '1.0.0', '2.1.3'],
  });

export const tokenId = nonEmptyString
  .regex(/^\d+$/, 'Must be a numeric string (supports uint256)')
  .meta({
    title: 'Token ID',
    examples: ['123', '456789', '1000000'],
  });

export const hexColor = nonEmptyString
  .regex(
    /^#[0-9A-F]{6}$/,
    'Must be a hex color code with # prefix and uppercase',
  )
  .meta({
    title: 'Hex Color',
    examples: ['#2D5A27', '#FF5733', '#1E90FF'],
  });

export const sha256Hash = z
  .hash('sha256', {
    error: 'Must be a SHA256 hash as 32-byte hex string',
  })
  .meta({
    format: undefined,
    title: 'SHA256 Hash',
    examples: [
      '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
      '6e83b8e6373847bbdc056549bedda38dc88854ce41ba4fca11e0fc6ce3e07ef6',
    ],
  });

export const keccak256Hash = sha256Hash
  .describe('Keccak256 hash as 32-byte hex string')
  .meta({
    title: 'Keccak256 Hash',
    examples: [
      'ac08c3cf2e175e55961d6affdb38bc24591b84ceef7f3707c69ae3d52c148b2f',
      'b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
    ],
  });

export const externalId = uuid.meta({
  title: 'External ID',
  examples: [
    'ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
    'b2c4e6f8-a1b3-4c5d-9e8f-123456789abc',
  ],
});

export const externalUrl = z.url('Must be a valid URL').meta({
  title: 'External URL',
  examples: [
    'https://explore.carrot.eco/document/ad44dd3f-f176-4b98-bf78-5ee6e77d0530',
    'https://carrot.eco/whitepaper.pdf',
  ],
});

export const schemaType = z
  .enum([
    'MassID',
    'MassID Audit',
    'RecycledID',
    'GasID',
    'PurchaseID',
    'Methodology',
    'Credit',
    'Collection',
  ])
  .meta({
    title: 'Schema Type',
    examples: ['MassID', 'RecycledID', 'GasID'],
  });

export const tokenSymbol = nonEmptyString
  .max(10)
  .regex(
    /^[A-Z0-9-]+$/,
    'Must contain only uppercase letters, numbers, and hyphens',
  )
  .meta({
    title: 'Token Symbol',
    examples: ['MASS', 'REC', 'GAS'],
  });

export const relationshipType = z
  .enum([
    'collection',
    'credit',
    'gas-id',
    'mass-id',
    'mass-id-audit',
    'methodology',
    'purchase-id',
    'recycled-id',
  ])
  .meta({
    title: 'Relationship Type',
    examples: ['mass-id', 'audit', 'collection'],
  });

export type UUID = z.infer<typeof uuid>;
export type EthereumAddress = z.infer<typeof ethereumAddress>;
export type ISOTimestamp = z.infer<typeof isoTimestamp>;
export type ISODate = z.infer<typeof isoDate>;
export type ISOCountryCode = z.infer<typeof isoCountryCode>;
export type ISOAdministrativeDivisionCode = z.infer<
  typeof isoAdministrativeDivisionCode
>;
export type Latitude = z.infer<typeof latitude>;
export type Longitude = z.infer<typeof longitude>;
export type WeightKg = z.infer<typeof weightKg>;
export type NonEmptyString = z.infer<typeof nonEmptyString>;
export type Name = z.infer<typeof name>;
export type Slug = z.infer<typeof slug>;
export type WasteType = z.infer<typeof wasteType>;
export type WasteSubtype = z.infer<typeof wasteSubtype>;
export type ParticipantRole = z.infer<typeof participantRole>;
export type ParticipantName = z.infer<typeof participantName>;
export type FacilityType = z.infer<typeof facilityType>;
export type ChainId = z.infer<typeof chainId>;
export type Percentage = z.infer<typeof percentage>;
export type NonNegativeInteger = z.infer<typeof nonNegativeInteger>;
export type PositiveInteger = z.infer<typeof positiveInteger>;
export type NonNegativeFloat = z.infer<typeof nonNegativeFloat>;
export type Hours = z.infer<typeof hours>;
export type IpfsUri = z.infer<typeof ipfsUri>;
export type SemanticVersion = z.infer<typeof semanticVersion>;
export type TokenId = z.infer<typeof tokenId>;
export type HexColor = z.infer<typeof hexColor>;
export type Keccak256Hash = z.infer<typeof keccak256Hash>;
export type ExternalId = z.infer<typeof externalId>;
export type ExternalUrl = z.infer<typeof externalUrl>;
export type TokenSymbol = z.infer<typeof tokenSymbol>;
export type RelationshipType = z.infer<typeof relationshipType>;
