import { z } from 'zod';

import { NonEmptyStringSchema } from './text.schema';

export const SemanticVersionSchema = NonEmptyStringSchema.regex(
  /^v?\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/,
  'Must be a valid semantic version string',
).meta({
  title: 'Semantic Version',
  description: 'Version string following semantic versioning specification',
  examples: ['0.1.0', '1.0.0', '2.1.3'],
});
export type SemanticVersion = z.infer<typeof SemanticVersionSchema>;
