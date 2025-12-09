import { z } from 'zod';
import {
  BaseIpfsSchema,
  buildSchemaUrl,
  getSchemaVersionOrDefault,
} from '../shared';
import { MethodologyDataSchema } from './methodology.data.schema';

export const MethodologySchemaMeta = {
  title: 'Methodology IPFS Record',
  description:
    'Methodology metadata stored in IPFS, extending the base schema with methodology data and audit rules',
  $id: buildSchemaUrl('methodology/methodology.schema.json'),
  version: getSchemaVersionOrDefault(),
} as const;

export const MethodologySchema = BaseIpfsSchema.safeExtend({
  schema: BaseIpfsSchema.shape.schema.safeExtend({
    type: z.literal('Methodology').meta({
      title: 'Methodology Schema Type',
      description: 'Methodology schema type',
    }),
  }),
  data: MethodologyDataSchema,
}).meta(MethodologySchemaMeta);

export type Methodology = z.infer<typeof MethodologySchema>;
