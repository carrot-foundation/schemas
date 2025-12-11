import { z } from 'zod';

const nativeDateParse = Date.parse.bind(Date);

const ISO_TIMESTAMP_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

export const UuidSchema = z.uuidv4().meta({
  title: 'UUID V4',
  description: 'A universally unique identifier version 4',
  examples: ['ad44dd3f-f176-4b98-bf78-5ee6e77d0530'],
});
export type Uuid = z.infer<typeof UuidSchema>;

export const EthereumAddressSchema = z
  .string()
  .regex(
    /^0x[a-f0-9]{40}$/,
    'Must be a valid Ethereum address in lowercase hexadecimal format',
  )
  .meta({
    title: 'Ethereum Address',
    description: 'A valid Ethereum address in hexadecimal format',
    examples: ['0x1234567890abcdef1234567890abcdef12345678'],
  });
export type EthereumAddress = z.infer<typeof EthereumAddressSchema>;

export const IsoTimestampSchema = z
  .string()
  .regex(
    ISO_TIMESTAMP_REGEX,
    'Must be a valid ISO 8601 timestamp with timezone information',
  )
  .superRefine((value, ctx) => {
    const parsed = nativeDateParse(value);

    if (Number.isNaN(parsed)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Must be a valid ISO 8601 timestamp with timezone information',
      });
    }
  })
  .meta({
    title: 'ISO Timestamp',
    description: 'ISO 8601 formatted timestamp with timezone information',
    examples: ['2024-12-05T11:02:47.000Z'],
  });
export type IsoTimestamp = z.infer<typeof IsoTimestampSchema>;

export const IsoDateSchema = z.iso
  .date('Must be a valid ISO 8601 date (YYYY-MM-DD)')
  .meta({
    title: 'ISO Date',
    description: 'ISO 8601 formatted date in YYYY-MM-DD format',
    examples: ['2024-12-05'],
  });
export type IsoDate = z.infer<typeof IsoDateSchema>;

export const UnixTimestampSchema = z
  .number()
  .int()
  .positive()
  .meta({
    title: 'Unix Timestamp',
    description:
      'Unix timestamp in milliseconds since epoch (January 1, 1970 00:00:00 UTC)',
    examples: [1704067200000],
  });
export type UnixTimestamp = z.infer<typeof UnixTimestampSchema>;

export const IsoCountryCodeSchema = z
  .string()
  .regex(/^[A-Z]{2}$/, 'Must be a valid ISO 3166-1 alpha-2 country code')
  .meta({
    title: 'ISO Country Code',
    description:
      'Two-letter country code following ISO 3166-1 alpha-2 standard',
    examples: ['BR', 'US', 'DE'],
  });
export type IsoCountryCode = z.infer<typeof IsoCountryCodeSchema>;

export const IsoAdministrativeDivisionCodeSchema = z
  .string()
  .regex(
    /^[A-Z]{2}-[A-Z0-9]{1,3}$/,
    'Must be a valid ISO 3166-2 administrative division code',
  )
  .meta({
    title: 'ISO Administrative Division Code',
    description: 'Administrative division code following ISO 3166-2 standard',
    examples: ['BR-AP', 'BR-ES', 'US-CA'],
  });
export type IsoAdministrativeDivisionCode = z.infer<
  typeof IsoAdministrativeDivisionCodeSchema
>;

export const LatitudeSchema = z
  .number()
  .min(-90)
  .max(90)
  .multipleOf(0.001)
  .meta({
    title: 'Latitude',
    description:
      'Geographic latitude coordinate in decimal degrees with maximum 3 decimal places precision (~100m-1km accuracy for city-level)',
    examples: [-0.02, -20.38, 40.713],
  });
export type Latitude = z.infer<typeof LatitudeSchema>;

export const LongitudeSchema = z
  .number()
  .min(-180)
  .max(180)
  .multipleOf(0.001)
  .meta({
    title: 'Longitude',
    description:
      'Geographic longitude coordinate in decimal degrees with maximum 3 decimal places precision (~100m-1km accuracy for city-level)',
    examples: [-51.06, -40.34, -74.006],
  });
