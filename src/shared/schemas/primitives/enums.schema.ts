import { z } from 'zod';

export const RecordSchemaTypeSchema = z
  .enum([
    'MassID',
    'MassID Audit',
    'RecycledID',
    'GasID',
    'CreditPurchaseReceipt',
    'CreditRetirementReceipt',
    'Methodology',
    'Credit',
    'Collection',
  ])
  .meta({
    title: 'Schema Type',
    description:
      'Identifies the record type within the Carrot ecosystem (e.g., MassID for waste tracking, GasID for prevented emissions certificates)',
    examples: ['MassID', 'GasID', 'Credit', 'CreditPurchaseReceipt'],
  });
export type RecordSchemaType = z.infer<typeof RecordSchemaTypeSchema>;

export const CreditTokenNameSchema = z
  .enum(['Carrot Carbon (CH₄)', 'Carrot Biowaste'])
  .meta({
    title: 'Credit Token Name',
    description: 'Human-readable display name for the credit token',
    examples: ['Carrot Carbon (CH₄)', 'Carrot Biowaste'],
  });
export type CreditTokenName = z.infer<typeof CreditTokenNameSchema>;

export const CreditTokenSlugSchema = z
  .enum(['carbon-methane', 'biowaste'])
  .meta({
    title: 'Credit Token Slug',
    description: 'URL-friendly identifier for the credit token',
    examples: ['carbon-methane', 'biowaste'],
  });
export type CreditTokenSlug = z.infer<typeof CreditTokenSlugSchema>;

export const CreditTokenSymbolSchema = z.enum(['C-CARB.CH4', 'C-BIOW']).meta({
  title: 'Credit Token Symbol',
  description: 'ERC20 token symbol identifier',
  examples: ['C-CARB.CH4', 'C-BIOW'],
});
export type CreditTokenSymbol = z.infer<typeof CreditTokenSymbolSchema>;

export const CreditTypeSchema = z.enum(['Biowaste', 'Carbon (CH₄)']).meta({
  title: 'Credit Type',
  description:
    'Category of environmental credit — indicates the impact pathway (biowaste diversion or methane prevention)',
  examples: ['Biowaste', 'Carbon (CH₄)'],
});
export type CreditType = z.infer<typeof CreditTypeSchema>;

export const GasTypeSchema = z.enum(['Methane (CH₄)']).meta({
  title: 'Gas Type',
  description:
    'Greenhouse gas type whose emission was prevented through the waste management activity',
  examples: ['Methane (CH₄)'],
});
export type GasType = z.infer<typeof GasTypeSchema>;

export const VehicleTypeSchema = z
  .enum([
    'Bicycle',
    'Boat',
    'Car',
    'Cargo Ship',
    'Cart',
    'Mini Van',
    'Motorcycle',
    'Others',
    'Sludge Pipes',
    'Truck',
  ])
  .meta({
    title: 'Vehicle Type',
    description:
      'Type of vehicle used to transport waste between collection and processing sites',
    examples: ['Truck', 'Motorcycle', 'Cart'],
  });
export type VehicleType = z.infer<typeof VehicleTypeSchema>;

export const ScaleTypeSchema = z
  .enum([
    'Bin Scale',
    'Conveyor Belt Scale',
    'Floor Scale',
    'Forklift Scale',
    'Hanging / Crane Scale',
    'Onboard Truck Scale',
    'Pallet Scale',
    'Portable Axle Weigher',
    'Precision / Bench Scale',
    'Weighbridge (Truck Scale)',
  ])
  .meta({
    title: 'Scale Type',
    description:
      'Type of weighing equipment used to measure the waste load at a collection or processing site',
    examples: ['Weighbridge (Truck Scale)', 'Floor Scale'],
  });
export type ScaleType = z.infer<typeof ScaleTypeSchema>;

export const WeighingCaptureMethodSchema = z
  .enum(['Digital', 'Manual', 'Photo (Scale + Cargo)', 'Transport Manifest'])
  .meta({
    title: 'Weighing Capture Method',
    description:
      'How the weight measurement was recorded — digital readout, manual entry, photo evidence, or transport manifest',
    examples: ['Digital', 'Photo (Scale + Cargo)'],
  });
export type WeighingCaptureMethod = z.infer<typeof WeighingCaptureMethodSchema>;

