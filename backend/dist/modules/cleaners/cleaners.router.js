"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("../../generated/prisma/client");
const validate_request_1 = __importDefault(require("../../middlewares/validate-request"));
const require_admin_1 = require("../../middlewares/require-admin");
const cleaners_controller_1 = require("./cleaners.controller");
const cleaners_schema_1 = require("./cleaners.schema");
const router = (0, express_1.Router)();
const manageRoles = [client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.OPERATIONS];
router.get("/", (0, require_admin_1.requireAdmin)(), cleaners_controller_1.listCleanersHandler);
router.get("/:cleanerId", (0, require_admin_1.requireAdmin)(), cleaners_controller_1.getCleanerHandler);
router.post("/", (0, require_admin_1.requireAdmin)(manageRoles), (0, validate_request_1.default)(cleaners_schema_1.cleanerSchema), cleaners_controller_1.createCleanerHandler);
router.patch("/:cleanerId", (0, require_admin_1.requireAdmin)(manageRoles), (0, validate_request_1.default)(cleaners_schema_1.updateCleanerSchema), cleaners_controller_1.updateCleanerHandler);
router.delete("/:cleanerId", (0, require_admin_1.requireAdmin)([client_1.AdminRole.SUPER_ADMIN]), cleaners_controller_1.deleteCleanerHandler);
exports.default = router;
