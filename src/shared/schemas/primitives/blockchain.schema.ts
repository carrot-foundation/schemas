import { z } from 'zod';

export const BLOCKCHAIN_NETWORK_CONFIG = {
  mainnet: { chain_id: 137 as const, network_name: 'Polygon' as const },
  testnet: { chain_id: 80002 as const, network_name: 'Amoy' as const },
} as const;

export const ALLOWED_BLOCKCHAIN_NETWORKS = Object.values(
  BLOCKCHAIN_NETWORK_CONFIG,
);

const BLOCKCHAIN_CHAIN_IDS = [
  BLOCKCHAIN_NETWORK_CONFIG.mainnet.chain_id,
  BLOCKCHAIN_NETWORK_CONFIG.testnet.chain_id,
] as const;

const BLOCKCHAIN_NETWORK_NAMES = [
  BLOCKCHAIN_NETWORK_CONFIG.mainnet.network_name,
  BLOCKCHAIN_NETWORK_CONFIG.testnet.network_name,
] as const;

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
  .union([
    z.literal(BLOCKCHAIN_NETWORK_CONFIG.mainnet.chain_id),
    z.literal(BLOCKCHAIN_NETWORK_CONFIG.testnet.chain_id),
  ])
  .meta({
    title: 'Chain ID',
    description: 'Supported Polygon chain identifiers',
    examples: BLOCKCHAIN_CHAIN_IDS,
  });
export type BlockchainChainId = z.infer<typeof BlockchainChainIdSchema>;

export const BlockchainNetworkNameSchema = z
  .enum(BLOCKCHAIN_NETWORK_NAMES)
  .meta({
    title: 'Blockchain Network Name',
    description: 'Supported Polygon network names',
    examples: BLOCKCHAIN_NETWORK_NAMES,
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
