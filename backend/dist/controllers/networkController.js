"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const network_1 = require("../models/network");
class NetworkController {
    normalize(doc) {
        if (!doc)
            return null;
        const { _id, __v, ...rest } = doc;
        return { id: _id ? String(_id) : undefined, ...rest };
    }
    // GET all networks
    async getAll(req, res) {
        try {
            const list = await network_1.Network.find().sort({ createdAt: -1 }).lean();
            res.json({ data: list.map((item) => this.normalize(item)) });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch networks' });
        }
    }
    // GET network by ID
    async getById(req, res) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id))
                return res.status(400).json({ error: 'Invalid id' });
            const item = await network_1.Network.findById(req.params.id).lean();
            if (!item)
                return res.status(404).json({ error: 'Not found' });
            res.json({ data: this.normalize(item) });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch network' });
        }
    }
    // POST create network
    async create(req, res) {
        try {
            const { name, ipAddress } = req.body;
            if (!name || !ipAddress)
                return res.status(400).json({ error: 'name and ipAddress are required' });
            const doc = await network_1.Network.create({ name, ipAddress });
            res.status(201).json({ data: this.normalize(doc.toObject()) });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message || 'Failed to create network' });
        }
    }
    // PUT update network
    async update(req, res) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id))
                return res.status(400).json({ error: 'Invalid id' });
            const updated = await network_1.Network.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
            if (!updated)
                return res.status(404).json({ error: 'Not found' });
            res.json({ data: this.normalize(updated) });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ error: 'Failed to update network' });
        }
    }
    // DELETE network
    async delete(req, res) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id))
                return res.status(400).json({ error: 'Invalid id' });
            const removed = await network_1.Network.findByIdAndDelete(req.params.id);
            if (!removed)
                return res.status(404).json({ error: 'Not found' });
            res.status(204).send();
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete network' });
        }
    }
}
exports.NetworkController = NetworkController;
