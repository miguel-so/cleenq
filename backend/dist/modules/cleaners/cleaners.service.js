"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCleaners = listCleaners;
exports.getCleaner = getCleaner;
exports.createCleaner = createCleaner;
exports.updateCleaner = updateCleaner;
exports.deleteCleaner = deleteCleaner;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const app_error_1 = __importDefault(require("../../utils/app-error"));
async function listCleaners() {
    const [cleaners, total] = await prisma_1.default.$transaction([
        prisma_1.default.cleaner.findMany({
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.default.cleaner.count(),
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
function getCleaner(id) {
    return prisma_1.default.cleaner.findUnique({
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
async function createCleaner(input) {
    return prisma_1.default.cleaner.create({
        data: input,
    });
}
async function updateCleaner(cleanerId, input) {
    return prisma_1.default.cleaner.update({
        where: { id: cleanerId },
        data: input,
    });
}
async function deleteCleaner(cleanerId) {
    const assigned = await prisma_1.default.cleanerAssignment.count({
        where: {
            cleanerId,
            status: {
                in: ["PENDING", "ACCEPTED", "STARTED"],
            },
        },
    });
    if (assigned > 0) {
        throw new app_error_1.default("Cannot delete cleaner with active assignments. Reassign bookings first.", 409);
    }
    await prisma_1.default.cleanerAssignment.deleteMany({
        where: { cleanerId },
    });
    await prisma_1.default.cleaner.delete({
        where: { id: cleanerId },
    });
}
