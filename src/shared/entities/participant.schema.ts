import { z } from 'zod';
import { uuid, participantName, participantRole } from '../definitions.schema';

export const participantSchema = z
  .object({
    id: uuid.describe('Unique identifier for the participant'),
    name: participantName.describe('Name of the participant'),
    roles: z
      .array(participantRole)
      .min(1)
      .refine((roles) => new Set(roles).size === roles.length, {
        message: 'Participant roles must be unique',
      })
      .describe(
        'Roles of the participant in the waste management supply chain',
      ),
  })
  .strict()
  .describe('A participant in the waste management supply chain');

export type ParticipantSchema = z.infer<typeof participantSchema>;
