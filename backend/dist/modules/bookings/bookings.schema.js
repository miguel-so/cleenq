"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingQuerySchema = exports.updateAssignmentSchema = exports.assignCleanerSchema = exports.updateBookingStatusSchema = exports.updateBookingSchema = exports.createBookingSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("../../generated/prisma/client");
const money = zod_1.z.number().min(0);
const bookingItemSchema = zod_1.z.object({
    servicePackageId: zod_1.z.string().uuid(),
    quantity: zod_1.z.number().positive().default(1),
    unitPrice: money,
    discount: money.default(0),
    metadata: zod_1.z.any().optional(),
});
const bookingAddonSchema = zod_1.z.object({
    serviceAddonId: zod_1.z.string().uuid(),
    quantity: zod_1.z.number().positive().default(1),
    unitPrice: money,
    total: money.optional(),
    metadata: zod_1.z.any().optional(),
});
exports.createBookingSchema = zod_1.z.object({
    customerId: zod_1.z.string().uuid(),
    serviceCategoryId: zod_1.z.string().uuid(),
    membershipPlanId: zod_1.z.string().uuid().optional(),
    bookedVia: zod_1.z.string().optional(),
    scheduledAt: zod_1.z.union([zod_1.z.string(), zod_1.z.date()]).transform((val) => val ? new Date(val) : undefined),
    durationMinutes: zod_1.z.number().int().positive().optional(),
    status: zod_1.z.nativeEnum(client_1.BookingStatus).default(client_1.BookingStatus.PENDING),
    addressLine1: zod_1.z.string().optional(),
    addressLine2: zod_1.z.string().optional(),
    suburb: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    postcode: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    subtotal: money.optional(),
    discount: money.optional(),
    tax: money.optional(),
    total: money.optional(),
    items: zod_1.z.array(bookingItemSchema).min(1),
    addOns: zod_1.z.array(bookingAddonSchema).optional(),
});
exports.updateBookingSchema = exports.createBookingSchema
    .partial()
    .extend({
    status: zod_1.z.nativeEnum(client_1.BookingStatus).optional(),
    items: zod_1.z.array(bookingItemSchema).optional(),
});
exports.updateBookingStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.BookingStatus),
    notes: zod_1.z.string().optional(),
});
exports.assignCleanerSchema = zod_1.z.object({
    cleanerId: zod_1.z.string().uuid(),
    status: zod_1.z.nativeEnum(client_1.AssignmentStatus).default(client_1.AssignmentStatus.PENDING),
    notes: zod_1.z.string().optional(),
});
exports.updateAssignmentSchema = exports.assignCleanerSchema.partial();
exports.bookingQuerySchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.BookingStatus).optional(),
    serviceCategoryId: zod_1.z.string().uuid().optional(),
    customerId: zod_1.z.string().uuid().optional(),
    search: zod_1.z.string().optional(),
    dateFrom: zod_1.z.string().optional(),
    dateTo: zod_1.z.string().optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(50),
    cursor: zod_1.z.string().uuid().optional(),
});
