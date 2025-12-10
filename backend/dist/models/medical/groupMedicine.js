"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMedicine = void 0;
const mongoose_1 = require("mongoose");
const GroupMedicineSchema = new mongoose_1.Schema({
    group_name: { type: String, required: true, trim: true, maxlength: 100 },
    deleted_at: { type: Date, default: null },
}, { timestamps: true });
exports.GroupMedicine = (0, mongoose_1.model)('GroupMedicine', GroupMedicineSchema);
