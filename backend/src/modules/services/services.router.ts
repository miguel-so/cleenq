import { Router } from "express";
import { AdminRole } from "../../generated/prisma/client";
import validateRequest from "../../middlewares/validate-request";
import { requireAdmin } from "../../middlewares/require-admin";
import {
  createAddon,
  createPackage,
  createSegment,
  createService,
  deleteAddon,
  deletePackage,
  deleteSegment,
  deleteService,
  listServices,
  updateAddon,
  updatePackage,
  updateSegment,
  updateService,
} from "./services.controller";
import {
  serviceAddonSchema,
  serviceCategorySchema,
  servicePackageSchema,
  serviceSegmentSchema,
  updateServiceAddonSchema,
  updateServiceCategorySchema,
  updateServicePackageSchema,
  updateServiceSegmentSchema,
} from "./services.schema";

const router = Router();

const manageRoles = [AdminRole.SUPER_ADMIN, AdminRole.OPERATIONS];

router.get("/", requireAdmin(), listServices);

router.post(
  "/",
  requireAdmin(manageRoles),
  validateRequest(serviceCategorySchema),
  createService,
);

router.patch(
  "/:serviceId",
  requireAdmin(manageRoles),
  validateRequest(updateServiceCategorySchema),
  updateService,
);

router.delete(
  "/:serviceId",
  requireAdmin([AdminRole.SUPER_ADMIN]),
  deleteService,
);

router.post(
  "/:serviceId/segments",
  requireAdmin(manageRoles),
  validateRequest(serviceSegmentSchema),
  createSegment,
);

router.patch(
  "/:serviceId/segments/:segmentId",
  requireAdmin(manageRoles),
  validateRequest(updateServiceSegmentSchema),
  updateSegment,
);

router.delete(
  "/:serviceId/segments/:segmentId",
  requireAdmin(manageRoles),
  deleteSegment,
);

router.post(
  "/:serviceId/packages",
  requireAdmin(manageRoles),
  validateRequest(servicePackageSchema),
  createPackage,
);

router.patch(
  "/:serviceId/packages/:packageId",
  requireAdmin(manageRoles),
  validateRequest(updateServicePackageSchema),
  updatePackage,
);

router.delete(
  "/:serviceId/packages/:packageId",
  requireAdmin(manageRoles),
  deletePackage,
);

router.post(
  "/:serviceId/addons",
  requireAdmin(manageRoles),
  validateRequest(serviceAddonSchema),
  createAddon,
);

router.patch(
  "/:serviceId/addons/:addonId",
  requireAdmin(manageRoles),
  validateRequest(updateServiceAddonSchema),
  updateAddon,
);

router.delete(
  "/:serviceId/addons/:addonId",
  requireAdmin(manageRoles),
  deleteAddon,
);

export default router;

