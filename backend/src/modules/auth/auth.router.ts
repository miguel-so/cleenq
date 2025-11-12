import { Router } from "express";
import { AdminRole } from "../../generated/prisma/client";
import validateRequest from "../../middlewares/validate-request";
import { requireAdmin } from "../../middlewares/require-admin";
import {
  createAdminHandler,
  currentAdmin,
  listAdminsHandler,
  login,
  updateAdminHandler,
} from "./auth.controller";
import {
  createAdminSchema,
  loginSchema,
  updateAdminSchema,
} from "./auth.schema";

const router = Router();

router.post("/login", validateRequest(loginSchema), login);
router.get("/me", requireAdmin(), currentAdmin);

router.get(
  "/admins",
  requireAdmin([AdminRole.SUPER_ADMIN]),
  listAdminsHandler,
);

router.post(
  "/admins",
  requireAdmin([AdminRole.SUPER_ADMIN]),
  validateRequest(createAdminSchema),
  createAdminHandler,
);

router.patch(
  "/admins/:id",
  requireAdmin([AdminRole.SUPER_ADMIN]),
  validateRequest(updateAdminSchema),
  updateAdminHandler,
);

export default router;

