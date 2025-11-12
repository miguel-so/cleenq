"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const logger_1 = __importDefault(require("../lib/logger"));
const app_error_1 = __importDefault(require("../utils/app-error"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err, req, res, _next) => {
    let status = 500;
    let message = "Internal server error";
    let details;
    if (err instanceof app_error_1.default) {
        status = err.statusCode;
        message = err.message;
        details = err.details;
    }
    else if (err instanceof zod_1.ZodError) {
        status = 400;
        message = "Validation failed";
        details = err.flatten();
    }
    else if (err instanceof Error) {
        message = err.message;
    }
    logger_1.default.error({
        err,
        path: req.path,
        method: req.method,
        status,
        details,
    }, "Request failed");
    res.status(status).json({
        success: false,
        message,
        details,
    });
};
exports.default = errorHandler;
