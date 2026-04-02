import { z } from 'zod';
import {
  BaseIpfsSchema,
  buildSchemaUrl,
  getSchemaVersionOrDefault,
} from '../shared';
import { SCHEMA_HASHES } from '../generated/schema-hashes';
import { MethodologyDataSchema } from './methodology.data.schema';

export const MethodologySchemaMeta = {
  title: 'Methodology IPFS Record',
  description:
    'Methodology metadata stored in IPFS, defining the environmental impact measurement approach including versioning, documentation, and MassID audit rules',
  $id: buildSchemaUrl('methodology/methodology.schema.json'),
  version: getSchemaVersionOrDefault(),
  hash: SCHEMA_HASHES['methodology'],
} as const;

export const MethodologySchema = BaseIpfsSchema.safeExtend({
  schema: BaseIpfsSchema.shape.schema.safeExtend({
    type: z.literal('Methodology').meta({
      title: 'Methodology Schema Type',
      description:
        'Discriminator value identifying this record as a Methodology impact-measurement definition',
    }),
  }),
  data: MethodologyDataSchema,
}).meta(MethodologySchemaMeta);

export type Methodology = z.infer<typeof MethodologySchema>;
