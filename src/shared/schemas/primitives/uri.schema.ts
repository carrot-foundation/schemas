import { z } from 'zod';

import { NonEmptyStringSchema } from './text.schema';

export const ExternalUrlSchema = z.url().meta({
  title: 'External URL',
  description: 'URL pointing to external resources',
  examples: ['https://explore.carrot.eco/', 'https://whitepaper.carrot.eco/'],
});
export type ExternalUrl = z.infer<typeof ExternalUrlSchema>;

const ipfsUriPattern =
  /^ipfs:\/\/(?:Qm[1-9A-HJ-NP-Za-km-z]{44}|[bB][a-z2-7]{58,}|[zZ][1-9A-HJ-NP-Za-km-z]{48,})(?:\/[^\s]*)?$/;

export const IpfsUriSchema = NonEmptyStringSchema.regex(
  ipfsUriPattern,
  'Must be a valid IPFS URI with CID',
).meta({
  title: 'IPFS URI',
  description: 'InterPlanetary File System URI pointing to distributed content',
  examples: [
    'ipfs://bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm/mass-id-organic.png',
    'ipfs://bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
  ],
});
export type IpfsUri = z.infer<typeof IpfsUriSchema>;

const ipfsCidPattern =
  /^(?:Qm[1-9A-HJ-NP-Za-km-z]{44}|[bB][a-z2-7]{58,}|[zZ][1-9A-HJ-NP-Za-km-z]{48,})$/;

export const IpfsCidSchema = NonEmptyStringSchema.regex(
  ipfsCidPattern,
  'Must be a valid IPFS CID',
).meta({
  title: 'IPFS CID',
  description:
    'InterPlanetary File System Content Identifier (CID) without protocol prefix',
  examples: [
    'bafybeigdyrztvzl5cceubvaxob7iqh6f3f7s36c74ojav2xsz2uib2g3vm',
    'bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
    'QmT78zSuBmuS4z925WZfrqQ1qHaJ5q3hRbAWkjj9piKktM',
  ],
});
export type IpfsCid = z.infer<typeof IpfsCidSchema>;

const ipnsNamePattern = /^k[1-9a-hj-np-z][a-z0-9]{45,}$/;

export const IpnsSchema = NonEmptyStringSchema.regex(
  ipnsNamePattern,
  'Must be a valid IPNS name starting with k',
).meta({
  title: 'IPNS Name',
  description:
    'IPNS name (libp2p key-based) starting with k, resolving to latest content',
  examples: ['k51qzi5uqu5dl6gn924e0csz0j3n0p0k3x0tgpn8afvhk8m9qvvid0f3q3us8p'],
});
export type Ipns = z.infer<typeof IpnsSchema>;

const ensDomainPattern =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*\.eth$/i;

export const EnsDomainSchema = NonEmptyStringSchema.regex(
  ensDomainPattern,
  'Must be a valid ENS domain ending with .eth',
).meta({
  title: 'ENS Domain',
  description: 'Ethereum Name Service domain that resolves to content',
  examples: ['viewer.carrot.eth'],
});
export type EnsDomain = z.infer<typeof EnsDomainSchema>;
