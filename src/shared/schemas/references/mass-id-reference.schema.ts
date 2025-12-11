import { z } from 'zod';
import {
  ExternalIdSchema,
  TokenIdSchema,
  ExternalUrlSchema,
  IpfsUriSchema,
} from '../definitions.schema';

export const MassIDReferenceSchema = z
  .strictObject({
    external_id: ExternalIdSchema.meta({
      title: 'MassID External ID',
      description: 'Unique identifier for the MassID',
    }),
    token_id: TokenIdSchema.meta({
      title: 'MassID Token ID',
      description: 'NFT token ID of the MassID',
    }),
    external_url: ExternalUrlSchema.meta({
      title: 'MassID External URL',
      description: 'URL to view the MassID on Carrot Explorer',
    }),
    uri: IpfsUriSchema.meta({
      title: 'MassID IPFS URI',
      description: 'IPFS URI of the MassID record',
    }),
  })
  .meta({
    title: 'MassID Reference',
    description: 'Reference to a MassID record',
  });

export type MassIDReference = z.infer<typeof MassIDReferenceSchema>;
