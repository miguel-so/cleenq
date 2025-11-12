"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminSchema = exports.createAdminSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("../../generated/prisma/client");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "Email is required",
    })
        .email(),
    password: zod_1.z
        .string({
        required_error: "Password is required",
    })
        .min(8, "Password must be at least 8 characters"),
});
exports.createAdminSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    fullName: zod_1.z.string().min(2),
    role: zod_1.z.nativeEnum(client_1.AdminRole).default(client_1.AdminRole.OPERATIONS),
});
exports.updateAdminSchema = exports.createAdminSchema
    .partial()
    .pick({ password: true, fullName: true, role: true, email: true })
    .extend({
    status: zod_1.z.nativeEnum(client_1.AdminStatus).optional(),
});
