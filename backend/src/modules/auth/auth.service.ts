import { AdminRole, AdminStatus } from "../../generated/prisma/client";
import prisma from "../../lib/prisma";
import AppError from "../../utils/app-error";
import { signAdminToken } from "../../utils/jwt";
import { comparePassword, hashPassword } from "../../utils/password";

export async function loginAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin || admin.status !== AdminStatus.ACTIVE) {
    throw new AppError("Invalid email or password", 401);
  }

  const isValid = await comparePassword(password, admin.passwordHash);

  if (!isValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signAdminToken({
    sub: admin.id,
    email: admin.email,
    fullName: admin.fullName,
    role: admin.role,
  });

  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
    },
  };
}

export interface CreateAdminInput {
  email: string;
  password: string;
  fullName: string;
  role: AdminRole;
}

export async function createAdmin(input: CreateAdminInput) {
  const existing = await prisma.admin.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new AppError("Admin with this email already exists", 409);
  }

  const passwordHash = await hashPassword(input.password);

  const admin = await prisma.admin.create({
    data: {
      email: input.email,
      fullName: input.fullName,
      role: input.role,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return admin;
}

export async function listAdmins() {
  return prisma.admin.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
}

export async function updateAdmin(
  id: string,
  updates: Partial<Omit<CreateAdminInput, "password">> & {
    password?: string;
    status?: AdminStatus;
  },
) {
  const data: Record<string, unknown> = {};

  if (updates.fullName) data.fullName = updates.fullName;
  if (updates.role) data.role = updates.role;
  if (updates.status) data.status = updates.status;
  if (updates.email) data.email = updates.email;
  if (updates.password) {
    data.passwordHash = await hashPassword(updates.password);
  }

  const admin = await prisma.admin.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });

  return admin;
}

