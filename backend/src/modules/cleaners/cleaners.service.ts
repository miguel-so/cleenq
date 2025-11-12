import prisma from "../../lib/prisma";
import AppError from "../../utils/app-error";
import type {
  CleanerInput,
  UpdateCleanerInput,
} from "./cleaners.schema";

export async function listCleaners() {
  const [cleaners, total] = await prisma.$transaction([
    prisma.cleaner.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.cleaner.count(),
  ]);

  return {
    data: cleaners,
    meta: {
      total,
      limit: cleaners.length,
      cursor: null,
      nextCursor: null,
      hasMore: false,
    },
  };
}

export function getCleaner(id: string) {
  return prisma.cleaner.findUnique({
    where: { id },
    include: {
      assignments: {
        include: {
          booking: {
            select: {
              id: true,
              reference: true,
              status: true,
              scheduledAt: true,
            },
          },
        },
      },
    },
  });
}

export async function createCleaner(input: CleanerInput) {
  return prisma.cleaner.create({
    data: input,
  });
}

export async function updateCleaner(
  cleanerId: string,
  input: UpdateCleanerInput,
) {
  return prisma.cleaner.update({
    where: { id: cleanerId },
    data: input,
  });
}

export async function deleteCleaner(cleanerId: string) {
  const assigned = await prisma.cleanerAssignment.count({
    where: {
      cleanerId,
      status: {
        in: ["PENDING", "ACCEPTED", "STARTED"],
      },
    },
  });

  if (assigned > 0) {
    throw new AppError(
      "Cannot delete cleaner with active assignments. Reassign bookings first.",
      409,
    );
  }

  await prisma.cleanerAssignment.deleteMany({
    where: { cleanerId },
  });

  await prisma.cleaner.delete({
    where: { id: cleanerId },
  });
}

