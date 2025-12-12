import { z } from 'zod';

export const NonEmptyStringSchema = z
  .string()
  .min(1, 'Cannot be empty')
  .meta({
    title: 'Non-Empty String',
    description: 'A string that contains at least one character',
    examples: ['Example text', 'Sample value'],
  });
export type NonEmptyString = z.infer<typeof NonEmptyStringSchema>;

export const CitySchema = NonEmptyStringSchema.max(50).meta({
  title: 'City',
  description: 'City name',
  examples: ['Macapá', 'São Paulo', 'New York', 'Berlin', 'Tokyo'],
});
export type City = z.infer<typeof CitySchema>;

export const SlugSchema = NonEmptyStringSchema.regex(
  /^[a-z0-9-]+$/,
  'Must contain only lowercase letters, numbers, and hyphens',
)
  .max(100)
  .meta({
    title: 'Slug',
    description:
      'URL-friendly identifier with lowercase letters, numbers, and hyphens',
    examples: ['mass-id-123', 'recycled-plastic', 'organic-waste'],
  });
export type Slug = z.infer<typeof SlugSchema>;

export const HexColorSchema = NonEmptyStringSchema.regex(
  /^#[0-9A-F]{6}$/,
  'Must be a hex color code with # prefix and uppercase',
).meta({
  title: 'Hex Color',
  description: 'Hexadecimal color code with hash prefix',
  examples: ['#2D5A27', '#FF5733'],
});
export type HexColor = z.infer<typeof HexColorSchema>;

export const IbamaWasteClassificationSchema = z
  .string()
  .regex(/^\d{2} \d{2} \d{2}\*?$/, 'Invalid Ibama code format')
  .meta({
    title: 'Ibama Classification Code',
    description:
      'Ibama waste classification code in the format NN NN NN with required spaces and optional trailing *',
    examples: ['20 01 01', '20 01 01*', '04 02 20'],
  });
export type IbamaWasteClassification = z.infer<
  typeof IbamaWasteClassificationSchema
>;
