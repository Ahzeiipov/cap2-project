"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
// Compatibility wrapper for existing imports; redirects to medical route
var medicineGroups_1 = require("./medical/medicineGroups");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(medicineGroups_1).default; } });
