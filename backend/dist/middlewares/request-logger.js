"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_http_1 = __importDefault(require("pino-http"));
const env_1 = __importDefault(require("../config/env"));
const logger_1 = __importDefault(require("../lib/logger"));
const requestLogger = (0, pino_http_1.default)({
    logger: logger_1.default,
    autoLogging: env_1.default.NODE_ENV !== "test",
    redact: ["req.headers.authorization"],
});
exports.default = requestLogger;
