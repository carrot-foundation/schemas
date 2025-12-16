import { NonEmptyStringSchema } from '../primitives';

export const MassIDNameSchema = NonEmptyStringSchema.max(100)
  .regex(
    /^MassID #\d+ • .+ • .+t$/,
    'Name must match format: "MassID #[token_id] • [waste_type] • [weight]t"',
  )
  .meta({
    title: 'MassID Name',
    description:
      'Full display name for this MassID NFT. Format: "MassID #[token_id] • [waste_type] • [weight]t"',
    examples: [
      'MassID #1034 • Organic • 3.25t',
      'MassID #123 • Plastic • 2.5t',
    ],
  });

export const MassIDShortNameSchema = NonEmptyStringSchema.max(50)
  .regex(/^MassID #\d+$/, 'Short name must match format: "MassID #[token_id]"')
  .meta({
    title: 'MassID Short Name',
    description:
      'Compact name for UI summaries, tables, or tooltips. Format: "MassID #[token_id]"',
    examples: ['MassID #1034', 'MassID #123'],
  });

export const GasIDNameSchema = NonEmptyStringSchema.max(100)
  .regex(
    /^GasID #\d+ • .+ • .+t CO₂e$/,
    'Name must match format: "GasID #[token_id] • [methodology] • [co2e]t CO₂e"',
  )
  .meta({
    title: 'GasID Name',
    description:
      'Full display name for this GasID NFT. Format: "GasID #[token_id] • [methodology] • [co2e]t CO₂e"',
    examples: [
      'GasID #456 • BOLD Carbon (CH₄) • 0.86t CO₂e',
      'GasID #789 • BOLD Carbon (CH₄) • 1.2t CO₂e',
    ],
  });

export const GasIDShortNameSchema = NonEmptyStringSchema.max(50)
  .regex(/^GasID #\d+$/, 'Short name must match format: "GasID #[token_id]"')
  .meta({
    title: 'GasID Short Name',
    description:
      'Compact name for UI summaries, tables, or tooltips. Format: "GasID #[token_id]"',
    examples: ['GasID #456', 'GasID #789'],
  });

export const RecycledIDNameSchema = NonEmptyStringSchema.max(100)
  .regex(
    /^RecycledID #\d+ • .+ • .+t Recycled$/,
    'Name must match format: "RecycledID #[token_id] • [methodology] • [weight]t Recycled"',
  )
  .meta({
    title: 'RecycledID Name',
    description:
      'Full display name for this RecycledID NFT. Format: "RecycledID #[token_id] • [methodology] • [weight]t Recycled"',
    examples: [
      'RecycledID #789 • BOLD Recycling • 3.25t Recycled',
      'RecycledID #456 • BOLD Recycling • 2.5t Recycled',
    ],
  });

export const RecycledIDShortNameSchema = NonEmptyStringSchema.max(50)
  .regex(
    /^RecycledID #\d+$/,
    'Short name must match format: "RecycledID #[token_id]"',
  )
  .meta({
    title: 'RecycledID Short Name',
    description:
      'Compact name for UI summaries, tables, or tooltips. Format: "RecycledID #[token_id]"',
    examples: ['RecycledID #789', 'RecycledID #456'],
  });

export const CreditPurchaseReceiptNameSchema = NonEmptyStringSchema.max(100)
  .regex(
    /^Credit Purchase Receipt #\d+ • .+ Credits Purchased$/,
    'Name must match format: "Credit Purchase Receipt #[token_id] • [amount] Credits Purchased"',
  )
  .meta({
    title: 'Credit Purchase Receipt Name',
    description:
      'Full display name for this Credit Purchase Receipt NFT. Format: "Credit Purchase Receipt #[token_id] • [amount] Credits Purchased"',
    examples: [
      'Credit Purchase Receipt #987 • 8.5 Credits Purchased',
      'Credit Purchase Receipt #1200 • 15.0 Credits Purchased',
    ],
  });

export const CreditPurchaseReceiptShortNameSchema = NonEmptyStringSchema.max(50)
  .regex(
    /^Purchase Receipt #\d+$/,
    'Short name must match format: "Purchase Receipt #[token_id]"',
  )
  .meta({
    title: 'Credit Purchase Receipt Short Name',
    description:
      'Compact name for UI summaries, tables, or tooltips. Format: "Purchase Receipt #[token_id]"',
    examples: ['Purchase Receipt #987', 'Purchase Receipt #1200'],
  });

export const CreditRetirementReceiptNameSchema = NonEmptyStringSchema.max(100)
  .regex(
    /^Credit Retirement Receipt #\d+ • .+ Credits Retired$/,
    'Name must match format: "Credit Retirement Receipt #[token_id] • [amount] Credits Retired"',
  )
  .meta({
    title: 'Credit Retirement Receipt Name',
    description:
      'Full display name for this Credit Retirement Receipt NFT. Format: "Credit Retirement Receipt #[token_id] • [amount] Credits Retired"',
    examples: [
      'Credit Retirement Receipt #1245 • 10.5 Credits Retired',
      'Credit Retirement Receipt #1200 • 3.0 Credits Retired',
    ],
  });

export const CreditRetirementReceiptShortNameSchema = NonEmptyStringSchema.max(
  50,
)
  .regex(
    /^Retirement Receipt #\d+$/,
    'Short name must match format: "Retirement Receipt #[token_id]"',
  )
  .meta({
    title: 'Credit Retirement Receipt Short Name',
    description:
      'Compact name for UI summaries, tables, or tooltips. Format: "Retirement Receipt #[token_id]"',
    examples: ['Retirement Receipt #1245', 'Retirement Receipt #1200'],
  });

export const createMassIDNameSchema = (tokenId: string) => {
  const escapedTokenId = tokenId.replace('#', String.raw`\#`);
  return NonEmptyStringSchema.max(100)
    .regex(
      new RegExp(String.raw`^MassID #${escapedTokenId} • .+ • .+t$`),
      `Name must match format: "MassID #${tokenId} • [waste_type] • [weight]t"`,
    )
    .meta({
      title: 'MassID Name',
      description:
        'Full display name for this MassID NFT. Format: "MassID #[token_id] • [waste_type] • [weight]t"',
      examples: [
        'MassID #1034 • Organic • 3.25t',
        'MassID #123 • Plastic • 2.5t',
      ],
    });
};

export const createGasIDNameSchema = (tokenId: string) => {
  const escapedTokenId = tokenId.replace('#', String.raw`\#`);
  return NonEmptyStringSchema.max(100)
    .regex(
      new RegExp(String.raw`^GasID #${escapedTokenId} • .+ • .+t CO₂e$`),
      `Name must match format: "GasID #${tokenId} • [methodology] • [co2e]t CO₂e"`,
    )
    .meta({
      title: 'GasID Name',
      description:
        'Full display name for this GasID NFT. Format: "GasID #[token_id] • [methodology] • [co2e]t CO₂e"',
      examples: [
        'GasID #456 • BOLD Carbon (CH₄) • 0.86t CO₂e',
        'GasID #789 • BOLD Carbon (CH₄) • 1.2t CO₂e',
      ],
    });
};

export const createRecycledIDNameSchema = (tokenId: string) => {
  const escapedTokenId = tokenId.replace('#', String.raw`\#`);
  return NonEmptyStringSchema.max(100)
    .regex(
      new RegExp(
        String.raw`^RecycledID #${escapedTokenId} • .+ • .+t Recycled$`,
      ),
      `Name must match format: "RecycledID #${tokenId} • [methodology] • [weight]t Recycled"`,
    )
    .meta({
      title: 'RecycledID Name',
      description:
        'Full display name for this RecycledID NFT. Format: "RecycledID #[token_id] • [methodology] • [weight]t Recycled"',
      examples: [
        'RecycledID #789 • BOLD Recycling • 3.25t Recycled',
        'RecycledID #456 • BOLD Recycling • 2.5t Recycled',
      ],
    });
};

export const createCreditPurchaseReceiptNameSchema = (tokenId: string) => {
  const escapedTokenId = tokenId.replace('#', String.raw`\#`);
  return NonEmptyStringSchema.max(100)
    .regex(
      new RegExp(
        String.raw`^Credit Purchase Receipt #${escapedTokenId} • .+ Credits Purchased$`,
      ),
      `Name must match format: "Credit Purchase Receipt #${tokenId} • [amount] Credits Purchased"`,
    )
    .meta({
      title: 'Credit Purchase Receipt Name',
      description:
        'Full display name for this Credit Purchase Receipt NFT. Format: "Credit Purchase Receipt #[token_id] • [amount] Credits Purchased"',
      examples: [
        'Credit Purchase Receipt #987 • 8.5 Credits Purchased',
        'Credit Purchase Receipt #1200 • 15.0 Credits Purchased',
      ],
    });
};

export const createCreditRetirementReceiptNameSchema = (tokenId: string) => {
  const escapedTokenId = tokenId.replace('#', String.raw`\#`);
  return NonEmptyStringSchema.max(100)
    .regex(
      new RegExp(
        String.raw`^Credit Retirement Receipt #${escapedTokenId} • .+ Credits Retired$`,
      ),
      `Name must match format: "Credit Retirement Receipt #${tokenId} • [amount] Credits Retired"`,
    )
    .meta({
      title: 'Credit Retirement Receipt Name',
      description:
        'Full display name for this Credit Retirement Receipt NFT. Format: "Credit Retirement Receipt #[token_id] • [amount] Credits Retired"',
      examples: [
        'Credit Retirement Receipt #1245 • 10.5 Credits Retired',
        'Credit Retirement Receipt #1200 • 3.0 Credits Retired',
      ],
    });
};

export const createMassIDShortNameSchema = (tokenId: string) =>
  NonEmptyStringSchema.max(50)
    .refine(
      (val) => val === `MassID #${tokenId}`,
      `Short name must be exactly "MassID #${tokenId}"`,
    )
    .meta({
      title: 'MassID Short Name',
      description:
        'Compact name for UI summaries, tables, or tooltips. Format: "MassID #[token_id]"',
      examples: ['MassID #1034', 'MassID #123'],
    });

export const createGasIDShortNameSchema = (tokenId: string) =>
  NonEmptyStringSchema.max(50)
    .refine(
      (val) => val === `GasID #${tokenId}`,
      `Short name must be exactly "GasID #${tokenId}"`,
    )
    .meta({
      title: 'GasID Short Name',
      description:
        'Compact name for UI summaries, tables, or tooltips. Format: "GasID #[token_id]"',
      examples: ['GasID #456', 'GasID #789'],
    });

export const createRecycledIDShortNameSchema = (tokenId: string) =>
  NonEmptyStringSchema.max(50)
    .refine(
      (val) => val === `RecycledID #${tokenId}`,
      `Short name must be exactly "RecycledID #${tokenId}"`,
    )
    .meta({
      title: 'RecycledID Short Name',
      description:
        'Compact name for UI summaries, tables, or tooltips. Format: "RecycledID #[token_id]"',
      examples: ['RecycledID #789', 'RecycledID #456'],
    });

export const createCreditPurchaseReceiptShortNameSchema = (tokenId: string) =>
  NonEmptyStringSchema.max(50)
    .refine(
      (val) => val === `Purchase Receipt #${tokenId}`,
      `Short name must be exactly "Purchase Receipt #${tokenId}"`,
    )
    .meta({
      title: 'Credit Purchase Receipt Short Name',
      description:
        'Compact name for UI summaries, tables, or tooltips. Format: "Purchase Receipt #[token_id]"',
      examples: ['Purchase Receipt #987', 'Purchase Receipt #1200'],
    });

export const createCreditRetirementReceiptShortNameSchema = (tokenId: string) =>
  NonEmptyStringSchema.max(50)
    .refine(
      (val) => val === `Retirement Receipt #${tokenId}`,
      `Short name must be exactly "Retirement Receipt #${tokenId}"`,
    )
    .meta({
      title: 'Credit Retirement Receipt Short Name',
      description:
        'Compact name for UI summaries, tables, or tooltips. Format: "Retirement Receipt #[token_id]"',
      examples: ['Retirement Receipt #1245', 'Retirement Receipt #1200'],
    });