export type Longitude = z.infer<typeof LongitudeSchema>;

export const NonNegativeFloatSchema = z
  .number()
  .min(0)
  .meta({
    title: 'Non-Negative Float',
    description: 'Floating-point number that is zero or positive',
    examples: [0, 45.2, 72.5],
  });
export type NonNegativeFloat = z.infer<typeof NonNegativeFloatSchema>;

export const WeightKgSchema = NonNegativeFloatSchema.meta({
  title: 'Weight (kg)',
  description: 'Weight measurement in kilograms',
  examples: [3000, 1500, 500],
});
export type WeightKg = z.infer<typeof WeightKgSchema>;

export const NonEmptyStringSchema = z
  .string()
  .min(1, 'Cannot be empty')
  .meta({
    title: 'Non-Empty String',
    description: 'A string that contains at least one character',
    examples: ['Example text', 'Sample value', 'Test string'],
  });
export type NonEmptyString = z.infer<typeof NonEmptyStringSchema>;

export const MunicipalitySchema = NonEmptyStringSchema.max(50).meta({
  title: 'Municipality',
  description: 'Municipality or city name',
  examples: ['Macapá', 'São Paulo', 'New York', 'Berlin', 'Tokyo'],
});
export type Municipality = z.infer<typeof MunicipalitySchema>;

export const AdministrativeDivisionSchema = NonEmptyStringSchema.max(50).meta({
  title: 'Administrative Division',
  description: 'State, province, or administrative region name',
  examples: ['Amapá', 'California', 'Bavaria'],
});
export type AdministrativeDivision = z.infer<
  typeof AdministrativeDivisionSchema
>;

export const CountryNameSchema = NonEmptyStringSchema.max(50).meta({
  title: 'Country',
  description: 'Full country name in English',
  examples: ['Brazil', 'United States', 'Germany', 'Japan'],
});
export type CountryName = z.infer<typeof CountryNameSchema>;

export const CollectionNameSchema = NonEmptyStringSchema.max(150).meta({
  title: 'Collection Name',
  description: 'Display name of the collection',
  examples: ['BOLD Cold Start - Carazinho', 'BOLD Brazil'],
});
export type CollectionName = z.infer<typeof CollectionNameSchema>;

export const MethodologyNameSchema = NonEmptyStringSchema.max(100).meta({
  title: 'Methodology Name',
  description: 'Name of the methodology used for certification',
  examples: ['BOLD Recycling', 'BOLD Carbon (CH₄)'],
});
export type MethodologyName = z.infer<typeof MethodologyNameSchema>;

export const StringifiedTokenIdSchema = NonEmptyStringSchema.regex(
  /^#\d+$/,
  'Must match pattern #<token_id>',
).meta({
  title: 'Token ID',
  description: 'Token ID represented as #<token_id>',
  example: '#123',
});
export type StringifiedTokenId = z.infer<typeof StringifiedTokenIdSchema>;

export const SlugSchema = NonEmptyStringSchema.regex(
  /^[a-z0-9-]+$/,
  'Must contain only lowercase letters, numbers, and hyphens',
)
  .max(100)
  .meta({
    title: 'Slug',
    description:
      'URL-friendly identifier with lowercase letters, numbers, and hyphens',
    examples: ['mass-id-123', 'recycled-plastic', 'organic-waste'],
  });
export type Slug = z.infer<typeof SlugSchema>;

export const CollectionSlugSchema = SlugSchema.meta({
  title: 'Collection Slug',
  description: 'URL-friendly identifier for a collection',
  examples: ['bold-cold-start-carazinho', 'bold-brazil'],
});
export type CollectionSlug = z.infer<typeof CollectionSlugSchema>;

export const WasteTypeSchema = NonEmptyStringSchema.max(100).meta({
  title: 'Waste Type',
  description: 'Category or type of waste material',
  examples: ['Organic', 'Plastic', 'Metal'],
});
export type WasteType = z.infer<typeof WasteTypeSchema>;

