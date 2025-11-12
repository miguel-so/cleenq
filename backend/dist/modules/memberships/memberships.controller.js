"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMembershipPlans = getMembershipPlans;
exports.createMembershipPlanHandler = createMembershipPlanHandler;
exports.updateMembershipPlanHandler = updateMembershipPlanHandler;
exports.deleteMembershipPlanHandler = deleteMembershipPlanHandler;
exports.getCustomerMemberships = getCustomerMemberships;
exports.assignMembershipHandler = assignMembershipHandler;
exports.updateCustomerMembershipHandler = updateCustomerMembershipHandler;
const memberships_service_1 = require("./memberships.service");
async function getMembershipPlans(_req, res) {
    const plans = await (0, memberships_service_1.listMembershipPlans)();
    res.json({ success: true, data: plans });
}
async function createMembershipPlanHandler(req, res) {
    const plan = await (0, memberships_service_1.createMembershipPlan)(req.body);
    res.status(201).json({ success: true, data: plan });
}
async function updateMembershipPlanHandler(req, res) {
    const plan = await (0, memberships_service_1.updateMembershipPlan)(req.params.planId, req.body);
    res.json({ success: true, data: plan });
}
async function deleteMembershipPlanHandler(req, res) {
    await (0, memberships_service_1.deleteMembershipPlan)(req.params.planId);
    res.status(204).send();
}
async function getCustomerMemberships(_req, res) {
    const memberships = await (0, memberships_service_1.listCustomerMemberships)();
    res.json({ success: true, data: memberships });
}
async function assignMembershipHandler(req, res) {
    const membership = await (0, memberships_service_1.assignMembership)(req.body);
    res.status(201).json({ success: true, data: membership });
}
async function updateCustomerMembershipHandler(req, res) {
    const membership = await (0, memberships_service_1.updateCustomerMembership)(req.params.id, req.body);
    res.json({ success: true, data: membership });
}
