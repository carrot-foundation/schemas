import { z } from 'zod';
import {
  BaseIpfsSchema,
  buildSchemaUrl,
  getSchemaVersionOrDefault,
} from '../shared';
import { MassIDAuditDataSchema } from './mass-id-audit.data.schema';

export const MassIDAuditSchemaMeta = {
  title: 'MassID Audit IPFS Record',
  description:
    'MassID audit metadata stored in IPFS, extending the base schema with audit results and references',
  $id: buildSchemaUrl('mass-id-audit/mass-id-audit.schema.json'),
  version: getSchemaVersionOrDefault(),
} as const;

export const MassIDAuditSchema = BaseIpfsSchema.safeExtend({
  schema: BaseIpfsSchema.shape.schema.safeExtend({
    type: z.literal('MassID Audit').meta({
      title: 'MassID Audit Schema Type',
      description: 'MassID Audit schema type',
    }),
  }),
  data: MassIDAuditDataSchema,
}).meta(MassIDAuditSchemaMeta);

export type MassIDAudit = z.infer<typeof MassIDAuditSchema>;
