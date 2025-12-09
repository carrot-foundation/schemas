import recycledIdExample from '../../../schemas/ipfs/recycled-id/recycled-id.example.json';
import { RecycledIDIpfs } from '../../recycled-id';

export const recycledIdIpfsFixture = recycledIdExample as RecycledIDIpfs;

export function createRecycledIdIpfsFixture(
  overrides?: Partial<RecycledIDIpfs>,
): RecycledIDIpfs {
  const base = recycledIdIpfsFixture;

  const schema: RecycledIDIpfs['schema'] = overrides?.schema
    ? { ...base.schema, ...overrides.schema }
    : base.schema;

  const environment: RecycledIDIpfs['environment'] = overrides?.environment
    ? { ...base.environment, ...overrides.environment }
    : base.environment;

  const blockchain: RecycledIDIpfs['blockchain'] = overrides?.blockchain
    ? { ...base.blockchain, ...overrides.blockchain }
    : base.blockchain;

  const creator: RecycledIDIpfs['creator'] = overrides?.creator
    ? { ...base.creator, ...overrides.creator }
    : base.creator;

  const data: RecycledIDIpfs['data'] = overrides?.data
    ? { ...base.data, ...overrides.data }
    : base.data;

  return {
    ...base,
    ...overrides,
    schema,
    environment,
    blockchain,
    creator,
    external_links: overrides?.external_links ?? base.external_links,
    attributes: overrides?.attributes ?? base.attributes,
    data,
  };
}
