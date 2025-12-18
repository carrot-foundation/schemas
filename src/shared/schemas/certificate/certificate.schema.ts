import { z } from 'zod';
import {
  WasteTypeSchema,
  WasteSubtypeSchema,
  WeightKgSchema,
} from '../primitives';

export const WastePropertiesSchema = z
  .strictObject({
    type: WasteTypeSchema.meta({
      title: 'Source Waste Type',
      description: 'Type of the source waste',
    }),
    subtype: WasteSubtypeSchema.meta({
      title: 'Source Waste Subtype',
      description: 'Subtype of the source waste',
    }),
    weight_kg: WeightKgSchema.meta({
      title: 'Source Waste Net Weight',
      description: 'Net weight of the source waste in kilograms (kg)',
    }),
  })
  .meta({
    title: 'Waste Properties',
    description: 'Properties of the source waste (MassID)',
  });
export type WasteProperties = z.infer<typeof WastePropertiesSchema>;
