import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import logger from "../lib/logger";
import AppError from "../utils/app-error";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let status = 500;
  let message = "Internal server error";
  let details: unknown;

  if (err instanceof AppError) {
    status = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    status = 400;
    message = "Validation failed";
    details = err.flatten();
  } else if (err instanceof Error) {
    message = err.message;
  }

  logger.error(
    {
      err,
      path: req.path,
      method: req.method,
      status,
      details,
    },
    "Request failed",
  );

  res.status(status).json({
    success: false,
    message,
    details,
  });
};

export default errorHandler;

