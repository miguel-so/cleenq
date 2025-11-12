import pinoHttp from "pino-http";
import env from "../config/env";
import logger from "../lib/logger";

const requestLogger = pinoHttp({
  logger,
  autoLogging: env.NODE_ENV !== "test",
  redact: ["req.headers.authorization"],
});

export default requestLogger;

