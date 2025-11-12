"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("../../generated/prisma/client");
const validate_request_1 = __importDefault(require("../../middlewares/validate-request"));
const require_admin_1 = require("../../middlewares/require-admin");
const customers_controller_1 = require("./customers.controller");
const customers_schema_1 = require("./customers.schema");
const router = (0, express_1.Router)();
const manageRoles = [client_1.AdminRole.SUPER_ADMIN, client_1.AdminRole.OPERATIONS];
router.get("/", (0, require_admin_1.requireAdmin)(), (0, validate_request_1.default)(customers_schema_1.customerQuerySchema, "query"), customers_controller_1.listCustomersHandler);
router.get("/:customerId", (0, require_admin_1.requireAdmin)(), customers_controller_1.getCustomerHandler);
router.post("/", (0, require_admin_1.requireAdmin)(manageRoles), (0, validate_request_1.default)(customers_schema_1.customerSchema), customers_controller_1.createCustomerHandler);
router.patch("/:customerId", (0, require_admin_1.requireAdmin)(manageRoles), (0, validate_request_1.default)(customers_schema_1.updateCustomerSchema), customers_controller_1.updateCustomerHandler);
router.delete("/:customerId", (0, require_admin_1.requireAdmin)([client_1.AdminRole.SUPER_ADMIN]), customers_controller_1.deleteCustomerHandler);
exports.default = router;
