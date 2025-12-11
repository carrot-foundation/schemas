import { z } from 'zod';
import {
  NonEmptyStringSchema,
  ParticipantRoleSchema,
  Sha256HashSchema,
} from '../primitives';
import { uniqueArrayItems } from '../../schema-helpers';

export const ParticipantSchema = z
  .strictObject({
    id_hash: Sha256HashSchema.meta({
      title: 'Participant ID Hash',
      description: 'Anonymized identifier for the participant',
    }),
    name: NonEmptyStringSchema.max(100).meta({
      title: 'Participant Name',
      description: 'Name of a participant in the waste management system',
      examples: ['Enlatados Produção', 'Eco Reciclagem', 'Green Tech Corp'],
    }),
    roles: uniqueArrayItems(
      ParticipantRoleSchema,
      'Participant roles must be unique',
    )
      .min(1)
      .meta({
        title: 'Participant Roles',
        description:
          'Roles of the participant in the waste management supply chain',
      }),
  })
  .meta({
    title: 'Participant',
    description: 'A participant in the waste management supply chain',
  });
export type Participant = z.infer<typeof ParticipantSchema>;
