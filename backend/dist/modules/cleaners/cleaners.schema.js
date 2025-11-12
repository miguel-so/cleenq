"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCleanerSchema = exports.cleanerSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("../../generated/prisma/client");
exports.cleanerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2),
    lastName: zod_1.z.string().min(2),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(client_1.CleanerStatus).default(client_1.CleanerStatus.ACTIVE),
    notes: zod_1.z.string().optional(),
});
exports.updateCleanerSchema = exports.cleanerSchema.partial();
