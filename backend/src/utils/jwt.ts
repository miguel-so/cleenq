import {
  JwtPayload,
  sign,
  verify,
  type Secret,
  type SignOptions,
} from "jsonwebtoken";
import type { AdminRole } from "../generated/prisma/client";
import env from "../config/env";

export interface AdminJwtPayload extends JwtPayload {
  sub: string;
  email: string;
  fullName: string;
  role: AdminRole;
}

export function signAdminToken(payload: AdminJwtPayload) {
  const secret: Secret = env.JWT_SECRET;
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return sign(payload as Record<string, unknown>, secret, options);
}

export function verifyAdminToken(token: string): AdminJwtPayload {
  const secret: Secret = env.JWT_SECRET;
  const decoded = verify(token, secret) as AdminJwtPayload;
  return decoded;
}

