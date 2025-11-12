import type { AdminRole } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface AuthenticatedAdmin {
      id: string;
      email: string;
      fullName: string;
      role: AdminRole;
    }

    interface Request {
      admin?: AuthenticatedAdmin;
    }
  }
}

export {};

