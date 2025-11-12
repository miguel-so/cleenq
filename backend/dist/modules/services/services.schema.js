"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceSegmentSchema = exports.serviceSegmentSchema = exports.updateServiceAddonSchema = exports.serviceAddonSchema = exports.updateServicePackageSchema = exports.servicePackageSchema = exports.updateServiceCategorySchema = exports.serviceCategorySchema = void 0;
const zod_1 = require("zod");
const client_1 = require("../../generated/prisma/client");
const metadataSchema = zod_1.z.record(zod_1.z.any()).optional();
exports.serviceCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    slug: zod_1.z.string().min(2),
    summary: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updateServiceCategorySchema = exports.serviceCategorySchema.partial().extend({
    isActive: zod_1.z.boolean().optional(),
});
exports.servicePackageSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    segmentId: zod_1.z.string().uuid().optional(),
    segmentName: zod_1.z.string().optional(),
    segmentType: zod_1.z.nativeEnum(client_1.ServiceSegmentType).optional(),
    audience: zod_1.z.nativeEnum(client_1.AudienceType).default(client_1.AudienceType.RESIDENTIAL),
    basePrice: zod_1.z.number().nonnegative().optional(),
    priceUnit: zod_1.z.nativeEnum(client_1.PriceUnit),
    priceFrom: zod_1.z.boolean().default(true),
    minQuantity: zod_1.z.number().nonnegative().optional(),
    maxQuantity: zod_1.z.number().nonnegative().optional(),
    metadata: metadataSchema,
    isActive: zod_1.z.boolean().optional(),
    displayOrder: zod_1.z.number().int().optional(),
});
exports.updateServicePackageSchema = exports.servicePackageSchema.partial();
exports.serviceAddonSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    audience: zod_1.z.nativeEnum(client_1.AudienceType).default(client_1.AudienceType.UNIVERSAL),
    price: zod_1.z.number().nonnegative().optional(),
    priceUnit: zod_1.z.nativeEnum(client_1.PriceUnit).default(client_1.PriceUnit.PER_JOB),
    priceFrom: zod_1.z.boolean().default(true),
    metadata: metadataSchema,
    isActive: zod_1.z.boolean().optional(),
    displayOrder: zod_1.z.number().int().optional(),
});
exports.updateServiceAddonSchema = exports.serviceAddonSchema.partial();
exports.serviceSegmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    type: zod_1.z.nativeEnum(client_1.ServiceSegmentType).default(client_1.ServiceSegmentType.GENERAL),
    displayOrder: zod_1.z.number().int().optional(),
});
exports.updateServiceSegmentSchema = exports.serviceSegmentSchema.partial();
