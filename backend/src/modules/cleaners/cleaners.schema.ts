import { z } from "zod";
import { CleanerStatus } from "../../generated/prisma/client";

export const cleanerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.nativeEnum(CleanerStatus).default(CleanerStatus.ACTIVE),
  notes: z.string().optional(),
});

export const updateCleanerSchema = cleanerSchema.partial();

export type CleanerInput = z.infer<typeof cleanerSchema>;
export type UpdateCleanerInput = z.infer<typeof updateCleanerSchema>;

