"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance = void 0;
const mongoose_1 = require("mongoose");
const AttendanceSchema = new mongoose_1.Schema({
    profile: String,
    name: { type: String, required: true },
    staffId: { type: String, required: true },
    role: String,
    organizationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization' },
    organization: String, // optional denormalized name
    networkId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Network' },
    room: String,
    shift: String,
    checkInTime: String,
    checkOutTime: String,
    date: { type: String, required: true },
    status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
    notes: String,
}, { timestamps: true });
// indexes for common queries
AttendanceSchema.index({ staffId: 1, date: 1 });
AttendanceSchema.index({ organizationId: 1, date: 1 });
AttendanceSchema.index({ date: 1, status: 1 });
exports.Attendance = (0, mongoose_1.model)('Attendance', AttendanceSchema);
