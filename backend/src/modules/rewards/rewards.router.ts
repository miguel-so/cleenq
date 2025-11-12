import { Router } from "express";
import { AdminRole } from "../../generated/prisma/client";
import validateRequest from "../../middlewares/validate-request";
import { requireAdmin } from "../../middlewares/require-admin";
import {
  adjustRewardPointsHandler,
  getCustomerRewardSummaryHandler,
  getRewardsSettingsHandler,
  listRewardTransactionsHandler,
  updateRewardsSettingsHandler,
} from "./rewards.controller";
import {
  adjustPointsSchema,
  rewardQuerySchema,
  rewardSettingsSchema,
} from "./rewards.schema";

const router = Router();
const manageRoles = [AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS];

router.get("/settings", requireAdmin(), getRewardsSettingsHandler);

router.put(
  "/settings",
  requireAdmin(manageRoles),
  validateRequest(rewardSettingsSchema),
  updateRewardsSettingsHandler,
);

router.get(
  "/transactions",
  requireAdmin(),
  validateRequest(rewardQuerySchema, "query"),
  listRewardTransactionsHandler,
);

router.post(
  "/adjustments",
  requireAdmin(manageRoles),
  validateRequest(adjustPointsSchema),
  adjustRewardPointsHandler,
);

router.get(
  "/customers/:customerId/summary",
  requireAdmin(),
  getCustomerRewardSummaryHandler,
);

export default router;

