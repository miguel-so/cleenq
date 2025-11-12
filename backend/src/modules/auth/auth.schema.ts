import { z } from "zod";
import { AdminRole, AdminStatus } from "../../generated/prisma";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters"),
});

export const createAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  role: z.nativeEnum(AdminRole).default(AdminRole.OPERATIONS),
});

export const updateAdminSchema = createAdminSchema
  .partial()
  .pick({ password: true, fullName: true, role: true, email: true })
  .extend({
    status: z.nativeEnum(AdminStatus).optional(),
  });

