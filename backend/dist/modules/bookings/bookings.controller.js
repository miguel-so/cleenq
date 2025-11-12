"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBookingsHandler = listBookingsHandler;
exports.getBookingHandler = getBookingHandler;
exports.createBookingHandler = createBookingHandler;
exports.updateBookingHandler = updateBookingHandler;
exports.updateBookingStatusHandler = updateBookingStatusHandler;
exports.assignCleanerHandler = assignCleanerHandler;
exports.updateAssignmentHandler = updateAssignmentHandler;
exports.getBookingSummaryHandler = getBookingSummaryHandler;
const bookings_service_1 = require("./bookings.service");
async function listBookingsHandler(req, res) {
    const result = await (0, bookings_service_1.listBookings)(req.query);
    res.json({ success: true, data: result.data, meta: result.meta });
}
async function getBookingHandler(req, res) {
    const booking = await (0, bookings_service_1.getBooking)(req.params.bookingId);
    res.json({ success: true, booking });
}
async function createBookingHandler(req, res) {
    const booking = await (0, bookings_service_1.createBooking)(req.body, req.admin.id);
    res.status(201).json({ success: true, booking });
}
async function updateBookingHandler(req, res) {
    const booking = await (0, bookings_service_1.updateBooking)(req.params.bookingId, req.body, req.admin.id);
    res.json({ success: true, booking });
}
async function updateBookingStatusHandler(req, res) {
    const booking = await (0, bookings_service_1.updateBookingStatus)(req.params.bookingId, req.body, req.admin.id);
    res.json({ success: true, booking });
}
async function assignCleanerHandler(req, res) {
    const assignment = await (0, bookings_service_1.assignCleaner)(req.params.bookingId, req.body);
    res.status(201).json({ success: true, assignment });
}
async function updateAssignmentHandler(req, res) {
    const assignment = await (0, bookings_service_1.updateAssignment)(req.params.assignmentId, req.body);
    res.json({ success: true, assignment });
}
async function getBookingSummaryHandler(req, res) {
    const summary = await (0, bookings_service_1.getBookingSummary)(req.params.bookingId);
    res.json({ success: true, summary });
}
