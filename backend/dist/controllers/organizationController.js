"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const organization_1 = require("../models/organization");
class OrganizationController {
    normalize(doc) {
        if (!doc)
            return null;
        const { _id, __v, ...rest } = doc;
        return { id: _id ? String(_id) : undefined, ...rest };
    }
    // GET all organizations
    async getAll(req, res) {
        try {
            const list = await organization_1.Organization.find().sort({ createdAt: -1 }).lean();
            res.json({ data: list.map((item) => this.normalize(item)) });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch organizations' });
        }
    }
    // GET organization by ID
    async getById(req, res) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id))
                return res.status(400).json({ error: 'Invalid id' });
            const item = await organization_1.Organization.findById(req.params.id).lean();
            if (!item)
                return res.status(404).json({ error: 'Not found' });
            res.json({ data: this.normalize(item) });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch organization' });
        }
    }
    // POST create organization
    async create(req, res) {
        try {
            const { name, type, recordType, network, logo } = req.body;
            if (!name)
                return res.status(400).json({ error: 'name is required' });
            const doc = await organization_1.Organization.create({
                name,
                type: type || undefined,
                recordType: recordType || undefined,
                network: network || undefined,
                logo: logo || undefined,
            });
            res.status(201).json({ data: this.normalize(doc.toObject()) });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message || 'Failed to create organization' });
        }
    }
    // PUT update organization
    async update(req, res) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id))
                return res.status(400).json({ error: 'Invalid id' });
            const updated = await organization_1.Organization.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
            if (!updated)
                return res.status(404).json({ error: 'Not found' });
            res.json({ data: this.normalize(updated) });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ error: 'Failed to update organization' });
        }
    }
    // DELETE organization
    async delete(req, res) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id))
                return res.status(400).json({ error: 'Invalid id' });
            const removed = await organization_1.Organization.findByIdAndDelete(req.params.id);
            if (!removed)
                return res.status(404).json({ error: 'Not found' });
            res.status(204).send();
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete organization' });
        }
    }
}
exports.OrganizationController = OrganizationController;
