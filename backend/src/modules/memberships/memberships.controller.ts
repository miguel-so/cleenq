import { Request, Response } from "express";
import {
  assignMembership,
  createMembershipPlan,
  deleteMembershipPlan,
  listCustomerMemberships,
  listMembershipPlans,
  updateCustomerMembership,
  updateMembershipPlan,
} from "./memberships.service";

export async function getMembershipPlans(_req: Request, res: Response) {
  const plans = await listMembershipPlans();
  res.json({ success: true, data: plans });
}

export async function createMembershipPlanHandler(req: Request, res: Response) {
  const plan = await createMembershipPlan(req.body);
  res.status(201).json({ success: true, data: plan });
}

export async function updateMembershipPlanHandler(req: Request, res: Response) {
  const plan = await updateMembershipPlan(req.params.planId, req.body);
  res.json({ success: true, data: plan });
}

export async function deleteMembershipPlanHandler(req: Request, res: Response) {
  await deleteMembershipPlan(req.params.planId);
  res.status(204).send();
}

export async function getCustomerMemberships(_req: Request, res: Response) {
  const memberships = await listCustomerMemberships();
  res.json({ success: true, data: memberships });
}

export async function assignMembershipHandler(req: Request, res: Response) {
  const membership = await assignMembership(req.body);
  res.status(201).json({ success: true, data: membership });
}

export async function updateCustomerMembershipHandler(
  req: Request,
  res: Response,
) {
  const membership = await updateCustomerMembership(req.params.id, req.body);
  res.json({ success: true, data: membership });
}

