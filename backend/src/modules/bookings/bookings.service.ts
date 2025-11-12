import { Prisma } from "../../generated/prisma/client";
import prisma from "../../lib/prisma";
import AppError from "../../utils/app-error";
import type {
  AssignCleanerInput,
  BookingQueryInput,
  CreateBookingInput,
  UpdateAssignmentInput,
  UpdateBookingInput,
  UpdateBookingStatusInput,
} from "./bookings.schema";

function toDecimal(value?: number) {
  return value !== undefined ? new Prisma.Decimal(value) : undefined;
}

function calculateTotals(
  items: CreateBookingInput["items"],
  addOns?: CreateBookingInput["addOns"],
) {
  const itemsTotal = items.reduce<number>((sum, item) => {
    const lineTotal = item.unitPrice * item.quantity - (item.discount ?? 0);
    return sum + lineTotal;
  }, 0);

  const addOnTotal = (addOns ?? []).reduce<number>((sum, addon) => {
    const total =
      addon.total ??
      addon.unitPrice * (addon.quantity ?? 1);
    return sum + total;
  }, 0);

  const subtotal = itemsTotal + addOnTotal;
  const tax = subtotal * 0.1; // default 10% GST
  const total = subtotal + tax;

  return { subtotal, tax, total };
}

function generateBookingReference() {
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `CLQ-${new Date().getTime().toString().slice(-6)}-${random}`;
}

export async function listBookings(query: BookingQueryInput) {
  const where: Prisma.BookingWhereInput = {};

  if (query.status) where.status = query.status;
  if (query.serviceCategoryId)
    where.serviceCategoryId = query.serviceCategoryId;
  if (query.customerId) where.customerId = query.customerId;

  if (query.dateFrom || query.dateTo) {
    where.scheduledAt = {
      gte: query.dateFrom ? new Date(query.dateFrom) : undefined,
      lte: query.dateTo ? new Date(query.dateTo) : undefined,
    };
  }

  if (query.search) {
    where.OR = [
      { reference: { contains: query.search } },
      {
        customer: {
          OR: [
            { firstName: { contains: query.search } },
            { lastName: { contains: query.search } },
            { email: { contains: query.search } },
          ],
        },
      },
    ];
  }

  const [bookings, total] = await prisma.$transaction([
    prisma.booking.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        serviceCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        membershipPlan: true,
        items: {
          include: {
            servicePackage: {
              select: {
                id: true,
                name: true,
                priceUnit: true,
              },
            },
          },
        },
        addOns: {
          include: {
            serviceAddon: {
              select: {
                id: true,
                name: true,
                priceUnit: true,
              },
            },
          },
        },
        cleanerAssignments: {
          include: {
            cleaner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: query.limit,
      skip: query.cursor ? 1 : 0,
      cursor: query.cursor ? { id: query.cursor } : undefined,
    }),
    prisma.booking.count({ where }),
  ]);

  const nextCursor =
    bookings.length === query.limit
      ? bookings[bookings.length - 1]?.id
      : undefined;

  return {
    data: bookings,
    meta: {
      total,
      limit: query.limit,
      cursor: query.cursor ?? null,
      nextCursor: nextCursor ?? null,
      hasMore: Boolean(nextCursor),
    },
  };
}

export async function getBooking(id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      serviceCategory: true,
      membershipPlan: true,
      items: {
        include: { servicePackage: true },
      },
      addOns: {
        include: { serviceAddon: true },
      },
      cleanerAssignments: {
        include: { cleaner: true },
      },
      timelineEvents: {
        orderBy: { createdAt: "asc" },
      },
      rewards: true,
    },
  });

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  return booking;
}

export async function createBooking(input: CreateBookingInput, adminId: string) {
  const totals =
    input.subtotal && input.tax && input.total
      ? {
          subtotal: input.subtotal,
          tax: input.tax,
          total: input.total,
        }
      : calculateTotals(input.items, input.addOns);

  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.create({
      data: {
        reference: generateBookingReference(),
        customerId: input.customerId,
        serviceCategoryId: input.serviceCategoryId,
        membershipPlanId: input.membershipPlanId,
        status: input.status,
        scheduledAt: input.scheduledAt,
        durationMinutes: input.durationMinutes,
        notes: input.notes,
        addressLine1: input.addressLine1,
        addressLine2: input.addressLine2,
        suburb: input.suburb,
        state: input.state,
        postcode: input.postcode,
        subtotal: new Prisma.Decimal(totals.subtotal),
        discount: toDecimal(input.discount ?? 0) ?? new Prisma.Decimal(0),
        tax: new Prisma.Decimal(totals.tax),
        total: new Prisma.Decimal(totals.total),
        approvedByAdminId: adminId,
        items: {
          create: input.items.map((item) => ({
            servicePackageId: item.servicePackageId,
            quantity: item.quantity,
            unitPrice: new Prisma.Decimal(item.unitPrice),
            discount: toDecimal(item.discount ?? 0) ?? new Prisma.Decimal(0),
            total: new Prisma.Decimal(
              item.unitPrice * item.quantity - (item.discount ?? 0),
            ),
            metadata: item.metadata,
          })),
        },
        addOns: input.addOns
          ? {
              create: input.addOns.map((addon) => ({
                serviceAddonId: addon.serviceAddonId,
                quantity: addon.quantity ?? 1,
                unitPrice: new Prisma.Decimal(addon.unitPrice),
                total: new Prisma.Decimal(
                  addon.total ??
                    addon.unitPrice * (addon.quantity ?? 1),
                ),
                metadata: addon.metadata,
              })),
            }
          : undefined,
        timelineEvents: {
          create: {
            status: input.status,
            notes: "Booking created by admin portal",
          },
        },
      },
      include: {
        customer: true,
        items: true,
        addOns: true,
      },
    });

    return booking;
  });
}

