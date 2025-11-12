import { z } from "zod";
import {
  AudienceType,
  PriceUnit,
  ServiceSegmentType,
} from "../../generated/prisma/client";

const metadataSchema = z.record(z.any()).optional();

export const serviceCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  summary: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateServiceCategorySchema =
  serviceCategorySchema.partial().extend({
    isActive: z.boolean().optional(),
  });

export const servicePackageSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  segmentId: z.string().uuid().optional(),
  segmentName: z.string().optional(),
  segmentType: z.nativeEnum(ServiceSegmentType).optional(),
  audience: z.nativeEnum(AudienceType).default(AudienceType.RESIDENTIAL),
  basePrice: z.number().nonnegative().optional(),
  priceUnit: z.nativeEnum(PriceUnit),
  priceFrom: z.boolean().default(true),
  minQuantity: z.number().nonnegative().optional(),
  maxQuantity: z.number().nonnegative().optional(),
  metadata: metadataSchema,
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export const updateServicePackageSchema = servicePackageSchema.partial();

export const serviceAddonSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  audience: z.nativeEnum(AudienceType).default(AudienceType.UNIVERSAL),
  price: z.number().nonnegative().optional(),
  priceUnit: z.nativeEnum(PriceUnit).default(PriceUnit.PER_JOB),
  priceFrom: z.boolean().default(true),
  metadata: metadataSchema,
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

export const updateServiceAddonSchema = serviceAddonSchema.partial();

export const serviceSegmentSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  type: z.nativeEnum(ServiceSegmentType).default(ServiceSegmentType.GENERAL),
  displayOrder: z.number().int().optional(),
});

export const updateServiceSegmentSchema = serviceSegmentSchema.partial();

export type ServiceCategoryInput = z.infer<typeof serviceCategorySchema>;
export type UpdateServiceCategoryInput = z.infer<
  typeof updateServiceCategorySchema
>;
export type ServicePackageInput = z.infer<typeof servicePackageSchema>;
export type UpdateServicePackageInput = z.infer<
  typeof updateServicePackageSchema
>;
export type ServiceAddonInput = z.infer<typeof serviceAddonSchema>;
export type UpdateServiceAddonInput = z.infer<
  typeof updateServiceAddonSchema
>;
export type ServiceSegmentInput = z.infer<typeof serviceSegmentSchema>;
export type UpdateServiceSegmentInput = z.infer<
  typeof updateServiceSegmentSchema
>;

