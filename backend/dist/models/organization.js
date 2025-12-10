"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = void 0;
const mongoose_1 = require("mongoose");
const OrganizationSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    type: String,
    recordType: String,
    network: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Network' },
    logo: String,
}, { timestamps: true });
// index name for quick lookup (optional unique)
OrganizationSchema.index({ name: 1 }, { unique: false, sparse: true });
OrganizationSchema.index({ network: 1 });
exports.Organization = (0, mongoose_1.model)('Organization', OrganizationSchema);
