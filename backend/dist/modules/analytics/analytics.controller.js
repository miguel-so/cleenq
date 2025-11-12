"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverviewHandler = getOverviewHandler;
const analytics_service_1 = require("./analytics.service");
async function getOverviewHandler(_req, res) {
    const data = await (0, analytics_service_1.getAdminOverview)();
    res.json({ success: true, data });
}
