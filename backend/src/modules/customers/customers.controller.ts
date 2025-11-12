import { Request, Response } from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  listCustomers,
  updateCustomer,
} from "./customers.service";

export async function listCustomersHandler(req: Request, res: Response) {
  const result = await listCustomers(req.query as never);
  res.json({ success: true, data: result.data, meta: result.meta });
}

export async function getCustomerHandler(req: Request, res: Response) {
  const customer = await getCustomer(req.params.customerId);
  res.json({ success: true, customer });
}

export async function createCustomerHandler(req: Request, res: Response) {
  const customer = await createCustomer(req.body);
  res.status(201).json({ success: true, customer });
}

export async function updateCustomerHandler(req: Request, res: Response) {
  const customer = await updateCustomer(req.params.customerId, req.body);
  res.json({ success: true, customer });
}

export async function deleteCustomerHandler(req: Request, res: Response) {
  await deleteCustomer(req.params.customerId);
  res.status(204).send();
}

