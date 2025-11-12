"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = loginAdmin;
exports.createAdmin = createAdmin;
exports.listAdmins = listAdmins;
exports.updateAdmin = updateAdmin;
const client_1 = require("../../generated/prisma/client");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const app_error_1 = __importDefault(require("../../utils/app-error"));
const jwt_1 = require("../../utils/jwt");
const password_1 = require("../../utils/password");
async function loginAdmin(email, password) {
    const admin = await prisma_1.default.admin.findUnique({
        where: { email },
    });
    if (!admin || admin.status !== client_1.AdminStatus.ACTIVE) {
        throw new app_error_1.default("Invalid email or password", 401);
    }
    const isValid = await (0, password_1.comparePassword)(password, admin.passwordHash);
    if (!isValid) {
        throw new app_error_1.default("Invalid email or password", 401);
    }
    const token = (0, jwt_1.signAdminToken)({
        sub: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
    });
    await prisma_1.default.admin.update({
        where: { id: admin.id },
        data: { lastLoginAt: new Date() },
    });
    return {
        token,
        admin: {
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
            role: admin.role,
        },
    };
}
async function createAdmin(input) {
    const existing = await prisma_1.default.admin.findUnique({
        where: { email: input.email },
    });
    if (existing) {
        throw new app_error_1.default("Admin with this email already exists", 409);
    }
    const passwordHash = await (0, password_1.hashPassword)(input.password);
    const admin = await prisma_1.default.admin.create({
        data: {
            email: input.email,
            fullName: input.fullName,
            role: input.role,
            passwordHash,
        },
        select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            status: true,
            createdAt: true,
        },
    });
    return admin;
}
async function listAdmins() {
    return prisma_1.default.admin.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            status: true,
            lastLoginAt: true,
            createdAt: true,
        },
    });
}
async function updateAdmin(id, updates) {
    const data = {};
    if (updates.fullName)
        data.fullName = updates.fullName;
    if (updates.role)
        data.role = updates.role;
    if (updates.status)
        data.status = updates.status;
    if (updates.email)
        data.email = updates.email;
    if (updates.password) {
        data.passwordHash = await (0, password_1.hashPassword)(updates.password);
    }
    const admin = await prisma_1.default.admin.update({
        where: { id },
        data,
        select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            status: true,
            updatedAt: true,
        },
    });
    return admin;
}
