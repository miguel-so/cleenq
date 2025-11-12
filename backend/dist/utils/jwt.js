"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAdminToken = signAdminToken;
exports.verifyAdminToken = verifyAdminToken;
const jsonwebtoken_1 = require("jsonwebtoken");
const env_1 = __importDefault(require("../config/env"));
function signAdminToken(payload) {
    const secret = env_1.default.JWT_SECRET;
    const options = {
        expiresIn: env_1.default.JWT_EXPIRES_IN,
    };
    return (0, jsonwebtoken_1.sign)(payload, secret, options);
}
function verifyAdminToken(token) {
    const secret = env_1.default.JWT_SECRET;
    const decoded = (0, jsonwebtoken_1.verify)(token, secret);
    return decoded;
}
