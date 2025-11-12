import app from "./app";
import env from "./config/env";
import logger from "./lib/logger";

const port = env.PORT;

const server = app.listen(port, () => {
  logger.info(`🚀 CleenQ API running on port ${port}`);
});

const shutdown = (signal: string) => {
  logger.warn(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled promise rejection");
});
process.on("uncaughtException", (error) => {
  logger.error({ error }, "Uncaught exception");
  shutdown("uncaughtException");
});

