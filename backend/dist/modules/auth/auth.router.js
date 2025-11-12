"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("../../generated/prisma/client");
const validate_request_1 = __importDefault(require("../../middlewares/validate-request"));
const require_admin_1 = require("../../middlewares/require-admin");
const auth_controller_1 = require("./auth.controller");
const auth_schema_1 = require("./auth.schema");
const router = (0, express_1.Router)();
router.post("/login", (0, validate_request_1.default)(auth_schema_1.loginSchema), auth_controller_1.login);
router.get("/me", (0, require_admin_1.requireAdmin)(), auth_controller_1.currentAdmin);
router.get("/admins", (0, require_admin_1.requireAdmin)([client_1.AdminRole.SUPER_ADMIN]), auth_controller_1.listAdminsHandler);
router.post("/admins", (0, require_admin_1.requireAdmin)([client_1.AdminRole.SUPER_ADMIN]), (0, validate_request_1.default)(auth_schema_1.createAdminSchema), auth_controller_1.createAdminHandler);
router.patch("/admins/:id", (0, require_admin_1.requireAdmin)([client_1.AdminRole.SUPER_ADMIN]), (0, validate_request_1.default)(auth_schema_1.updateAdminSchema), auth_controller_1.updateAdminHandler);
exports.default = router;
