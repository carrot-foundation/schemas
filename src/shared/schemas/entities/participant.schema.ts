import { z } from 'zod';
import {
  Sha256HashSchema,
  ParticipantNameSchema,
  ParticipantRoleSchema,
} from '../definitions.schema';
import { uniqueArrayItems } from '../core/helpers.schema';

export const ParticipantSchema = z
  .strictObject({
    id_hash: Sha256HashSchema.meta({
      title: 'Participant ID Hash',
      description: 'Anonymized identifier for the participant',
    }),
    name: ParticipantNameSchema.meta({
      title: 'Participant Name',
      description: 'Name of the participant',
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
