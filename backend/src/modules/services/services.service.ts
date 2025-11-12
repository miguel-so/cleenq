import { Prisma, ServiceSegmentType } from "../../generated/prisma/client";
import prisma from "../../lib/prisma";
import AppError from "../../utils/app-error";
import type {
  ServiceAddonInput,
  ServiceCategoryInput,
  ServicePackageInput,
  ServiceSegmentInput,
  UpdateServiceAddonInput,
  UpdateServiceCategoryInput,
  UpdateServicePackageInput,
  UpdateServiceSegmentInput,
} from "./services.schema";

export async function getServiceCatalog() {
  return prisma.serviceCategory.findMany({
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

export async function listServicesWithDetails() {
  return prisma.serviceCategory.findMany({
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

export async function createServiceCategory(data: ServiceCategoryInput) {
  return prisma.serviceCategory.create({
    data,
  });
}

export async function updateServiceCategory(
  id: string,
  data: UpdateServiceCategoryInput,
) {
  return prisma.serviceCategory.update({
    where: { id },
    data,
  });
}

export async function deleteServiceCategory(id: string) {
  const bookings = await prisma.booking.count({
    where: { serviceCategoryId: id },
  });

  if (bookings > 0) {
    throw new AppError(
      "Cannot delete service with existing bookings. Consider deactivating instead.",
      409,
    );
  }

  await prisma.serviceCategory.delete({
    where: { id },
  });
}

async function resolveSegment(
  serviceCategoryId: string,
  input: ServicePackageInput | UpdateServicePackageInput,
) {
  if (input.segmentId) {
    return input.segmentId;
  }

  if (input.segmentName) {
    const existing = await prisma.serviceSegment.findFirst({
      where: {
        serviceCategoryId,
        name: input.segmentName,
      },
    });

    if (existing) {
      return existing.id;
    }

    const created = await prisma.serviceSegment.create({
      data: {
        serviceCategoryId,
        name: input.segmentName,
        type: input.segmentType ?? ServiceSegmentType.GENERAL,
      },
    });

    return created.id;
  }

  return undefined;
}

export async function createServiceSegment(
  serviceCategoryId: string,
  data: ServiceSegmentInput,
) {
  return prisma.serviceSegment.create({
    data: {
      ...data,
      serviceCategoryId,
    },
  });
}

export async function updateServiceSegment(
  segmentId: string,
  data: UpdateServiceSegmentInput,
) {
  return prisma.serviceSegment.update({
    where: { id: segmentId },
    data,
  });
}

export async function deleteServiceSegment(segmentId: string) {
  const packages = await prisma.servicePackage.count({
    where: { segmentId },
  });

  if (packages > 0) {
    throw new AppError(
      "Cannot delete segment with active packages. Reassign packages first.",
      409,
    );
  }

  await prisma.serviceSegment.delete({
    where: { id: segmentId },
  });
}

export async function createServicePackage(
  serviceCategoryId: string,
  input: ServicePackageInput,
) {
  const segmentId = await resolveSegment(serviceCategoryId, input);

  return prisma.servicePackage.create({
    data: {
      serviceCategoryId,
      segmentId,
      name: input.name,
      description: input.description,
      audience: input.audience,
      basePrice:
        input.basePrice !== undefined
          ? new Prisma.Decimal(input.basePrice)
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

export async function updateServicePackage(
  packageId: string,
  serviceCategoryId: string,
  input: UpdateServicePackageInput,
) {
  const data: Prisma.ServicePackageUpdateInput = {};

  if (input.name) data.name = input.name;
  if (input.description !== undefined) data.description = input.description;
  if (input.audience) data.audience = input.audience;
  if (input.basePrice !== undefined) {
    data.basePrice = new Prisma.Decimal(input.basePrice);
  }
  if (input.priceUnit) data.priceUnit = input.priceUnit;
  if (input.priceFrom !== undefined) data.priceFrom = input.priceFrom;
  if (input.minQuantity !== undefined) data.minQuantity = input.minQuantity;
  if (input.maxQuantity !== undefined) data.maxQuantity = input.maxQuantity;
  if (input.metadata !== undefined) data.metadata = input.metadata;
  if (input.isActive !== undefined) data.isActive = input.isActive;
  if (input.displayOrder !== undefined) data.displayOrder = input.displayOrder;

  if (input.segmentId || input.segmentName) {
    const segmentId = await resolveSegment(serviceCategoryId, input);
    data.segment = segmentId
      ? {
          connect: { id: segmentId },
        }
      : { disconnect: true };
  }

  return prisma.servicePackage.update({
    where: { id: packageId },
    data,
  });
}

export async function deleteServicePackage(packageId: string) {
  const hasBookings = await prisma.bookingItem.count({
    where: { servicePackageId: packageId },
  });

  if (hasBookings > 0) {
    throw new AppError(
      "Cannot delete package referenced by bookings. Consider deactivating instead.",
      409,
    );
  }

  await prisma.servicePackage.delete({
    where: { id: packageId },
  });
}

export async function createServiceAddon(
  serviceCategoryId: string,
  input: ServiceAddonInput,
) {
  return prisma.serviceAddon.create({
    data: {
      serviceCategoryId,
      name: input.name,
      description: input.description,
      audience: input.audience,
      price:
        input.price !== undefined
          ? new Prisma.Decimal(input.price)
          : undefined,
      priceUnit: input.priceUnit,
      priceFrom: input.priceFrom,
      metadata: input.metadata,
      isActive: input.isActive ?? true,
      displayOrder: input.displayOrder ?? 0,
    },
  });
}

export async function updateServiceAddon(
  addonId: string,
  input: UpdateServiceAddonInput,
) {
  const data: Prisma.ServiceAddonUpdateInput = {};

  if (input.name) data.name = input.name;
  if (input.description !== undefined) data.description = input.description;
  if (input.audience) data.audience = input.audience;
  if (input.price !== undefined) {
    data.price = new Prisma.Decimal(input.price);
  }
  if (input.priceUnit) data.priceUnit = input.priceUnit;
  if (input.priceFrom !== undefined) data.priceFrom = input.priceFrom;
  if (input.metadata !== undefined) data.metadata = input.metadata;
  if (input.isActive !== undefined) data.isActive = input.isActive;
  if (input.displayOrder !== undefined) data.displayOrder = input.displayOrder;

  return prisma.serviceAddon.update({
    where: { id: addonId },
    data,
  });
}

export async function deleteServiceAddon(addonId: string) {
  const hasBookings = await prisma.bookingAddon.count({
    where: { serviceAddonId: addonId },
  });

  if (hasBookings > 0) {
    throw new AppError(
      "Cannot delete add-on referenced by bookings. Consider deactivating instead.",
      409,
    );
  }

  await prisma.serviceAddon.delete({
    where: { id: addonId },
  });
}

