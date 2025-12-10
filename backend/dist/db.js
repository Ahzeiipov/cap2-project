"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = connectDb;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDb(uri) {
    const mongoUri = uri ?? process.env.MONGODB_URI;
    if (!mongoUri)
        throw new Error('MONGODB_URI not set in environment');
    await mongoose_1.default.connect(mongoUri);
    console.log('MongoDB connected');
    return mongoose_1.default;
}
