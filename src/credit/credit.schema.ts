import { z } from 'zod';
import {
  BaseIpfsSchema,
  IpfsUriSchema,
  NonEmptyStringSchema,
  SlugSchema,
  TokenSymbolSchema,
  buildSchemaUrl,
  getSchemaVersionOrDefault,
} from '../shared';

export const CreditSchemaMeta = {
  title: 'Credit IPFS Record',
  description:
    'Credit token metadata stored in IPFS, extending the base schema with ERC20-specific details',
  $id: buildSchemaUrl('credit/credit.schema.json'),
  version: getSchemaVersionOrDefault(),
} as const;

export const CreditSchema = BaseIpfsSchema.safeExtend({
  schema: BaseIpfsSchema.shape.schema.safeExtend({
    type: z.literal('Credit').meta({
      title: 'Credit Schema Type',
      description: 'Credit schema type',
    }),
  }),
  symbol: TokenSymbolSchema,
  slug: SlugSchema.meta({
    title: 'Token Slug',
    description: 'URL-friendly identifier for the token',
    examples: ['carbon'],
  }).optional(),
  name: NonEmptyStringSchema.meta({
    title: 'Token Name',
    description: 'Full human-readable name of the ERC20 token',
    examples: ['Carrot Carbon'],
  }),
  decimals: z
    .number()
    .int()
    .min(0)
    .max(18)
    .meta({
      title: 'Token Decimals',
      description: 'Number of decimal places for the ERC20 token',
      examples: [18],
    }),
  image: IpfsUriSchema.meta({
    title: 'Token Image',
    description: "IPFS URI pointing to the token's visual representation image",
    examples: ['ipfs://QmTokenImageHash/credit-icon.png'],
  }),
  description: z
    .string()
    .min(50)
    .max(1000)
    .meta({
      title: 'Token Description',
      description:
        'Comprehensive description of the credit token, its purpose, and impact',
      examples: [
        'Carrot Carbon (C-CARB) represents verified carbon emissions reductions from organic waste composting projects. Each token equals one metric ton of CO2 equivalent prevented from entering the atmosphere through sustainable waste management practices.',
      ],
    }),
}).meta(CreditSchemaMeta);

export type Credit = z.infer<typeof CreditSchema>;
