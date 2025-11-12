"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const app_error_1 = __importDefault(require("../utils/app-error"));
const jwt_1 = require("../utils/jwt");
const requireAdmin = (allowedRoles) => (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        throw new app_error_1.default("Authentication required", 401);
    }
    const token = header.replace("Bearer ", "");
    try {
        const payload = (0, jwt_1.verifyAdminToken)(token);
        if (allowedRoles && !allowedRoles.includes(payload.role)) {
            throw new app_error_1.default("Forbidden", 403);
        }
        req.admin = {
            id: payload.sub,
            email: payload.email,
            fullName: payload.fullName,
            role: payload.role,
        };
        next();
    }
    catch (error) {
        throw new app_error_1.default("Invalid or expired token", 401, error);
    }
};
exports.requireAdmin = requireAdmin;
