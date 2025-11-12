"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRewardsSettingsHandler = getRewardsSettingsHandler;
exports.updateRewardsSettingsHandler = updateRewardsSettingsHandler;
exports.listRewardTransactionsHandler = listRewardTransactionsHandler;
exports.adjustRewardPointsHandler = adjustRewardPointsHandler;
exports.getCustomerRewardSummaryHandler = getCustomerRewardSummaryHandler;
const rewards_service_1 = require("./rewards.service");
async function getRewardsSettingsHandler(_req, res) {
    const settings = await (0, rewards_service_1.getRewardSettings)();
    res.json({ success: true, data: settings });
}
async function updateRewardsSettingsHandler(req, res) {
    const settings = await (0, rewards_service_1.updateRewardSettings)(req.body);
    res.json({ success: true, data: settings });
}
async function listRewardTransactionsHandler(req, res) {
    const result = await (0, rewards_service_1.listRewardTransactions)(req.query);
    res.json({
        success: true,
        data: result.data,
        meta: result.meta,
    });
}
async function adjustRewardPointsHandler(req, res) {
    const transaction = await (0, rewards_service_1.adjustRewardPoints)(req.body, req.admin.id);
    res.status(201).json({ success: true, data: transaction });
}
async function getCustomerRewardSummaryHandler(req, res) {
    const summary = await (0, rewards_service_1.getCustomerRewardSummary)(req.params.customerId);
    res.json({ success: true, data: summary });
}
