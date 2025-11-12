"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = __importDefault(require("./config/env"));
const logger_1 = __importDefault(require("./lib/logger"));
const port = env_1.default.PORT;
const server = app_1.default.listen(port, () => {
    logger_1.default.info(`🚀 CleenQ API running on port ${port}`);
});
const shutdown = (signal) => {
    logger_1.default.warn(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
        logger_1.default.info("HTTP server closed.");
        process.exit(0);
    });
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => {
    logger_1.default.error({ reason }, "Unhandled promise rejection");
});
process.on("uncaughtException", (error) => {
    logger_1.default.error({ error }, "Uncaught exception");
    shutdown("uncaughtException");
});
