"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCleanersHandler = listCleanersHandler;
exports.getCleanerHandler = getCleanerHandler;
exports.createCleanerHandler = createCleanerHandler;
exports.updateCleanerHandler = updateCleanerHandler;
exports.deleteCleanerHandler = deleteCleanerHandler;
const cleaners_service_1 = require("./cleaners.service");
async function listCleanersHandler(_req, res) {
    const result = await (0, cleaners_service_1.listCleaners)();
    res.json({ success: true, data: result.data, meta: result.meta });
}
async function getCleanerHandler(req, res) {
    const cleaner = await (0, cleaners_service_1.getCleaner)(req.params.cleanerId);
    res.json({ success: true, cleaner });
}
async function createCleanerHandler(req, res) {
    const cleaner = await (0, cleaners_service_1.createCleaner)(req.body);
    res.status(201).json({ success: true, cleaner });
}
async function updateCleanerHandler(req, res) {
    const cleaner = await (0, cleaners_service_1.updateCleaner)(req.params.cleanerId, req.body);
    res.json({ success: true, cleaner });
}
async function deleteCleanerHandler(req, res) {
    await (0, cleaners_service_1.deleteCleaner)(req.params.cleanerId);
    res.status(204).send();
}
