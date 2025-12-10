"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Centralized Sequelize instance for the medical tables
exports.sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'medical_db', process.env.DB_USER || 'postgres', process.env.DB_PASSWORD || '', {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
});
exports.default = exports.sequelize;
