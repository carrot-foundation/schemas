import { z } from 'zod';

export const EthereumAddressSchema = z
  .string()
  .regex(
    /^0x[a-f0-9]{40}$/,
    'Must be a valid Ethereum address in lowercase hexadecimal format',
  )
  .meta({
    title: 'Ethereum Address',
    description: 'A valid Ethereum address in hexadecimal format',
    examples: ['0x1234567890abcdef1234567890abcdef12345678'],
  });
export type EthereumAddress = z.infer<typeof EthereumAddressSchema>;

export const BlockchainChainIdSchema = z
  .union([z.literal(137), z.literal(80002)])
  .meta({
    title: 'Chain ID',
    description: 'Supported Polygon chain identifiers',
    examples: [137, 80002],
  });
export type BlockchainChainId = z.infer<typeof BlockchainChainIdSchema>;

export const BlockchainNetworkNameSchema = z.enum(['Polygon', 'Amoy']).meta({
  title: 'Blockchain Network Name',
  description: 'Supported Polygon network names',
  examples: ['Polygon', 'Amoy'],
});
export type BlockchainNetworkName = z.infer<typeof BlockchainNetworkNameSchema>;

export const SmartContractAddressSchema = EthereumAddressSchema.meta({
  title: 'Smart Contract Address',
  description: 'Address of the smart contract',
});
export type SmartContractAddress = z.infer<typeof SmartContractAddressSchema>;

export const SmartContractSchema = z
  .strictObject({
    address: SmartContractAddressSchema,
    chain_id: BlockchainChainIdSchema,
    network_name: BlockchainNetworkNameSchema,
  })
  .meta({
    title: 'Smart Contract',
    description: 'Smart contract details for on-chain references',
  });
export type SmartContract = z.infer<typeof SmartContractSchema>;
