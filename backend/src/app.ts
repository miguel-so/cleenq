import "express-async-errors";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import env from "./config/env";
import errorHandler from "./middlewares/error-handler";
import requestLogger from "./middlewares/request-logger";
import router from "./routes";

const app = express();

const allowedOrigins = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : undefined;

app.set("trust proxy", true);

app.use(
  cors({
    origin: allowedOrigins ?? true,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", router);

app.use(errorHandler);

export default app;

