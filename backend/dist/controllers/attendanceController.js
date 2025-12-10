"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const attendance_1 = require("../models/attendance");
const organization_1 = require("../models/organization");
class AttendanceController {
    // Normalize document for API response
    normalize(doc) {
        if (!doc)
            return null;
        const { _id, __v, organizationId, networkId, organization, ...rest } = doc;
        const orgPop = organizationId && typeof organizationId === 'object' && organizationId.name ? organizationId : null;
        const netPop = networkId && typeof networkId === 'object' && networkId.name ? networkId : null;
        return {
            id: _id ? String(_id) : undefined,
            ...rest,
            organization: organization || (orgPop ? orgPop.name : (organizationId ? String(organizationId._id ?? organizationId) : '')),
            organizationId: orgPop ? String(orgPop._id) : (organizationId ? String(organizationId._id ?? organizationId) : undefined),
            networkId: netPop ? String(netPop._id) : (networkId ? String(networkId._id ?? networkId) : undefined),
            networkName: netPop ? netPop.name : undefined,
        };
    }
    // GET all attendances
    async getAll(req, res) {
        try {
            const list = await attendance_1.Attendance.find()
                .populate('organizationId')
                .populate('networkId')
                .sort({ createdAt: -1 })
                .lean();
            res.json({ data: (list || []).map((item) => this.normalize(item)) });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch attendance' });
        }
    }
    // GET attendance by ID
    async getById(req, res) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id))
                return res.status(400).json({ error: 'Invalid id' });
            const item = await attendance_1.Attendance.findById(req.params.id).populate('organizationId').populate('networkId').lean();
            if (!item)
                return res.status(404).json({ error: 'Not found' });
            res.json({ data: this.normalize(item) });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch attendance' });
        }
    }
    // POST create attendance
    async create(req, res) {
        try {
            const body = req.body || {};
            if (!body?.name || !body?.staffId || !body?.date) {
                return res.status(400).json({ error: 'name, staffId and date are required' });
            }
            // Resolve organizationId (accept organization name or id)
            let organizationId = body.organizationId;
            if (!organizationId && body.organization) {
                const org = await organization_1.Organization.findOne({ name: body.organization }).lean();
                if (org)
                    organizationId = org._id;
            }
            // Resolve networkId (accept network id or derive from organization)
            let networkId = body.networkId;
            if (!networkId && organizationId) {
                const orgDoc = await organization_1.Organization.findById(organizationId).lean();
                if (orgDoc && orgDoc.network)
                    networkId = orgDoc.network;
            }
            const createPayload = {
                profile: body.profile,
                name: body.name,
                staffId: body.staffId,
                role: body.role,
                organizationId: organizationId ?? undefined,
                organization: body.organization,
                networkId: networkId ?? undefined,
                room: body.room,
                shift: body.shift,
                checkInTime: body.checkInTime,
                checkOutTime: body.checkOutTime,
                date: body.date,
                status: body.status || 'present',
                notes: body.notes,
            };
            const doc = await attendance_1.Attendance.create(createPayload);
            const created = await attendance_1.Attendance.findById(doc._id).populate('organizationId').populate('networkId').lean();
            res.status(201).json({ data: this.normalize(created) });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message || 'Failed to create' });
        }
    }
    // PUT update attendance
    async update(req, res) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id))
                return res.status(400).json({ error: 'Invalid id' });
            const body = req.body || {};
            // If organization provided as name, resolve to id
            if (body.organization && !body.organizationId) {
                const org = await organization_1.Organization.findOne({ name: body.organization }).lean();
                if (org)
                    body.organizationId = org._id;
            }
            const updated = await attendance_1.Attendance.findByIdAndUpdate(req.params.id, body, { new: true })
                .populate('organizationId')
                .populate('networkId')
                .lean();
            if (!updated)
                return res.status(404).json({ error: 'Not found' });
            res.json({ data: this.normalize(updated) });
        }
        catch (err) {
            console.error(err);
            res.status(400).json({ error: 'Failed to update' });
        }
    }
    // DELETE attendance
    async delete(req, res) {
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id))
                return res.status(400).json({ error: 'Invalid id' });
            const removed = await attendance_1.Attendance.findByIdAndDelete(req.params.id);
            if (!removed)
                return res.status(404).json({ error: 'Not found' });
            res.status(204).send();
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete' });
        }
    }
}
exports.AttendanceController = AttendanceController;
