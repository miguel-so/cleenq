import { Request, Response } from "express";
import {
  adjustRewardPoints,
  getCustomerRewardSummary,
  getRewardSettings,
  listRewardTransactions,
  updateRewardSettings,
} from "./rewards.service";

export async function getRewardsSettingsHandler(_req: Request, res: Response) {
  const settings = await getRewardSettings();
  res.json({ success: true, data: settings });
}

export async function updateRewardsSettingsHandler(req: Request, res: Response) {
  const settings = await updateRewardSettings(req.body);
  res.json({ success: true, data: settings });
}

export async function listRewardTransactionsHandler(
  req: Request,
  res: Response,
) {
  const result = await listRewardTransactions(req.query as never);
  res.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
}

export async function adjustRewardPointsHandler(req: Request, res: Response) {
  const transaction = await adjustRewardPoints(req.body, req.admin!.id);
  res.status(201).json({ success: true, data: transaction });
}

export async function getCustomerRewardSummaryHandler(
  req: Request,
  res: Response,
) {
  const summary = await getCustomerRewardSummary(req.params.customerId);
  res.json({ success: true, data: summary });
}

