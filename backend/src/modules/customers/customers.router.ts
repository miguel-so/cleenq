import { Router } from "express";
import { AdminRole } from "../../generated/prisma/client";
import validateRequest from "../../middlewares/validate-request";
import { requireAdmin } from "../../middlewares/require-admin";
import {
  createCustomerHandler,
  deleteCustomerHandler,
  getCustomerHandler,
  listCustomersHandler,
  updateCustomerHandler,
} from "./customers.controller";
import {
  customerQuerySchema,
  customerSchema,
  updateCustomerSchema,
} from "./customers.schema";

const router = Router();
const manageRoles = [AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS];

router.get(
  "/",
  requireAdmin(),
  validateRequest(customerQuerySchema, "query"),
  listCustomersHandler,
);

router.get("/:customerId", requireAdmin(), getCustomerHandler);

router.post(
  "/",
  requireAdmin(manageRoles),
  validateRequest(customerSchema),
  createCustomerHandler,
);

router.patch(
  "/:customerId",
  requireAdmin(manageRoles),
  validateRequest(updateCustomerSchema),
  updateCustomerHandler,
);

router.delete(
  "/:customerId",
  requireAdmin([AdminRole.SUPER_ADMIN]),
  deleteCustomerHandler,
);

export default router;

