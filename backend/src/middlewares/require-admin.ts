import { NextFunction, Request, Response } from "express";
import type { AdminRole } from "../generated/prisma/client";
import AppError from "../utils/app-error";
import { verifyAdminToken } from "../utils/jwt";

export const requireAdmin =
  (allowedRoles?: AdminRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      throw new AppError("Authentication required", 401);
    }

    const token = header.replace("Bearer ", "");

    try {
      const payload = verifyAdminToken(token);

      if (allowedRoles && !allowedRoles.includes(payload.role)) {
        throw new AppError("Forbidden", 403);
      }

      req.admin = {
        id: payload.sub,
        email: payload.email,
        fullName: payload.fullName,
        role: payload.role,
      };

      next();
    } catch (error) {
      throw new AppError("Invalid or expired token", 401, error);
    }
  };

