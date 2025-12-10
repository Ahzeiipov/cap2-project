"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Medicine = void 0;
const mongoose_1 = require("mongoose");
const MedicineSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    group_medicine_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'GroupMedicine', required: true },
    description: { type: String, default: null },
    photo: { type: String, default: null },
    barcode_image: { type: String, default: null },
    barcode_value: { type: String, default: null },
    deleted_at: { type: Date, default: null },
}, { timestamps: true });
MedicineSchema.index({ group_medicine_id: 1 });
MedicineSchema.index({ name: 1 });
exports.Medicine = (0, mongoose_1.model)('Medicine', MedicineSchema);
