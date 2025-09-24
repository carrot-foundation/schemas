import { z } from 'zod';

export const uuid = z.uuidv4('Must be a valid UUID v4 string');

export const ethereumAddress = z
  .string()
  .regex(
    /^0x[a-f0-9]{40}$/,
    'Must be a valid Ethereum address in lowercase hexadecimal format',
  );

export const isoTimestamp = z.iso.datetime({
  message: 'Must be a valid ISO 8601 timestamp with timezone',
});

export const isoDate = z.iso.date('Must be a valid ISO 8601 date (YYYY-MM-DD)');

export const isoCountryCode = z
  .string()
  .regex(/^[A-Z]{2}$/, 'Must be a valid ISO 3166-1 alpha-2 country code');

export const isoAdministrativeDivisionCode = z
  .string()
  .regex(
    /^[A-Z]{2}-[A-Z0-9]{1,3}$/,
    'Must be a valid ISO 3166-2 administrative division code',
  );

export const latitude = z.number().min(-90).max(90);
export const longitude = z.number().min(-180).max(180);

export const weightKg = z.number().min(0);

export const nonEmptyString = z.string().min(1, 'Cannot be empty');

export const name = nonEmptyString.max(200);

export const slug = nonEmptyString
  .regex(
    /^[a-z0-9-]+$/,
    'Must contain only lowercase letters, numbers, and hyphens',
  )
  .max(100);

export const wasteType = nonEmptyString;

export const wasteSubtype = nonEmptyString.max(100);

export const participantRole = nonEmptyString.max(100);

export const participantName = nonEmptyString.max(100);

export const facilityType = z.enum([
  'Waste Generation',
  'Collection Point',
  'Transfer Station',
  'Sorting Facility',
  'Composting Facility',
  'Recycling Facility',
  'Processing Facility',
  'Disposal Facility',
  'Administrative Office',
]);

export const chainId = z.number().int().min(1);

export const percentage = z.number().min(0).max(100);

export const nonNegativeInteger = z.number().int().min(0);

export const positiveInteger = z.number().int().min(1);

export const nonNegativeFloat = z.number().min(0);

export const hours = z.number().min(0).multipleOf(0.1);

export const ipfsUri = nonEmptyString.regex(
  /^ipfs:\/\/[a-zA-Z0-9]+(\/.*)?$/,
  'Must be a valid IPFS URI with CID',
);

export const semanticVersion = nonEmptyString.regex(
  /^v?\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/,
  'Must be a valid semantic version string',
);

export const tokenId = nonEmptyString.regex(
  /^[0-9]+$/,
  'Must be a numeric string (supports uint256)',
);

export const hexColor = nonEmptyString.regex(
  /^#[0-9A-F]{6}$/,
  'Must be a hex color code with # prefix and uppercase',
);

export const sha256Hash = z.hash('sha256', {
  error: 'Must be a SHA256 hash as 32-byte hex string',
});

export const keccak256Hash = sha256Hash.describe(
  'Keccak256 hash as 32-byte hex string',
);

export const externalId = uuid;

export const externalUrl = z.url('Must be a valid URL');

export const schemaType = z.enum([
  'MassID',
  'MassID Audit',
  'RecycledID',
  'GasID',
  'PurchaseID',
  'Methodology',
  'Credit',
  'Collection',
]);

export const tokenSymbol = nonEmptyString
  .max(10)
  .regex(
    /^[A-Z0-9-]+$/,
    'Must contain only uppercase letters, numbers, and hyphens',
  );

export const relationshipType = z.enum([
  'collection',
  'credit',
  'gas-id',
  'mass-id',
  'mass-id-audit',
  'methodology',
  'purchase-id',
  'recycled-id',
]);

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
export type IPFSUri = z.infer<typeof ipfsUri>;
export type SemanticVersion = z.infer<typeof semanticVersion>;
export type TokenId = z.infer<typeof tokenId>;
export type HexColor = z.infer<typeof hexColor>;
export type Keccak256Hash = z.infer<typeof keccak256Hash>;
export type ExternalId = z.infer<typeof externalId>;
export type ExternalUrl = z.infer<typeof externalUrl>;
export type TokenSymbol = z.infer<typeof tokenSymbol>;
export type RelationshipType = z.infer<typeof relationshipType>;
