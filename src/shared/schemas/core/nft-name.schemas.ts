import { NonEmptyStringSchema } from '../primitives';

type NameConfig = {
  prefix: string;
  regexSuffix: string;
  formatHint: string;
  title: string;
  description: string;
  examples: [string, string];
  maxLength?: number;
};

type ShortNameConfig = {
  prefix: string;
  title: string;
  description: string;
  examples: [string, string];
  maxLength?: number;
};

function buildNameSchemas(config: NameConfig) {
  const {
    prefix,
    regexSuffix,
    formatHint,
    title,
    description,
    examples,
    maxLength = 100,
  } = config;
  const meta = { title, description, examples };

  const schema = NonEmptyStringSchema.max(maxLength)
    .regex(
      new RegExp(`^${prefix} #\\d+${regexSuffix}$`),
      `Name must match format: "${prefix} #[token_id] • ${formatHint}"`,
    )
    .meta(meta);

  const createSchema = (tokenId: string) =>
    NonEmptyStringSchema.max(maxLength)
      .regex(
        new RegExp(String.raw`^${prefix} #${tokenId}${regexSuffix}$`),
        `Name must match format: "${prefix} #${tokenId} • ${formatHint}"`,
      )
      .meta(meta);

  return { schema, createSchema };
}

function buildShortNameSchemas(config: ShortNameConfig) {
  const { prefix, title, description, examples, maxLength = 50 } = config;
  const meta = { title, description, examples };

  const schema = NonEmptyStringSchema.max(maxLength)
    .regex(
      new RegExp(`^${prefix} #\\d+$`),
      `Short name must match format: "${prefix} #[token_id]"`,
    )
    .meta(meta);

  const createSchema = (tokenId: string) =>
    NonEmptyStringSchema.max(maxLength)
      .refine(
        (val) => val === `${prefix} #${tokenId}`,
        `Short name must be exactly "${prefix} #${tokenId}"`,
      )
      .meta(meta);

  return { schema, createSchema };
}

const massIDName = buildNameSchemas({
  prefix: 'MassID',
  regexSuffix: ' • .+ • .+t',
  formatHint: '[waste_type] • [weight]t',
  title: 'MassID Name',
  description:
    'Full display name for this MassID NFT. Format: "MassID #[token_id] • [waste_type] • [weight]t"',
  examples: ['MassID #1034 • Organic • 3.25t', 'MassID #123 • Plastic • 2.5t'],
});

const massIDShortName = buildShortNameSchemas({
  prefix: 'MassID',
  title: 'MassID Short Name',
  description:
    'Compact name for UI summaries, tables, or tooltips. Format: "MassID #[token_id]"',
  examples: ['MassID #1034', 'MassID #123'],
});

const gasIDName = buildNameSchemas({
  prefix: 'GasID',
  regexSuffix: ' • .+ • .+t CO₂e',
  formatHint: '[methodology] • [co2e]t CO₂e',
  title: 'GasID Name',
  description:
    'Full display name for this GasID NFT. Format: "GasID #[token_id] • [methodology] • [co2e]t CO₂e"',
  examples: [
    'GasID #456 • BOLD Carbon (CH₄) • 0.86t CO₂e',
    'GasID #789 • BOLD Carbon (CH₄) • 1.2t CO₂e',
  ],
});

const gasIDShortName = buildShortNameSchemas({
  prefix: 'GasID',
  title: 'GasID Short Name',
  description:
    'Compact name for UI summaries, tables, or tooltips. Format: "GasID #[token_id]"',
  examples: ['GasID #456', 'GasID #789'],
});

const recycledIDName = buildNameSchemas({
  prefix: 'RecycledID',
  regexSuffix: ' • .+ • .+t Recycled',
  formatHint: '[methodology] • [weight]t Recycled',
  title: 'RecycledID Name',
  description:
    'Full display name for this RecycledID NFT. Format: "RecycledID #[token_id] • [methodology] • [weight]t Recycled"',
  examples: [
    'RecycledID #789 • BOLD Recycling • 3.25t Recycled',
    'RecycledID #456 • BOLD Recycling • 2.5t Recycled',
  ],
});

