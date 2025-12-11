import { z } from 'zod';
import {
  ExternalIdSchema,
  TokenIdSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
} from '../primitives';

export const GasIDReferenceSchema = z
  .strictObject({
    external_id: ExternalIdSchema.meta({
      title: 'GasID External ID',
      description: 'Unique identifier for the GasID',
    }),
    token_id: TokenIdSchema.meta({
      title: 'GasID Token ID',
      description: 'NFT token ID of the GasID',
    }),
    external_url: ExternalUrlSchema.meta({
      title: 'GasID External URL',
      description: 'URL to view the GasID on Carrot Explorer',
    }),
    uri: IpfsUriSchema.meta({
      title: 'GasID IPFS URI',
      description: 'IPFS URI of the GasID record',
    }),
  })
  .meta({
    title: 'GasID Reference',
    description: 'Reference to a GasID record',
  });

export type GasIDReference = z.infer<typeof GasIDReferenceSchema>;
