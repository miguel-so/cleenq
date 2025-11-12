"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerQuerySchema = exports.updateCustomerSchema = exports.customerSchema = void 0;
const zod_1 = require("zod");
exports.customerSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(2),
    lastName: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.updateCustomerSchema = exports.customerSchema.partial();
exports.customerQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(50),
    cursor: zod_1.z.string().uuid().optional(),
});
