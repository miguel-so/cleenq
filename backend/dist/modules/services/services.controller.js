"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listServices = listServices;
exports.createService = createService;
exports.updateService = updateService;
exports.deleteService = deleteService;
exports.createSegment = createSegment;
exports.updateSegment = updateSegment;
exports.deleteSegment = deleteSegment;
exports.createPackage = createPackage;
exports.updatePackage = updatePackage;
exports.deletePackage = deletePackage;
exports.createAddon = createAddon;
exports.updateAddon = updateAddon;
exports.deleteAddon = deleteAddon;
const services_service_1 = require("./services.service");
async function listServices(_req, res) {
    const services = await (0, services_service_1.listServicesWithDetails)();
    res.json({ success: true, data: services });
}
async function createService(req, res) {
    const service = await (0, services_service_1.createServiceCategory)(req.body);
    res.status(201).json({ success: true, data: service });
}
async function updateService(req, res) {
    const service = await (0, services_service_1.updateServiceCategory)(req.params.serviceId, req.body);
    res.json({ success: true, data: service });
}
async function deleteService(req, res) {
    await (0, services_service_1.deleteServiceCategory)(req.params.serviceId);
    res.status(204).send();
}
async function createSegment(req, res) {
    const segment = await (0, services_service_1.createServiceSegment)(req.params.serviceId, req.body);
    res.status(201).json({ success: true, data: segment });
}
async function updateSegment(req, res) {
    const segment = await (0, services_service_1.updateServiceSegment)(req.params.segmentId, req.body);
    res.json({ success: true, data: segment });
}
async function deleteSegment(req, res) {
    await (0, services_service_1.deleteServiceSegment)(req.params.segmentId);
    res.status(204).send();
}
async function createPackage(req, res) {
    const pkg = await (0, services_service_1.createServicePackage)(req.params.serviceId, req.body);
    res.status(201).json({ success: true, data: pkg });
}
async function updatePackage(req, res) {
    const pkg = await (0, services_service_1.updateServicePackage)(req.params.packageId, req.params.serviceId, req.body);
    res.json({ success: true, data: pkg });
}
async function deletePackage(req, res) {
    await (0, services_service_1.deleteServicePackage)(req.params.packageId);
    res.status(204).send();
}
async function createAddon(req, res) {
    const addon = await (0, services_service_1.createServiceAddon)(req.params.serviceId, req.body);
    res.status(201).json({ success: true, data: addon });
}
async function updateAddon(req, res) {
    const addon = await (0, services_service_1.updateServiceAddon)(req.params.addonId, req.body);
    res.json({ success: true, data: addon });
}
async function deleteAddon(req, res) {
    await (0, services_service_1.deleteServiceAddon)(req.params.addonId);
    res.status(204).send();
}
