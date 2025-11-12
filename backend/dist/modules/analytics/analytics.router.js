"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const require_admin_1 = require("../../middlewares/require-admin");
const analytics_controller_1 = require("./analytics.controller");
const router = (0, express_1.Router)();
router.get("/overview", (0, require_admin_1.requireAdmin)(), analytics_controller_1.getOverviewHandler);
exports.default = router;
