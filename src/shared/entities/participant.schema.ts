import { z } from 'zod';
import {
  uuid,
  participantName,
  participantRole,
} from '../definitions.schema.js';

export const participantSchema = z
  .strictObject({
    id: uuid.describe('Unique identifier for the participant').meta({
      title: 'Participant ID',
      examples: [
        '6f520d88-864d-432d-bf9f-5c3166c4818f',
        '5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
      ],
    }),
    name: participantName.describe('Name of the participant').meta({
      title: 'Participant Name',
      examples: ['Enlatados Produção', 'Eco Reciclagem', 'Green Recycling Co'],
    }),
    roles: z
      .array(participantRole)
      .min(1)
      .refine((roles) => new Set(roles).size === roles.length, {
        message: 'Participant roles must be unique',
      })
      .describe('Roles of the participant in the waste management supply chain')
      .meta({
        title: 'Participant Roles',
        examples: [['Waste Generator'], ['Hauler', 'Recycler']],
      }),
  })
  .describe('A participant in the waste management supply chain')
  .meta({
    title: 'Participant',
    examples: [
      {
        id: '6f520d88-864d-432d-bf9f-5c3166c4818f',
        name: 'Enlatados Produção',
        roles: ['Waste Generator'],
      },
      {
        id: '5021ea45-5b35-4749-8a85-83dc0c6f7cbf',
        name: 'Eco Reciclagem',
        roles: ['Hauler', 'Recycler'],
      },
    ],
  });

export type ParticipantSchema = z.infer<typeof participantSchema>;
