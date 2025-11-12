import { Router } from "express";
import { AdminRole } from "../../generated/prisma/client";
import validateRequest from "../../middlewares/validate-request";
import { requireAdmin } from "../../middlewares/require-admin";
import {
  assignCleanerHandler,
  createBookingHandler,
  getBookingHandler,
  getBookingSummaryHandler,
  listBookingsHandler,
  updateAssignmentHandler,
  updateBookingHandler,
  updateBookingStatusHandler,
} from "./bookings.controller";
import {
  assignCleanerSchema,
  bookingQuerySchema,
  createBookingSchema,
  updateAssignmentSchema,
  updateBookingSchema,
  updateBookingStatusSchema,
} from "./bookings.schema";

const router = Router();
const manageRoles = [AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS];

router.get(
  "/",
  requireAdmin(),
  validateRequest(bookingQuerySchema, "query"),
  listBookingsHandler,
);

router.post(
  "/",
  requireAdmin(manageRoles),
  validateRequest(createBookingSchema),
  createBookingHandler,
);

router.get("/:bookingId", requireAdmin(), getBookingHandler);

router.patch(
  "/:bookingId",
  requireAdmin(manageRoles),
  validateRequest(updateBookingSchema),
  updateBookingHandler,
);

router.patch(
  "/:bookingId/status",
  requireAdmin(manageRoles),
  validateRequest(updateBookingStatusSchema),
  updateBookingStatusHandler,
);

router.get(
  "/:bookingId/summary",
  requireAdmin(),
  getBookingSummaryHandler,
);

router.post(
  "/:bookingId/assignments",
  requireAdmin(manageRoles),
  validateRequest(assignCleanerSchema),
  assignCleanerHandler,
);

router.patch(
  "/:bookingId/assignments/:assignmentId",
  requireAdmin(manageRoles),
  validateRequest(updateAssignmentSchema),
  updateAssignmentHandler,
);

export default router;

