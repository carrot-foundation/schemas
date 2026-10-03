import { z } from 'zod';
import {
  ExternalIdSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
  PositiveIntegerSchema,
  SmartContractAddressSchema,
  TokenIdSchema,
} from '../primitives';

export const TokenReferenceBaseSchema = z
  .strictObject({
    external_id: ExternalIdSchema,
    external_url: ExternalUrlSchema,
    ipfs_uri: IpfsUriSchema,
    chain_id: PositiveIntegerSchema.meta({
      title: 'Chain ID',
      description:
        'Positive identifier of the network that deployed this token; resolve the current metadata on this chain, while ipfs_uri retains the referenced snapshot',
      examples: [137, 80002],
    }),
    smart_contract_address: SmartContractAddressSchema,
  })
  .meta({
    title: 'Token Reference',
    description:
      'Token identity and referenced metadata snapshot. ipfs_uri records the cited version; current metadata is resolved from the contract on chain_id.',
  });
export type TokenReferenceBase = z.infer<typeof TokenReferenceBaseSchema>;

export const NftTokenReferenceBaseSchema = TokenReferenceBaseSchema.safeExtend({
  token_id: TokenIdSchema,
}).meta({
  title: 'NFT Token Reference',
  description: 'Base schema for NFT token references',
});
export type NftTokenReferenceBase = z.infer<typeof NftTokenReferenceBaseSchema>;
