import { Prisma } from "../../generated/prisma/client";
import prisma from "../../lib/prisma";
import AppError from "../../utils/app-error";
import type {
  CustomerInput,
  CustomerQueryInput,
  UpdateCustomerInput,
} from "./customers.schema";

export async function listCustomers(query: CustomerQueryInput) {
  const where: Prisma.CustomerWhereInput | undefined = query.search
    ? {
        OR: [
          {
            firstName: {
              contains: query.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            lastName: {
              contains: query.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            email: {
              contains: query.search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }
    : undefined;

  const [customers, total] = await prisma.$transaction([
    prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: query.limit,
      skip: query.cursor ? 1 : 0,
      cursor: query.cursor ? { id: query.cursor } : undefined,
      include: {
        memberships: {
          include: { membershipPlan: true },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  const nextCursor =
    customers.length === query.limit
      ? customers[customers.length - 1]?.id
      : undefined;

  return {
    data: customers,
    meta: {
      total,
      limit: query.limit,
      cursor: query.cursor ?? null,
      nextCursor: nextCursor ?? null,
      hasMore: Boolean(nextCursor),
    },
  };
}

export async function getCustomer(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      memberships: {
        include: { membershipPlan: true },
        orderBy: { createdAt: "desc" },
      },
      bookings: {
        select: {
          id: true,
          reference: true,
          status: true,
          scheduledAt: true,
          total: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      rewardTransactions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  const points = await prisma.rewardTransaction.aggregate({
    where: { customerId: id },
    _sum: { points: true },
  });

  return {
    ...customer,
    rewardPoints: points._sum.points ?? 0,
  };
}

export async function createCustomer(input: CustomerInput) {
  return prisma.customer.create({
    data: input,
  });
}

export async function updateCustomer(id: string, input: UpdateCustomerInput) {
  return prisma.customer.update({
    where: { id },
    data: input,
  });
}

export async function deleteCustomer(id: string) {
  const bookings = await prisma.booking.count({
    where: { customerId: id },
  });

  if (bookings > 0) {
    throw new AppError(
      "Cannot delete customer with existing bookings. Archive instead.",
      409,
    );
  }

  await prisma.customer.delete({
    where: { id },
  });
}

