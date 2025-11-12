import { Request, Response } from "express";
import {
  assignCleaner,
  createBooking,
  getBooking,
  getBookingSummary,
  listBookings,
  updateAssignment,
  updateBooking,
  updateBookingStatus,
} from "./bookings.service";

export async function listBookingsHandler(req: Request, res: Response) {
  const result = await listBookings(req.query as never);
  res.json({ success: true, data: result.data, meta: result.meta });
}

export async function getBookingHandler(req: Request, res: Response) {
  const booking = await getBooking(req.params.bookingId);
  res.json({ success: true, booking });
}

export async function createBookingHandler(req: Request, res: Response) {
  const booking = await createBooking(req.body, req.admin!.id);
  res.status(201).json({ success: true, booking });
}

export async function updateBookingHandler(req: Request, res: Response) {
  const booking = await updateBooking(req.params.bookingId, req.body, req.admin!.id);
  res.json({ success: true, booking });
}

export async function updateBookingStatusHandler(req: Request, res: Response) {
  const booking = await updateBookingStatus(
    req.params.bookingId,
    req.body,
    req.admin!.id,
  );
  res.json({ success: true, booking });
}

export async function assignCleanerHandler(req: Request, res: Response) {
  const assignment = await assignCleaner(req.params.bookingId, req.body);
  res.status(201).json({ success: true, assignment });
}

export async function updateAssignmentHandler(req: Request, res: Response) {
  const assignment = await updateAssignment(req.params.assignmentId, req.body);
  res.json({ success: true, assignment });
}

export async function getBookingSummaryHandler(req: Request, res: Response) {
  const summary = await getBookingSummary(req.params.bookingId);
  res.json({ success: true, summary });
}

