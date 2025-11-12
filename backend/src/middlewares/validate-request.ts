import { NextFunction, Request, Response } from "express";
import type { AnyZodObject, ZodTypeAny } from "zod";

type RequestPart = "body" | "query" | "params";

export default function validateRequest(
  schema: AnyZodObject | ZodTypeAny,
  part: RequestPart = "body",
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      return next(result.error);
    }

    req[part] = result.data as never;
    return next();
  };
}

