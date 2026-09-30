import { z } from 'zod';
import {
  PositiveIntegerSchema,
  SmartContractAddressSchema,
} from '../primitives';
import { TokenReferenceBaseSchema } from './token-reference-base.schema';

const CreditChainIdSchema = PositiveIntegerSchema.meta({
  title: 'Credit Chain ID',
  description:
    'Positive chain identifier of the ERC-20 contract; use the network verified for this exact contract deployment',
  examples: [137, 80002],
});

const CarbonSlugSchema = z.literal('carbon-ch4').meta({
  title: 'Carbon Credit Slug',
  description: 'Stable slug paired with C-CARB.CH4',
});
const CarbonSymbolSchema = z.literal('C-CARB.CH4').meta({
  title: 'Carbon Credit Symbol',
  description: 'ERC-20 symbol paired with carbon-ch4',
});
const BiowasteSlugSchema = z.literal('biowaste').meta({
  title: 'Biowaste Credit Slug',
  description: 'Stable slug paired with C-BIOW',
});
const BiowasteSymbolSchema = z.literal('C-BIOW').meta({
  title: 'Biowaste Credit Symbol',
  description: 'ERC-20 symbol paired with biowaste',
});

const CarbonCreditIdentifierSchema = z
  .strictObject({
    slug: CarbonSlugSchema,
    symbol: CarbonSymbolSchema,
    chain_id: CreditChainIdSchema,
    smart_contract_address: SmartContractAddressSchema,
  })
  .meta({
    title: 'Carbon Credit Identity',
    description: 'Contract identity of a carbon credit on its actual network',
  });

const BiowasteCreditIdentifierSchema = z
  .strictObject({
    slug: BiowasteSlugSchema,
    symbol: BiowasteSymbolSchema,
    chain_id: CreditChainIdSchema,
    smart_contract_address: SmartContractAddressSchema,
  })
  .meta({
    title: 'Biowaste Credit Identity',
    description: 'Contract identity of a biowaste credit on its actual network',
  });

export const CreditIdentifierSchema = z
  .discriminatedUnion('slug', [
    CarbonCreditIdentifierSchema,
    BiowasteCreditIdentifierSchema,
  ])
  .meta({
    title: 'Credit Token Identity',
    description:
      'Stable ERC-20 identity on a specific chain. Slug and symbol must be the approved pair.',
  });
export type CreditIdentifier = z.infer<typeof CreditIdentifierSchema>;

export const CreditReferenceSchema = z
  .discriminatedUnion('slug', [
    TokenReferenceBaseSchema.safeExtend({
      slug: CarbonSlugSchema,
      symbol: CarbonSymbolSchema,
    }),
    TokenReferenceBaseSchema.safeExtend({
      slug: BiowasteSlugSchema,
      symbol: BiowasteSymbolSchema,
    }),
  ])
  .meta({
    title: 'Credit Reference',
    description:
      'ERC-20 credit identity and cited metadata snapshot. Resolve current metadata through tokenURI() on the contract and chain_id.',
  });
export type CreditReference = z.infer<typeof CreditReferenceSchema>;
