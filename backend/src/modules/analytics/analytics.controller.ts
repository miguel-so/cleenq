import { Request, Response } from "express";
import { getAdminOverview } from "./analytics.service";

export async function getOverviewHandler(_req: Request, res: Response) {
  const data = await getAdminOverview();
  res.json({ success: true, data });
}

