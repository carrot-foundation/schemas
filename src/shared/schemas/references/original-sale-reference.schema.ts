import { z } from 'zod';
import {
  IsoDateTimeSchema,
  PositiveIntegerSchema,
  SmartContractAddressSchema,
  TokenIdSchema,
  UuidSchema,
} from '../primitives';

const OriginalNftSchema = z
  .strictObject({
    chain_id: PositiveIntegerSchema.meta({
      title: 'Chain ID',
      description:
        'Identifier of the blockchain network on which the original asset was minted',
      examples: [137, 80002],
    }),
    smart_contract_address: SmartContractAddressSchema.meta({
      title: 'Smart Contract Address',
      description:
        'Address of the smart contract that minted and manages the original tokenized asset',
    }),
    token_id: TokenIdSchema.meta({
      title: 'Token ID',
      description:
        'Identifier of the original tokenized asset within its smart contract',
    }),
  })
  .meta({
    title: 'Original NFT',
    description:
      'On-chain reference to the tokenized asset associated with the original sale',
  });

export const OriginalSaleReferenceSchema = z
  .strictObject({
    order_id: UuidSchema.meta({
      title: 'Order ID',
      description: 'Identifier of the originating sale order',
    }),
    sold_at: IsoDateTimeSchema.meta({
      title: 'Sold At',
      description: 'Timestamp at which the original sale was completed',
    }),
    original_nft: OriginalNftSchema,
  })
  .meta({
    title: 'Original Sale Reference',
    description:
      'Reference to the sale that originated this record, linking it to the originating sale order and its tokenized asset',
  });
export type OriginalSaleReference = z.infer<typeof OriginalSaleReferenceSchema>;
