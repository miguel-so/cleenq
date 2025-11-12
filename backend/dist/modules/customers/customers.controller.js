"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCustomersHandler = listCustomersHandler;
exports.getCustomerHandler = getCustomerHandler;
exports.createCustomerHandler = createCustomerHandler;
exports.updateCustomerHandler = updateCustomerHandler;
exports.deleteCustomerHandler = deleteCustomerHandler;
const customers_service_1 = require("./customers.service");
async function listCustomersHandler(req, res) {
    const result = await (0, customers_service_1.listCustomers)(req.query);
    res.json({ success: true, data: result.data, meta: result.meta });
}
async function getCustomerHandler(req, res) {
    const customer = await (0, customers_service_1.getCustomer)(req.params.customerId);
    res.json({ success: true, customer });
}
async function createCustomerHandler(req, res) {
    const customer = await (0, customers_service_1.createCustomer)(req.body);
    res.status(201).json({ success: true, customer });
}
async function updateCustomerHandler(req, res) {
    const customer = await (0, customers_service_1.updateCustomer)(req.params.customerId, req.body);
    res.json({ success: true, customer });
}
async function deleteCustomerHandler(req, res) {
    await (0, customers_service_1.deleteCustomer)(req.params.customerId);
    res.status(204).send();
}
