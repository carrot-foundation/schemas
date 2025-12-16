import { z } from 'zod';

export const Sha256HashSchema = z
  .hash('sha256', {
    error: 'Must be a SHA256 hash as 32-byte hex string',
  })
  .meta({
    format: undefined,
    title: 'SHA-256 Hash',
    description: 'SHA-256 cryptographic hash as hexadecimal string',
    examples: [
      '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
    ],
  });
export type Sha256Hash = z.infer<typeof Sha256HashSchema>;

export const ParticipantIdHashSchema = Sha256HashSchema.meta({
  title: 'Participant ID Hash',
  description:
    'SHA-256 hash representing a participant identifier (SHA-256 hex string)',
  examples: [
    '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
  ],
});
export type ParticipantIdHash = z.infer<typeof ParticipantIdHashSchema>;
