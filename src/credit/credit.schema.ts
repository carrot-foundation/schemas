import { z } from 'zod';
import {
  BaseIpfsSchema,
  IpfsUriSchema,
  CreditTokenSymbolSchema,
  buildSchemaUrl,
  getSchemaVersionOrDefault,
  CreditTokenNameSchema,
  CreditTokenSlugSchema,
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
  symbol: CreditTokenSymbolSchema,
  slug: CreditTokenSlugSchema,
  name: CreditTokenNameSchema,
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
    examples: [
      'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
    ],
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
        'Carrot Carbon (C-CARB.CH4) represents verified carbon emissions reductions from organic waste composting projects. Each token equals one metric ton of CO2 equivalent prevented from entering the atmosphere through sustainable waste management practices.',
      ],
    }),
}).meta(CreditSchemaMeta);

export type Credit = z.infer<typeof CreditSchema>;