export const WasteSubtypeSchema = NonEmptyStringSchema.max(100).meta({
  title: 'Waste Subtype',
  description: 'Specific subcategory of waste within a waste type',
  examples: ['Food, Food Waste and Beverages', 'Domestic Sludge'],
});
export type WasteSubtype = z.infer<typeof WasteSubtypeSchema>;

export const ParticipantRoleSchema = NonEmptyStringSchema.max(100).meta({
  title: 'Participant Role',
  description:
    'Role that a participant plays in the waste management supply chain',
  examples: ['Waste Generator', 'Hauler', 'Recycler'],
});
export type ParticipantRole = z.infer<typeof ParticipantRoleSchema>;

export const ParticipantNameSchema = NonEmptyStringSchema.max(100).meta({
  title: 'Participant Name',
  description: 'Name of a participant in the waste management system',
  examples: ['Enlatados Produção', 'Eco Reciclagem', 'Green Tech Corp'],
});
export type ParticipantName = z.infer<typeof ParticipantNameSchema>;

export const BlockchainChainIdSchema = z
  .union([z.literal(137), z.literal(80002)])
  .meta({
    title: 'Chain ID',
    description: 'Supported Polygon chain identifiers',
    examples: [137, 80002],
  });
export type BlockchainChainId = z.infer<typeof BlockchainChainIdSchema>;

export const BlockchainNetworkNameSchema = z.enum(['Polygon', 'Amoy']).meta({
  title: 'Blockchain Network Name',
  description: 'Supported Polygon network names',
  examples: ['Polygon', 'Amoy'],
});
export type BlockchainNetworkName = z.infer<typeof BlockchainNetworkNameSchema>;

export const SmartContractAddressSchema = EthereumAddressSchema.meta({
  title: 'Smart Contract Address',
  description: 'Address of the smart contract',
});
export type SmartContractAddress = z.infer<typeof SmartContractAddressSchema>;

export const SmartContractSchema = z
  .strictObject({
    address: SmartContractAddressSchema,
    chain_id: BlockchainChainIdSchema,
    network_name: BlockchainNetworkNameSchema,
  })
  .meta({
    title: 'Smart Contract',
    description: 'Smart contract details for on-chain references',
  });
export type SmartContract = z.infer<typeof SmartContractSchema>;

export const PercentageSchema = NonNegativeFloatSchema.max(100).meta({
  title: 'Percentage',
  description: 'Percentage value between 0 and 100',
  examples: [50, 75.5, 100],
});
export type Percentage = z.infer<typeof PercentageSchema>;

export const NonNegativeIntegerSchema = z
  .number()
  .int()
  .min(0)
  .meta({
    title: 'Non-Negative Integer',
    description: 'Integer value that is zero or positive',
    examples: [0, 123, 4126],
  });
export type NonNegativeInteger = z.infer<typeof NonNegativeIntegerSchema>;

export const PositiveIntegerSchema = z
  .number()
  .int()
  .min(1)
  .meta({
    title: 'Positive Integer',
    description: 'Integer value that is greater than zero',
    examples: [1, 123, 456],
  });
export type PositiveInteger = z.infer<typeof PositiveIntegerSchema>;

export const CreditTypeSchema = NonEmptyStringSchema.max(100).meta({
  title: 'Credit Type',
  description: 'Type of credit issued',
  examples: ['Organic', 'Carbon (CH₄)'],
});
export type CreditType = z.infer<typeof CreditTypeSchema>;

export const CreditAmountSchema = NonNegativeFloatSchema.meta({
  title: 'Credit Amount',
  description: 'Amount of credits issued',
});
export type CreditAmount = z.infer<typeof CreditAmountSchema>;

export const HoursSchema = z
  .number()
  .min(0)
  .multipleOf(0.1)
  .meta({
    title: 'Hours',
    description: 'Time duration in hours with 0.1 hour precision',
    examples: [72.5, 24, 168.5],
  });
export type Hours = z.infer<typeof HoursSchema>;

export const MinutesSchema = NonNegativeIntegerSchema.meta({
  title: 'Minutes',
  description: 'Time duration in minutes',
  examples: [4350, 1440, 10110],
});
export type Minutes = z.infer<typeof MinutesSchema>;

