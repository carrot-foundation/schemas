import { z } from 'zod';
import {
  BaseIpfsSchema,
  IpfsUriSchema,
  PositiveIntegerSchema,
  SmartContractAddressSchema,
  BLOCKCHAIN_NETWORK_CONFIG,
  CreditTokenSymbolSchema,
  CreditTokenNameSchema,
  buildSchemaUrl,
  getSchemaVersionOrDefault,
  CreditTokenSlugSchema,
  CREDIT_TOKEN_PAIRS,
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
      description:
        'Discriminator value identifying this record as a Credit environmental-impact token',
    }),
  }),
  data: z.record(z.string(), z.unknown()).optional().meta({
    title: 'Custom Data',
    description: 'Credit-specific data payload',
  }),
  symbol: CreditTokenSymbolSchema,
  slug: CreditTokenSlugSchema,
  name: CreditTokenNameSchema,
  blockchain: z
    .strictObject({
      chain_id: PositiveIntegerSchema,
      smart_contract_address: SmartContractAddressSchema,
    })
    .meta({
      title: 'Credit Contract Identity',
      description:
        'Network and ERC-20 contract whose tokenURI() resolves this document. ERC-20 has no token_id.',
    }),
  interop: z
    .strictObject({
      erc1046: z.literal(true).meta({
        title: 'ERC-1046 Interoperability',
        description:
          'Declares this metadata document compatible with ERC-1046.',
      }),
    })
    .meta({
      title: 'Interoperability',
      description:
        'Mandatory ERC-1046 marker for both PROD and TEST credit documents.',
    }),
  decimals: z
    .number()
    .int()
    .min(0)
    .max(18)
    .meta({
      title: 'Token Decimals',
      description: 'Number of decimal places for the ERC20 token',
      examples: [6],
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
        'Human-readable purpose and impact pathway of this ERC-20 credit token; quantitative claims require their own evidence',
      examples: [
        'Illustrative carbon credit metadata for a fictional ERC-20 contract. Its name, symbol, decimals, and network must match the deployed contract before any real document is generated.',
      ],
    }),
})
  .superRefine((record, ctx) => {
    const expectedSymbol = CREDIT_TOKEN_PAIRS[record.slug];
    if (record.symbol !== expectedSymbol) {
      ctx.addIssue({
        code: 'custom',
        path: ['symbol'],
        message: 'symbol must match the approved slug/symbol pair',
      });
    }
    if (
      record.environment &&
      record.blockchain.chain_id !==
        BLOCKCHAIN_NETWORK_CONFIG[record.environment.blockchain_network]
          .chain_id
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['blockchain', 'chain_id'],
        message:
          'blockchain.chain_id must match environment.blockchain_network',
      });
    }
  })
  .meta(CreditSchemaMeta);

export type Credit = z.infer<typeof CreditSchema>;
