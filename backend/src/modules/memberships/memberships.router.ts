import { Router } from "express";
import { AdminRole } from "../../generated/prisma/client";
import validateRequest from "../../middlewares/validate-request";
import { requireAdmin } from "../../middlewares/require-admin";
import {
  assignMembershipHandler,
  createMembershipPlanHandler,
  deleteMembershipPlanHandler,
  getCustomerMemberships,
  getMembershipPlans,
  updateCustomerMembershipHandler,
  updateMembershipPlanHandler,
} from "./memberships.controller";
import {
  assignMembershipSchema,
  membershipPlanSchema,
  updateCustomerMembershipSchema,
  updateMembershipPlanSchema,
} from "./memberships.schema";

const router = Router();

const manageRoles = [AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS];

router.get("/plans", requireAdmin(), getMembershipPlans);
router.post(
  "/plans",
  requireAdmin(manageRoles),
  validateRequest(membershipPlanSchema),
  createMembershipPlanHandler,
);

router.patch(
  "/plans/:planId",
  requireAdmin(manageRoles),
  validateRequest(updateMembershipPlanSchema),
  updateMembershipPlanHandler,
);

router.delete(
  "/plans/:planId",
  requireAdmin([AdminRole.SUPER_ADMIN]),
  deleteMembershipPlanHandler,
);

router.get(
  "/members",
  requireAdmin(manageRoles),
  getCustomerMemberships,
);

router.post(
  "/members",
  requireAdmin(manageRoles),
  validateRequest(assignMembershipSchema),
  assignMembershipHandler,
);

router.patch(
  "/members/:id",
  requireAdmin(manageRoles),
  validateRequest(updateCustomerMembershipSchema),
  updateCustomerMembershipHandler,
);

export default router;

