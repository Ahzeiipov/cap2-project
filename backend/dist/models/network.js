"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = void 0;
const mongoose_1 = require("mongoose");
const NetworkSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    ipAddress: { type: String, required: true },
}, { timestamps: true });
// index for quick lookups and uniqueness on IP
NetworkSchema.index({ ipAddress: 1 }, { unique: true, sparse: true });
NetworkSchema.index({ name: 1 });
exports.Network = (0, mongoose_1.model)('Network', NetworkSchema);
