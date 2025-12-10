"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = require("./db");
const seed_1 = require("./seed");
async function run() {
    try {
        await (0, db_1.connectDb)();
        await (0, seed_1.seedDatabase)();
        console.log('Seed complete');
        process.exit(0);
    }
    catch (err) {
        console.error('Seed failed', err);
        process.exit(1);
    }
}
run();
