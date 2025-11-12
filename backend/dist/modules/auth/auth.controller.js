"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.currentAdmin = currentAdmin;
exports.createAdminHandler = createAdminHandler;
exports.listAdminsHandler = listAdminsHandler;
exports.updateAdminHandler = updateAdminHandler;
const auth_service_1 = require("./auth.service");
async function login(req, res) {
    const { email, password } = req.body;
    const result = await (0, auth_service_1.loginAdmin)(email, password);
    res.json({
        success: true,
        data: result,
    });
}
function currentAdmin(req, res) {
    res.json({
        success: true,
        data: req.admin,
    });
}
async function createAdminHandler(req, res) {
    const admin = await (0, auth_service_1.createAdmin)(req.body);
    res.status(201).json({
        success: true,
        data: admin,
    });
}
async function listAdminsHandler(_req, res) {
    const admins = await (0, auth_service_1.listAdmins)();
    res.json({
        success: true,
        data: admins,
    });
}
async function updateAdminHandler(req, res) {
    const admin = await (0, auth_service_1.updateAdmin)(req.params.id, req.body);
    res.json({
        success: true,
        data: admin,
    });
}
