import { z } from "zod";
import {
  AssignmentStatus,
  BookingStatus,
} from "../../generated/prisma/client";

const money = z.number().min(0);

const bookingItemSchema = z.object({
  servicePackageId: z.string().uuid(),
  quantity: z.number().positive().default(1),
  unitPrice: money,
  discount: money.default(0),
  metadata: z.any().optional(),
});

const bookingAddonSchema = z.object({
  serviceAddonId: z.string().uuid(),
  quantity: z.number().positive().default(1),
  unitPrice: money,
  total: money.optional(),
  metadata: z.any().optional(),
});

export const createBookingSchema = z.object({
  customerId: z.string().uuid(),
  serviceCategoryId: z.string().uuid(),
  membershipPlanId: z.string().uuid().optional(),
  bookedVia: z.string().optional(),
  scheduledAt: z.union([z.string(), z.date()]).transform((val) =>
    val ? new Date(val) : undefined,
  ),
  durationMinutes: z.number().int().positive().optional(),
  status: z.nativeEnum(BookingStatus).default(BookingStatus.PENDING),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  notes: z.string().optional(),
  subtotal: money.optional(),
  discount: money.optional(),
  tax: money.optional(),
  total: money.optional(),
  items: z.array(bookingItemSchema).min(1),
  addOns: z.array(bookingAddonSchema).optional(),
});

export const updateBookingSchema = createBookingSchema
  .partial()
  .extend({
    status: z.nativeEnum(BookingStatus).optional(),
    items: z.array(bookingItemSchema).optional(),
  });

export const updateBookingStatusSchema = z.object({
  status: z.nativeEnum(BookingStatus),
  notes: z.string().optional(),
});

export const assignCleanerSchema = z.object({
  cleanerId: z.string().uuid(),
  status: z.nativeEnum(AssignmentStatus).default(AssignmentStatus.PENDING),
  notes: z.string().optional(),
});

export const updateAssignmentSchema = assignCleanerSchema.partial();

export const bookingQuerySchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  serviceCategoryId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  cursor: z.string().uuid().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type UpdateBookingStatusInput = z.infer<
  typeof updateBookingStatusSchema
>;
export type AssignCleanerInput = z.infer<typeof assignCleanerSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
export type BookingQueryInput = z.infer<typeof bookingQuerySchema>;

