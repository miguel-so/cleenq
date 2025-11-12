import { Router } from "express";
import { AdminRole } from "../../generated/prisma/client";
import validateRequest from "../../middlewares/validate-request";
import { requireAdmin } from "../../middlewares/require-admin";
import {
  createCleanerHandler,
  deleteCleanerHandler,
  getCleanerHandler,
  listCleanersHandler,
  updateCleanerHandler,
} from "./cleaners.controller";
import {
  cleanerSchema,
  updateCleanerSchema,
} from "./cleaners.schema";

const router = Router();
const manageRoles = [AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS];

router.get("/", requireAdmin(), listCleanersHandler);
router.get("/:cleanerId", requireAdmin(), getCleanerHandler);

router.post(
  "/",
  requireAdmin(manageRoles),
  validateRequest(cleanerSchema),
  createCleanerHandler,
);

router.patch(
  "/:cleanerId",
  requireAdmin(manageRoles),
  validateRequest(updateCleanerSchema),
  updateCleanerHandler,
);

router.delete(
  "/:cleanerId",
  requireAdmin([AdminRole.SUPER_ADMIN]),
  deleteCleanerHandler,
);

export default router;

