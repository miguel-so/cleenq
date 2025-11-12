"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = __importDefault(require("../config/env"));
async function hashPassword(plain) {
    const salt = await bcryptjs_1.default.genSalt(env_1.default.PASSWORD_SALT_ROUNDS);
    return bcryptjs_1.default.hash(plain, salt);
}
function comparePassword(plain, hashed) {
    return bcryptjs_1.default.compare(plain, hashed);
}
