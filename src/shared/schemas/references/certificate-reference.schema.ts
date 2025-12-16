import { z } from 'zod';
import { CreditAmountSchema } from '../primitives/numbers.schema';
import { CertificateTypeSchema } from '../primitives/enums.schema';
import { MassIDReferenceSchema } from './mass-id-reference.schema';
import { NftTokenReferenceBaseSchema } from './token-reference-base.schema';

export const CertificateReferenceBaseSchema =
  NftTokenReferenceBaseSchema.safeExtend({
    type: CertificateTypeSchema,
    total_amount: CreditAmountSchema.meta({
      title: 'Certificate Total Amount',
      description: 'Total credits available in this certificate',
    }),
    mass_id: MassIDReferenceSchema,
  }).meta({
    title: 'Certificate Reference Base',
    description: 'Base schema for certificate references',
  });
export type CertificateReferenceBase = z.infer<
  typeof CertificateReferenceBaseSchema
>;
