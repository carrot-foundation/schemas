import { z } from 'zod';

import { NonEmptyStringSchema } from './text.schema';

export const ExternalUrlSchema = z.url().meta({
  title: 'External URL',
  description: 'URL pointing to external resources',
  examples: [
    'https://explore.carrot.eco/',
    'https://https://whitepaper.carrot.eco/',
  ],
});
export type ExternalUrl = z.infer<typeof ExternalUrlSchema>;

export const IpfsUriSchema = NonEmptyStringSchema.regex(
  /^ipfs:\/\/[a-zA-Z0-9]+(\/.*)?$/,
  'Must be a valid IPFS URI with CID',
).meta({
  title: 'IPFS URI',
  description: 'InterPlanetary File System URI pointing to distributed content',
  examples: [
    'ipfs://QmTy8w65yBXgyfG2ZBg5TrfB2hPjrDQH3RCQFJGkARStJb/mass-id-organic.png',
    'ipfs://QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o',
  ],
});
export type IpfsUri = z.infer<typeof IpfsUriSchema>;
