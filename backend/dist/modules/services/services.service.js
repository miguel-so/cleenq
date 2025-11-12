"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceCatalog = getServiceCatalog;
exports.listServicesWithDetails = listServicesWithDetails;
exports.createServiceCategory = createServiceCategory;
exports.updateServiceCategory = updateServiceCategory;
exports.deleteServiceCategory = deleteServiceCategory;
exports.createServiceSegment = createServiceSegment;
exports.updateServiceSegment = updateServiceSegment;
exports.deleteServiceSegment = deleteServiceSegment;
exports.createServicePackage = createServicePackage;
exports.updateServicePackage = updateServicePackage;
exports.deleteServicePackage = deleteServicePackage;
exports.createServiceAddon = createServiceAddon;
exports.updateServiceAddon = updateServiceAddon;
exports.deleteServiceAddon = deleteServiceAddon;
const client_1 = require("../../generated/prisma/client");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const app_error_1 = __importDefault(require("../../utils/app-error"));
async function getServiceCatalog() {
    return prisma_1.default.serviceCategory.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            name: "asc",
        },
        include: {
            segments: {
                orderBy: { displayOrder: "asc" },
            },
            packages: {
                where: { isActive: true },
                orderBy: { displayOrder: "asc" },
            },
            addOns: {
                where: { isActive: true },
                orderBy: { displayOrder: "asc" },
            },
        },
    });
}
async function listServicesWithDetails() {
    return prisma_1.default.serviceCategory.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            segments: {
                orderBy: { displayOrder: "asc" },
                include: {
                    packages: {
                        orderBy: { displayOrder: "asc" },
                    },
                },
            },
            packages: {
                orderBy: { displayOrder: "asc" },
                include: {
                    segment: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                        },
                    },
                },
            },
            addOns: { orderBy: { displayOrder: "asc" } },
        },
    });
}
async function createServiceCategory(data) {
    return prisma_1.default.serviceCategory.create({
        data,
    });
}
async function updateServiceCategory(id, data) {
    return prisma_1.default.serviceCategory.update({
        where: { id },
        data,
    });
}
async function deleteServiceCategory(id) {
    const bookings = await prisma_1.default.booking.count({
        where: { serviceCategoryId: id },
    });
    if (bookings > 0) {
        throw new app_error_1.default("Cannot delete service with existing bookings. Consider deactivating instead.", 409);
    }
    await prisma_1.default.serviceCategory.delete({
        where: { id },
    });
}
async function resolveSegment(serviceCategoryId, input) {
    if (input.segmentId) {
        return input.segmentId;
    }
    if (input.segmentName) {
        const existing = await prisma_1.default.serviceSegment.findFirst({
            where: {
                serviceCategoryId,
                name: input.segmentName,
            },
        });
        if (existing) {
            return existing.id;
        }
        const created = await prisma_1.default.serviceSegment.create({
            data: {
                serviceCategoryId,
                name: input.segmentName,
                type: input.segmentType ?? client_1.ServiceSegmentType.GENERAL,
            },
        });
        return created.id;
    }
    return undefined;
}
async function createServiceSegment(serviceCategoryId, data) {
    return prisma_1.default.serviceSegment.create({
        data: {
            ...data,
            serviceCategoryId,
        },
    });
}
async function updateServiceSegment(segmentId, data) {
    return prisma_1.default.serviceSegment.update({
        where: { id: segmentId },
        data,
    });
}
async function deleteServiceSegment(segmentId) {
    const packages = await prisma_1.default.servicePackage.count({
        where: { segmentId },
    });
    if (packages > 0) {
        throw new app_error_1.default("Cannot delete segment with active packages. Reassign packages first.", 409);
    }
    await prisma_1.default.serviceSegment.delete({
        where: { id: segmentId },
    });
}
async function createServicePackage(serviceCategoryId, input) {
    const segmentId = await resolveSegment(serviceCategoryId, input);
    return prisma_1.default.servicePackage.create({
        data: {
            serviceCategoryId,
            segmentId,
            name: input.name,
            description: input.description,
            audience: input.audience,
            basePrice: input.basePrice !== undefined
                ? new client_1.Prisma.Decimal(input.basePrice)
                : undefined,
            priceUnit: input.priceUnit,
            priceFrom: input.priceFrom,
            minQuantity: input.minQuantity,
            maxQuantity: input.maxQuantity,
            metadata: input.metadata,
            isActive: input.isActive ?? true,
            displayOrder: input.displayOrder ?? 0,
        },
    });
}
async function updateServicePackage(packageId, serviceCategoryId, input) {
    const data = {};
    if (input.name)
        data.name = input.name;
    if (input.description !== undefined)
        data.description = input.description;
    if (input.audience)
        data.audience = input.audience;
    if (input.basePrice !== undefined) {
        data.basePrice = new client_1.Prisma.Decimal(input.basePrice);
    }
    if (input.priceUnit)
        data.priceUnit = input.priceUnit;
    if (input.priceFrom !== undefined)
        data.priceFrom = input.priceFrom;
    if (input.minQuantity !== undefined)
        data.minQuantity = input.minQuantity;
    if (input.maxQuantity !== undefined)
        data.maxQuantity = input.maxQuantity;
    if (input.metadata !== undefined)
        data.metadata = input.metadata;
    if (input.isActive !== undefined)
        data.isActive = input.isActive;
    if (input.displayOrder !== undefined)
        data.displayOrder = input.displayOrder;
    if (input.segmentId || input.segmentName) {
        const segmentId = await resolveSegment(serviceCategoryId, input);
        data.segment = segmentId
            ? {
                connect: { id: segmentId },
            }
            : { disconnect: true };
    }
    return prisma_1.default.servicePackage.update({
        where: { id: packageId },
        data,
    });
}
async function deleteServicePackage(packageId) {
    const hasBookings = await prisma_1.default.bookingItem.count({
        where: { servicePackageId: packageId },
    });
    if (hasBookings > 0) {
        throw new app_error_1.default("Cannot delete package referenced by bookings. Consider deactivating instead.", 409);
    }
    await prisma_1.default.servicePackage.delete({
        where: { id: packageId },
    });
}
async function createServiceAddon(serviceCategoryId, input) {
    return prisma_1.default.serviceAddon.create({
        data: {
            serviceCategoryId,
            name: input.name,
            description: input.description,
            audience: input.audience,
            price: input.price !== undefined
                ? new client_1.Prisma.Decimal(input.price)
                : undefined,
            priceUnit: input.priceUnit,
            priceFrom: input.priceFrom,
            metadata: input.metadata,
            isActive: input.isActive ?? true,
            displayOrder: input.displayOrder ?? 0,
        },
    });
}
async function updateServiceAddon(addonId, input) {
    const data = {};
    if (input.name)
        data.name = input.name;
    if (input.description !== undefined)
        data.description = input.description;
    if (input.audience)
        data.audience = input.audience;
    if (input.price !== undefined) {
        data.price = new client_1.Prisma.Decimal(input.price);
    }
    if (input.priceUnit)
        data.priceUnit = input.priceUnit;
    if (input.priceFrom !== undefined)
        data.priceFrom = input.priceFrom;
    if (input.metadata !== undefined)
        data.metadata = input.metadata;
    if (input.isActive !== undefined)
        data.isActive = input.isActive;
    if (input.displayOrder !== undefined)
        data.displayOrder = input.displayOrder;
    return prisma_1.default.serviceAddon.update({
        where: { id: addonId },
        data,
    });
}
async function deleteServiceAddon(addonId) {
    const hasBookings = await prisma_1.default.bookingAddon.count({
        where: { serviceAddonId: addonId },
    });
    if (hasBookings > 0) {
        throw new app_error_1.default("Cannot delete add-on referenced by bookings. Consider deactivating instead.", 409);
    }
    await prisma_1.default.serviceAddon.delete({
        where: { id: addonId },
    });
}
