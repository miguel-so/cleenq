import prisma from "../../lib/prisma";

export async function getAdminOverview() {
  const [
    statusCounts,
    revenueAggregate,
    customerCount,
    cleanerCount,
    serviceCount,
    recentBookings,
    serviceBookings,
  ] = await prisma.$transaction([
    prisma.booking.groupBy({
      by: ["status"],
      orderBy: {
        status: "asc",
      },
      _count: {
        status: true,
      },
    }),
    prisma.booking.aggregate({
      _sum: {
        total: true,
      },
    }),
    prisma.customer.count(),
    prisma.cleaner.count(),
    prisma.serviceCategory.count({
      where: { isActive: true },
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        serviceCategory: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
    prisma.booking.groupBy({
      by: ["serviceCategoryId"],
      _count: {
        serviceCategoryId: true,
      },
      orderBy: {
        _count: {
          serviceCategoryId: "desc",
        },
      },
      take: 5,
    }),
  ]);

  const statusMap = statusCounts.reduce<Record<string, number>>(
    (acc, item) => {
      const count =
        typeof item._count === "object" && item._count
          ? item._count.status ?? 0
          : 0;
      acc[item.status] = count;
      return acc;
    },
    {},
  );

  const serviceIds = serviceBookings
    .map((group) => group.serviceCategoryId)
    .filter((id): id is string => Boolean(id));

  const services = await prisma.serviceCategory.findMany({
    where: { id: { in: serviceIds } },
    select: { id: true, name: true, slug: true },
  });

  const serviceMap = new Map(services.map((service) => [service.id, service]));

  const topServices = serviceBookings
    .map((group) => {
      const count =
        typeof group._count === "object" && group._count
          ? group._count.serviceCategoryId ?? 0
          : 0;
      return {
        service: serviceMap.get(group.serviceCategoryId ?? ""),
        totalBookings: count,
      };
    })
    .filter((item) => Boolean(item.service));

  return {
    metrics: {
      bookings: {
        total: statusCounts.reduce((sum, item) => {
          const count =
            typeof item._count === "object" && item._count
              ? item._count.status ?? 0
              : 0;
          return sum + count;
        }, 0),
        pending: statusMap.PENDING ?? 0,
        confirmed: statusMap.CONFIRMED ?? 0,
        scheduled: statusMap.SCHEDULED ?? 0,
        inProgress: statusMap.IN_PROGRESS ?? 0,
        completed: statusMap.COMPLETED ?? 0,
        cancelled: statusMap.CANCELLED ?? 0,
      },
      revenue: Number(revenueAggregate._sum.total ?? 0),
      customers: customerCount,
      cleaners: cleanerCount,
      activeServices: serviceCount,
    },
    recentBookings,
    topServices,
  };
}