export async function updateBooking(
  bookingId: string,
  input: UpdateBookingInput,
  adminId: string,
) {
  const booking = await getBooking(bookingId);

  const totals =
    input.items || input.addOns
      ? calculateTotals(
          input.items ?? booking.items.map((item) => ({
            servicePackageId: item.servicePackageId,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
            discount: Number(item.discount),
            metadata: item.metadata ?? undefined,
          })),
          input.addOns ??
            booking.addOns.map((addon) => ({
              serviceAddonId: addon.serviceAddonId,
              quantity: addon.quantity,
              unitPrice: Number(addon.unitPrice),
              total: Number(addon.total),
              metadata: addon.metadata ?? undefined,
            })),
        )
      : {
          subtotal: Number(booking.subtotal),
          tax: Number(booking.tax),
          total: Number(booking.total),
        };

  return prisma.$transaction(async (tx) => {
    if (input.items) {
      await tx.bookingItem.deleteMany({
        where: { bookingId },
      });
    }
    if (input.addOns) {
      await tx.bookingAddon.deleteMany({
        where: { bookingId },
      });
    }

    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: input.status ?? booking.status,
        serviceCategoryId: input.serviceCategoryId ?? booking.serviceCategoryId,
        membershipPlanId: input.membershipPlanId ?? booking.membershipPlanId,
        scheduledAt: input.scheduledAt ?? booking.scheduledAt,
        durationMinutes: input.durationMinutes ?? booking.durationMinutes,
        notes: input.notes ?? booking.notes,
        addressLine1: input.addressLine1 ?? booking.addressLine1,
        addressLine2: input.addressLine2 ?? booking.addressLine2,
        suburb: input.suburb ?? booking.suburb,
        state: input.state ?? booking.state,
        postcode: input.postcode ?? booking.postcode,
        subtotal: new Prisma.Decimal(totals.subtotal),
        discount: toDecimal(input.discount ?? Number(booking.discount)) ??
          booking.discount,
        tax: new Prisma.Decimal(totals.tax),
        total: new Prisma.Decimal(totals.total),
        items: input.items
          ? {
              create: input.items.map((item) => ({
                servicePackageId: item.servicePackageId,
                quantity: item.quantity,
                unitPrice: new Prisma.Decimal(item.unitPrice),
                discount:
                  toDecimal(item.discount ?? 0) ?? new Prisma.Decimal(0),
                total: new Prisma.Decimal(
                  item.unitPrice * item.quantity - (item.discount ?? 0),
                ),
                metadata: item.metadata,
              })),
            }
          : undefined,
        addOns: input.addOns
          ? {
              create: input.addOns.map((addon) => ({
                serviceAddonId: addon.serviceAddonId,
                quantity: addon.quantity ?? 1,
                unitPrice: new Prisma.Decimal(addon.unitPrice),
                total: new Prisma.Decimal(
                  addon.total ??
                    addon.unitPrice * (addon.quantity ?? 1),
                ),
                metadata: addon.metadata,
              })),
            }
          : undefined,
        approvedByAdminId: adminId,
      },
      include: {
        items: true,
        addOns: true,
      },
    });

    return updated;
  });
}

export async function updateBookingStatus(
  bookingId: string,
  input: UpdateBookingStatusInput,
  adminId: string,
) {
  const booking = await getBooking(bookingId);

  return prisma.$transaction(async (tx) => {
    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: input.status,
        approvedByAdminId: adminId,
        timelineEvents: {
          create: {
            status: input.status,
            notes: input.notes ?? `Status changed to ${input.status}`,
          },
        },
      },
    });

    if (input.status === "COMPLETED" && !booking.completedAt) {
      await tx.booking.update({
        where: { id: bookingId },
        data: { completedAt: new Date() },
      });
    }

    if (input.status === "CANCELLED" && !booking.cancelledAt) {
      await tx.booking.update({
        where: { id: bookingId },
        data: { cancelledAt: new Date() },
      });
    }

    return updated;
  });
}

export async function assignCleaner(
  bookingId: string,
  input: AssignCleanerInput,
) {
  await getBooking(bookingId);

  return prisma.cleanerAssignment.create({
    data: {
      bookingId,
      cleanerId: input.cleanerId,
      status: input.status,
      notes: input.notes,
    },
    include: {
      cleaner: true,
    },
  });
}

export async function updateAssignment(
  assignmentId: string,
  input: UpdateAssignmentInput,
) {
  const data: Prisma.CleanerAssignmentUpdateInput = {};
  if (input.cleanerId) {
    data.cleaner = { connect: { id: input.cleanerId } };
  }
  if (input.status) {
    data.status = input.status;
    if (input.status === "STARTED") {
      data.startedAt = new Date();
    }
    if (input.status === "COMPLETED") {
      data.completedAt = new Date();
    }
  }
  if (input.notes !== undefined) data.notes = input.notes;

  return prisma.cleanerAssignment.update({
    where: { id: assignmentId },
    data,
    include: {
      cleaner: true,
    },
  });
}

export async function getBookingSummary(bookingId: string) {
  const booking = await getBooking(bookingId);

  const rewards = await prisma.rewardTransaction.aggregate({
    where: { bookingId },
    _sum: { points: true },
  });

  return {
    booking,
    rewardPoints: rewards._sum.points ?? 0,
  };
}

