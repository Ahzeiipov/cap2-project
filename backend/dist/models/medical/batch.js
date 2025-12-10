"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Batch = void 0;
const mongoose_1 = require("mongoose");
const BatchSchema = new mongoose_1.Schema({
    medicine_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    supplier: { type: String, required: true, trim: true, maxlength: 100 },
    quantity: { type: Number, required: true, min: 0 },
    purchase_date: { type: Date, required: true },
    expiry_date: { type: Date, required: true },
    purchase_price: { type: Number, required: true, min: 0 },
    setting_price: { type: Number, required: true, min: 0 },
    deleted_at: { type: Date, default: null },
}, { timestamps: true });
BatchSchema.index({ medicine_id: 1 });
BatchSchema.index({ expiry_date: 1 });
exports.Batch = (0, mongoose_1.model)('Batch', BatchSchema);