const recycledIDShortName = buildShortNameSchemas({
  prefix: 'RecycledID',
  title: 'RecycledID Short Name',
  description:
    'Compact name for UI summaries, tables, or tooltips. Format: "RecycledID #[token_id]"',
  examples: ['RecycledID #789', 'RecycledID #456'],
});

const creditPurchaseReceiptName = buildNameSchemas({
  prefix: 'Credit Purchase Receipt',
  regexSuffix: ' • .+ Credits Purchased',
  formatHint: '[amount] Credits Purchased',
  title: 'Credit Purchase Receipt Name',
  description:
    'Full display name for this Credit Purchase Receipt NFT. Format: "Credit Purchase Receipt #[token_id] • [amount] Credits Purchased"',
  examples: [
    'Credit Purchase Receipt #987 • 8.5 Credits Purchased',
    'Credit Purchase Receipt #1200 • 15.0 Credits Purchased',
  ],
});

const creditPurchaseReceiptShortName = buildShortNameSchemas({
  prefix: 'Purchase Receipt',
  title: 'Credit Purchase Receipt Short Name',
  description:
    'Compact name for UI summaries, tables, or tooltips. Format: "Purchase Receipt #[token_id]"',
  examples: ['Purchase Receipt #987', 'Purchase Receipt #1200'],
});

const creditRetirementReceiptName = buildNameSchemas({
  prefix: 'Credit Retirement Receipt',
  regexSuffix: ' • .+ Credits Retired',
  formatHint: '[amount] Credits Retired',
  title: 'Credit Retirement Receipt Name',
  description:
    'Full display name for this Credit Retirement Receipt NFT. Format: "Credit Retirement Receipt #[token_id] • [amount] Credits Retired"',
  examples: [
    'Credit Retirement Receipt #1245 • 10.5 Credits Retired',
    'Credit Retirement Receipt #1200 • 3.0 Credits Retired',
  ],
});

const creditRetirementReceiptShortName = buildShortNameSchemas({
  prefix: 'Retirement Receipt',
  title: 'Credit Retirement Receipt Short Name',
  description:
    'Compact name for UI summaries, tables, or tooltips. Format: "Retirement Receipt #[token_id]"',
  examples: ['Retirement Receipt #1245', 'Retirement Receipt #1200'],
});

export const MassIDNameSchema = massIDName.schema;
export const MassIDShortNameSchema = massIDShortName.schema;
export const createMassIDNameSchema = massIDName.createSchema;
export const createMassIDShortNameSchema = massIDShortName.createSchema;

export const GasIDNameSchema = gasIDName.schema;
export const GasIDShortNameSchema = gasIDShortName.schema;
export const createGasIDNameSchema = gasIDName.createSchema;
export const createGasIDShortNameSchema = gasIDShortName.createSchema;

export const RecycledIDNameSchema = recycledIDName.schema;
export const RecycledIDShortNameSchema = recycledIDShortName.schema;
export const createRecycledIDNameSchema = recycledIDName.createSchema;
export const createRecycledIDShortNameSchema = recycledIDShortName.createSchema;

export const CreditPurchaseReceiptNameSchema = creditPurchaseReceiptName.schema;
export const CreditPurchaseReceiptShortNameSchema =
  creditPurchaseReceiptShortName.schema;
export const createCreditPurchaseReceiptNameSchema =
  creditPurchaseReceiptName.createSchema;
export const createCreditPurchaseReceiptShortNameSchema =
  creditPurchaseReceiptShortName.createSchema;

export const CreditRetirementReceiptNameSchema =
  creditRetirementReceiptName.schema;
export const CreditRetirementReceiptShortNameSchema =
  creditRetirementReceiptShortName.schema;
export const createCreditRetirementReceiptNameSchema =
  creditRetirementReceiptName.createSchema;
export const createCreditRetirementReceiptShortNameSchema =
  creditRetirementReceiptShortName.createSchema;