export const ContainerTypeSchema = z
  .enum(['Bag', 'Bin', 'Drum', 'Pail', 'Street Bin', 'Truck', 'Waste Box'])
  .meta({
    title: 'Container Type',
    description:
      'Type of container used to hold or transport the waste material',
    examples: ['Bag', 'Bin', 'Truck'],
  });
export type ContainerType = z.infer<typeof ContainerTypeSchema>;

export const CollectionSlugSchema = z
  .enum([
    'bold-innovators',
    'bold-cold-start-jundiai',
    'bold-cold-start-carazinho',
    'bold-brazil',
  ])
  .meta({
    title: 'Collection Slug',
    description:
      'URL-friendly identifier for an environmental credit collection, used in URIs and API references',
    examples: ['bold-cold-start-carazinho', 'bold-brazil'],
  });
export type CollectionSlug = z.infer<typeof CollectionSlugSchema>;

export const ParticipantRoleSchema = z
  .enum([
    'Community Impact Pool',
    'Hauler',
    'Network Integrator',
    'Methodology Author',
    'Methodology Developer',
    'Network',
    'Processor',
    'Recycler',
    'Waste Generator',
  ])
  .meta({
    title: 'Participant Role',
    description:
      'Role that a participant plays in the waste management supply chain',
    examples: ['Waste Generator', 'Hauler', 'Recycler'],
  });
export type ParticipantRole = z.infer<typeof ParticipantRoleSchema>;

export const WasteTypeSchema = z.enum(['Organic']).meta({
  title: 'Waste Type',
  description:
    'Broad classification of the waste material being tracked (e.g., Organic)',
  examples: ['Organic'],
});
export type WasteType = z.infer<typeof WasteTypeSchema>;

export const WasteSubtypeSchema = z
  .enum([
    'Domestic Sludge',
    'EFB similar to Garden, Yard and Park Waste',
    'Food, Food Waste and Beverages',
    'Garden, Yard and Park Waste',
    'Industrial Sludge',
    'Tobacco',
    'Wood and Wood Products',
  ])
  .meta({
    title: 'Waste Subtype',
    description:
      'Detailed subcategory of the waste material, refining the broad waste type classification',
    examples: ['Food, Food Waste and Beverages', 'Garden, Yard and Park Waste'],
  });
export type WasteSubtype = z.infer<typeof WasteSubtypeSchema>;

export const CollectionNameSchema = z
  .enum([
    'BOLD Innovators',
    'BOLD Cold Start - Carazinho',
    'BOLD Cold Start - Jundiaí',
    'BOLD Brazil',
  ])
  .meta({
    title: 'Collection Name',
    description:
      'Human-readable display name for the environmental credit collection',
    examples: ['BOLD Cold Start - Carazinho', 'BOLD Brazil'],
  });
export type CollectionName = z.infer<typeof CollectionNameSchema>;

export const MethodologyNameSchema = z
  .enum([
    'AMS-III.F. | BOLD Carbon (CH₄) - SSC',
    'AMS-III.F. | BOLD Recycling Credit',
  ])
  .meta({
    title: 'Methodology Name',
    description: 'Full official name of the methodology',
    examples: [
      'AMS-III.F. | BOLD Carbon (CH₄) - SSC',
      'AMS-III.F. | BOLD Recycling Credit',
    ],
  });
export type MethodologyName = z.infer<typeof MethodologyNameSchema>;

export const MethodologyShortNameSchema = z
  .enum(['BOLD Carbon (CH₄)', 'BOLD Recycling'])
  .meta({
    title: 'Methodology Short Name',
    description:
      'Abbreviated/short name of the methodology used for UI display and references',
    examples: ['BOLD Carbon (CH₄)', 'BOLD Recycling'],
  });
export type MethodologyShortName = z.infer<typeof MethodologyShortNameSchema>;

export const MethodologySlugSchema = z
  .enum(['bold-recycling', 'bold-carbon-ch4'])
  .meta({
    title: 'Methodology Slug',
    description: 'URL-friendly identifier for the methodology',
    examples: ['bold-recycling', 'bold-carbon-ch4'],
  });
export type MethodologySlug = z.infer<typeof MethodologySlugSchema>;

export const CertificateTypeSchema = z.enum(['GasID', 'RecycledID']).meta({
  title: 'Certificate Type',
  description:
    'Type of certificate — GasID for methane prevention, RecycledID for waste recycling',
  examples: ['GasID', 'RecycledID'],
});
export type CertificateType = z.infer<typeof CertificateTypeSchema>;
