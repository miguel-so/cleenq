import { Request, Response } from "express";
import {
  createServiceAddon,
  createServiceCategory,
  createServicePackage,
  createServiceSegment,
  deleteServiceAddon,
  deleteServiceCategory,
  deleteServicePackage,
  deleteServiceSegment,
  listServicesWithDetails,
  updateServiceAddon,
  updateServiceCategory,
  updateServicePackage,
  updateServiceSegment,
} from "./services.service";

export async function listServices(_req: Request, res: Response) {
  const services = await listServicesWithDetails();
  res.json({ success: true, data: services });
}

export async function createService(req: Request, res: Response) {
  const service = await createServiceCategory(req.body);
  res.status(201).json({ success: true, data: service });
}

export async function updateService(req: Request, res: Response) {
  const service = await updateServiceCategory(req.params.serviceId, req.body);
  res.json({ success: true, data: service });
}

export async function deleteService(req: Request, res: Response) {
  await deleteServiceCategory(req.params.serviceId);
  res.status(204).send();
}

export async function createSegment(req: Request, res: Response) {
  const segment = await createServiceSegment(req.params.serviceId, req.body);
  res.status(201).json({ success: true, data: segment });
}

export async function updateSegment(req: Request, res: Response) {
  const segment = await updateServiceSegment(req.params.segmentId, req.body);
  res.json({ success: true, data: segment });
}

export async function deleteSegment(req: Request, res: Response) {
  await deleteServiceSegment(req.params.segmentId);
  res.status(204).send();
}

export async function createPackage(req: Request, res: Response) {
  const pkg = await createServicePackage(req.params.serviceId, req.body);
  res.status(201).json({ success: true, data: pkg });
}

export async function updatePackage(req: Request, res: Response) {
  const pkg = await updateServicePackage(
    req.params.packageId,
    req.params.serviceId,
    req.body,
  );
  res.json({ success: true, data: pkg });
}

export async function deletePackage(req: Request, res: Response) {
  await deleteServicePackage(req.params.packageId);
  res.status(204).send();
}

export async function createAddon(req: Request, res: Response) {
  const addon = await createServiceAddon(req.params.serviceId, req.body);
  res.status(201).json({ success: true, data: addon });
}

export async function updateAddon(req: Request, res: Response) {
  const addon = await updateServiceAddon(req.params.addonId, req.body);
  res.json({ success: true, data: addon });
}

export async function deleteAddon(req: Request, res: Response) {
  await deleteServiceAddon(req.params.addonId);
  res.status(204).send();
}

