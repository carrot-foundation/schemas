import { z } from 'zod';

export const NonEmptyStringSchema = z
  .string()
  .min(1, 'Cannot be empty')
  .meta({
    title: 'Non-Empty String',
    description: 'A string that contains at least one character',
    examples: ['Example text', 'Sample value', 'Test string'],
  });
export type NonEmptyString = z.infer<typeof NonEmptyStringSchema>;

export const MunicipalitySchema = NonEmptyStringSchema.max(50).meta({
  title: 'Municipality',
  description: 'Municipality or city name',
  examples: ['Macapá', 'São Paulo', 'New York', 'Berlin', 'Tokyo'],
});
export type Municipality = z.infer<typeof MunicipalitySchema>;

export const AdministrativeDivisionSchema = NonEmptyStringSchema.max(50).meta({
  title: 'Administrative Division',
  description: 'State, province, or administrative region name',
  examples: ['Amapá', 'California', 'Bavaria'],
});
export type AdministrativeDivision = z.infer<
  typeof AdministrativeDivisionSchema
>;

export const CountryNameSchema = NonEmptyStringSchema.max(50).meta({
  title: 'Country',
  description: 'Full country name in English',
  examples: ['Brazil', 'United States', 'Germany', 'Japan'],
});
export type CountryName = z.infer<typeof CountryNameSchema>;

export const CollectionNameSchema = NonEmptyStringSchema.max(150).meta({
  title: 'Collection Name',
  description: 'Display name of the collection',
  examples: ['BOLD Cold Start - Carazinho', 'BOLD Brazil'],
});
export type CollectionName = z.infer<typeof CollectionNameSchema>;

export const MethodologyNameSchema = NonEmptyStringSchema.max(100).meta({
  title: 'Methodology Name',
  description: 'Name of the methodology used for certification',
  examples: ['BOLD Recycling', 'BOLD Carbon (CH₄)'],
});
export type MethodologyName = z.infer<typeof MethodologyNameSchema>;

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

export const CollectionSlugSchema = SlugSchema.meta({
  title: 'Collection Slug',
  description: 'URL-friendly identifier for a collection',
  examples: ['bold-cold-start-carazinho', 'bold-brazil'],
});
export type CollectionSlug = z.infer<typeof CollectionSlugSchema>;

export const ParticipantRoleSchema = NonEmptyStringSchema.max(100).meta({
  title: 'Participant Role',
  description:
    'Role that a participant plays in the waste management supply chain',
  examples: ['Waste Generator', 'Hauler', 'Recycler'],
});
export type ParticipantRole = z.infer<typeof ParticipantRoleSchema>;

export const ParticipantNameSchema = NonEmptyStringSchema.max(100).meta({
  title: 'Participant Name',
  description: 'Name of a participant in the waste management system',
  examples: ['Enlatados Produção', 'Eco Reciclagem', 'Green Tech Corp'],
});
export type ParticipantName = z.infer<typeof ParticipantNameSchema>;

export const WasteTypeSchema = NonEmptyStringSchema.max(100).meta({
  title: 'Waste Type',
  description: 'Category or type of waste material',
  examples: ['Organic', 'Plastic', 'Metal'],
});
export type WasteType = z.infer<typeof WasteTypeSchema>;

export const WasteSubtypeSchema = NonEmptyStringSchema.max(100).meta({
  title: 'Waste Subtype',
  description: 'Specific subcategory of waste within a waste type',
  examples: ['Food, Food Waste and Beverages', 'Domestic Sludge'],
});
export type WasteSubtype = z.infer<typeof WasteSubtypeSchema>;

export const CreditTypeSchema = NonEmptyStringSchema.max(100).meta({
  title: 'Credit Type',
  description: 'Type of credit issued',
  examples: ['Organic', 'Carbon (CH₄)'],
});
export type CreditType = z.infer<typeof CreditTypeSchema>;

export const HexColorSchema = NonEmptyStringSchema.regex(
  /^#[0-9A-F]{6}$/,
  'Must be a hex color code with # prefix and uppercase',
).meta({
  title: 'Hex Color',
  description: 'Hexadecimal color code with hash prefix',
  examples: ['#2D5A27', '#FF5733'],
});
export type HexColor = z.infer<typeof HexColorSchema>;
