"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = __importDefault(require("./config/env"));
const error_handler_1 = __importDefault(require("./middlewares/error-handler"));
const request_logger_1 = __importDefault(require("./middlewares/request-logger"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const allowedOrigins = env_1.default.CORS_ORIGIN
    ? env_1.default.CORS_ORIGIN.split(",").map((origin) => origin.trim())
    : undefined;
app.set("trust proxy", true);
app.use((0, cors_1.default)({
    origin: allowedOrigins ?? true,
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json({ limit: "1mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(request_logger_1.default);
app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        environment: env_1.default.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});
app.use("/api", routes_1.default);
app.use(error_handler_1.default);
exports.default = app;
