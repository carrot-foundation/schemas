import { z } from 'zod';
import {
  UuidSchema,
  ParticipantNameSchema,
  ParticipantRoleSchema,
} from '../definitions.schema.js';
import { uniqueArrayItems } from '../helpers.schema.js';

export const ParticipantSchema = z
  .strictObject({
    id: UuidSchema.meta({
      title: 'Participant ID',
      description: 'Unique identifier for the participant',
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
