import { z } from 'zod';

export const Sha256HashSchema = z
  .string()
  .regex(/^[a-f0-9]{64}$/, {
    error:
      'Must be a SHA-256 hash as 32-byte lowercase hex string (no 0x prefix)',
  })
  .meta({
    title: 'SHA-256 Hash',
    description:
      'SHA-256 cryptographic hash as canonical lowercase hexadecimal string',
    examples: [
      '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
    ],
  });
export type Sha256Hash = z.infer<typeof Sha256HashSchema>;

export const ParticipantIdHashSchema = Sha256HashSchema.meta({
  title: 'Participant ID Hash',
  description:
    'SHA-256 hash anonymizing a participant identity — used to link records without exposing personal data',
  examples: [
    '87f633634cc4b02f628685651f0a29b7bfa22a0bd841f725c6772dd00a58d489',
  ],
});
export type ParticipantIdHash = z.infer<typeof ParticipantIdHashSchema>;
