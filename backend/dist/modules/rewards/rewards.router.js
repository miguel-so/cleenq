"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("../../generated/prisma/client");
const validate_request_1 = __importDefault(require("../../middlewares/validate-request"));
const require_admin_1 = require("../../middlewares/require-admin");
const rewards_controller_1 = require("./rewards.controller");
const rewards_schema_1 = require("./rewards.schema");
const router = (0, express_1.Router)();
const manageRoles = [client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.OPERATIONS];
router.get("/settings", (0, require_admin_1.requireAdmin)(), rewards_controller_1.getRewardsSettingsHandler);
router.put("/settings", (0, require_admin_1.requireAdmin)(manageRoles), (0, validate_request_1.default)(rewards_schema_1.rewardSettingsSchema), rewards_controller_1.updateRewardsSettingsHandler);
router.get("/transactions", (0, require_admin_1.requireAdmin)(), (0, validate_request_1.default)(rewards_schema_1.rewardQuerySchema, "query"), rewards_controller_1.listRewardTransactionsHandler);
router.post("/adjustments", (0, require_admin_1.requireAdmin)(manageRoles), (0, validate_request_1.default)(rewards_schema_1.adjustPointsSchema), rewards_controller_1.adjustRewardPointsHandler);
router.get("/customers/:customerId/summary", (0, require_admin_1.requireAdmin)(), rewards_controller_1.getCustomerRewardSummaryHandler);
exports.default = router;
