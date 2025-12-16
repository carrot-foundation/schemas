import { z } from 'zod';
import {
  ExternalIdSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
  SmartContractAddressSchema,
  TokenIdSchema,
} from '../primitives';

export const TokenReferenceBaseSchema = z
  .strictObject({
    external_id: ExternalIdSchema,
    external_url: ExternalUrlSchema,
    ipfs_uri: IpfsUriSchema,
    smart_contract_address: SmartContractAddressSchema,
  })
  .meta({
    title: 'Token Reference',
    description: 'Base schema for all token references',
  });
export type TokenReferenceBase = z.infer<typeof TokenReferenceBaseSchema>;

export const NftTokenReferenceBaseSchema = TokenReferenceBaseSchema.safeExtend({
  token_id: TokenIdSchema,
}).meta({
  title: 'NFT Token Reference',
  description: 'Base schema for NFT token references',
});
export type NftTokenReferenceBase = z.infer<typeof NftTokenReferenceBaseSchema>;
