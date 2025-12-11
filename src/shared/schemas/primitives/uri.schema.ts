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
