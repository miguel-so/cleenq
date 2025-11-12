import { Request, Response } from "express";
import {
  createCleaner,
  deleteCleaner,
  getCleaner,
  listCleaners,
  updateCleaner,
} from "./cleaners.service";

export async function listCleanersHandler(_req: Request, res: Response) {
  const result = await listCleaners();
  res.json({ success: true, data: result.data, meta: result.meta });
}

export async function getCleanerHandler(req: Request, res: Response) {
  const cleaner = await getCleaner(req.params.cleanerId);
  res.json({ success: true, cleaner });
}

export async function createCleanerHandler(req: Request, res: Response) {
  const cleaner = await createCleaner(req.body);
  res.status(201).json({ success: true, cleaner });
}

export async function updateCleanerHandler(req: Request, res: Response) {
  const cleaner = await updateCleaner(req.params.cleanerId, req.body);
  res.json({ success: true, cleaner });
}

export async function deleteCleanerHandler(req: Request, res: Response) {
  await deleteCleaner(req.params.cleanerId);
  res.status(204).send();
}

