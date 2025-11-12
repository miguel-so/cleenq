import { Request, Response } from "express";
import {
  createAdmin,
  loginAdmin,
  listAdmins,
  updateAdmin,
} from "./auth.service";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const result = await loginAdmin(email, password);

  res.json({
    success: true,
    data: result,
  });
}

export function currentAdmin(req: Request, res: Response) {
  res.json({
    success: true,
    data: req.admin,
  });
}

export async function createAdminHandler(req: Request, res: Response) {
  const admin = await createAdmin(req.body);

  res.status(201).json({
    success: true,
    data: admin,
  });
}

export async function listAdminsHandler(_req: Request, res: Response) {
  const admins = await listAdmins();

  res.json({
    success: true,
    data: admins,
  });
}

export async function updateAdminHandler(req: Request, res: Response) {
  const admin = await updateAdmin(req.params.id, req.body);

  res.json({
    success: true,
    data: admin,
  });
}