export const IpfsUriSchema = NonEmptyStringSchema.regex(
  /^ipfs:\/\/[a-zA-Z0-9]+(\/.*)?$/,
  'Must be a valid IPFS URI with CID',
).meta({
  title: 'IPFS URI',
  description: 'InterPlanetary File System URI pointing to distributed content',
  examples: [
    'ipfs://QmTy8w65yBXgyfG2ZBg5TrfB2hPjrDQH3RCQFJGkARStJb/mass-id-organic.png',
    'ipfs://QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o',
  ],
});
export type IpfsUri = z.infer<typeof IpfsUriSchema>;

export const SemanticVersionSchema = NonEmptyStringSchema.regex(
  /^v?\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/,
  'Must be a valid semantic version string',
).meta({
  title: 'Semantic Version',
  description: 'Version string following semantic versioning specification',
  examples: ['0.1.0', '1.0.0', '2.1.3'],
});
export type SemanticVersion = z.infer<typeof SemanticVersionSchema>;

export const TokenIdSchema = NonEmptyStringSchema.regex(
  /^\d+$/,
  'Must be a numeric string (supports uint256)',
).meta({
  title: 'Token ID',
  description: 'Numeric identifier for blockchain tokens as string',
  examples: ['456789', '1000000'],
});
export type TokenId = z.infer<typeof TokenIdSchema>;

export const HexColorSchema = NonEmptyStringSchema.regex(
  /^#[0-9A-F]{6}$/,
  'Must be a hex color code with # prefix and uppercase',
).meta({
  title: 'Hex Color',
  description: 'Hexadecimal color code with hash prefix',
  examples: ['#2D5A27', '#FF5733'],
});
export type HexColor = z.infer<typeof HexColorSchema>;

export const Sha256HashSchema = z
  .hash('sha256', {
    error: 'Must be a SHA-256 hash as 32-byte hex string',
  })
  .meta({
    format: undefined,
    title: 'SHA-256 Hash',
    description: 'SHA-256 cryptographic hash as hexadecimal string',
    examples: [
      '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
    ],
  });
export type Sha256Hash = z.infer<typeof Sha256HashSchema>;

export const ExternalIdSchema = UuidSchema.meta({
  title: 'External ID',
  description: 'UUID identifier for external system references',
});
export type ExternalId = z.infer<typeof ExternalIdSchema>;

export const ExternalUrlSchema = z.url().meta({
  title: 'External URL',
  description: 'URL pointing to external resources',
  examples: [
    'https://explore.carrot.eco/',
    'https://https://whitepaper.carrot.eco/',
  ],
});
export type ExternalUrl = z.infer<typeof ExternalUrlSchema>;

export const RecordSchemaTypeSchema = z
  .enum([
    'MassID',
    'MassID Audit',
    'RecycledID',
    'GasID',
    'CreditPurchaseReceipt',
    'CreditRetirementReceipt',
    'Methodology',
    'Credit',
    'Collection',
  ])
  .meta({
    title: 'Schema Type',
    description: 'Type of schema in the Carrot ecosystem',
    examples: ['MassID', 'RecycledID', 'GasID'],
  });
export type RecordSchemaType = z.infer<typeof RecordSchemaTypeSchema>;

export const TokenSymbolSchema = NonEmptyStringSchema.max(10)
  .regex(
    /^[A-Z0-9-]+$/,
    'Must contain only uppercase letters, numbers, and hyphens',
  )
  .meta({
    title: 'Token Symbol',
    description: 'Symbol representing a token or cryptocurrency',
    examples: ['MASS', 'REC', 'GAS'],
  });
export type TokenSymbol = z.infer<typeof TokenSymbolSchema>;

export const CreditTokenSymbolSchema = TokenSymbolSchema.meta({
  title: 'Credit Token Symbol',
  description: 'Symbol of the credit token (e.g., C-CARB, C-BIOW)',
  examples: ['C-CARB', 'C-BIOW'],
});
export type CreditTokenSymbol = z.infer<typeof CreditTokenSymbolSchema>;
