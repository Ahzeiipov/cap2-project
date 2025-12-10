"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const attendance_1 = __importDefault(require("./routes/attendance"));
const organizations_1 = __importDefault(require("./routes/organizations"));
const networks_1 = __importDefault(require("./routes/networks"));
const medicineGroups_1 = __importDefault(require("./routes/medical/medicineGroups"));
const medicines_1 = __importDefault(require("./routes/medicines"));
const batches_1 = __importDefault(require("./routes/medical/batches"));
const barcode_1 = __importDefault(require("./routes/medical/barcode"));
const db_1 = require("./db");
const seed_1 = require("./seed");
// Import MedicalRecord model to ensure it's registered with Mongoose
require("./models/medical/medicalRecord");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 3000);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files for uploaded images
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
app.use('/api/attendance', attendance_1.default);
app.use('/api/organizations', organizations_1.default);
app.use('/api/networks', networks_1.default);
app.use('/api/medicine-groups', medicineGroups_1.default);
app.use('/api/medicines', medicines_1.default);
app.use('/api/batches', batches_1.default);
app.use('/api/barcode', barcode_1.default);
app.get('/health', (_req, res) => res.json({ ok: true }));
async function start() {
    try {
        await (0, db_1.connectDb)();
        // run seed only once if collections empty
        await (0, seed_1.seedDatabase)();
        app.listen(PORT, () => {
            console.log(`Backend listening on http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error('Startup error', err);
        process.exit(1);
    }
}
start();
