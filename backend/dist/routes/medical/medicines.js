"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const medicineController_1 = require("../../controllers/medical/medicineController");
const upload_1 = require("../../utils/upload");
const router = (0, express_1.Router)();
const controller = new medicineController_1.MedicineController();
// Standard CRUD operations (must be before specific routes)
router.get('/', (req, res) => controller.getAll(req, res));
router.post('/', upload_1.uploadBarcode.single('barcode_image'), (req, res) => controller.create(req, res));
// Get medicines by group name (specific routes before :id)
router.get('/group/:groupName', (req, res) => controller.getByGroup(req, res));
router.get('/group-id/:groupId', (req, res) => controller.getByGroupId(req, res));
// Get/Update/Delete by ID (must be last)
router.get('/:id', (req, res) => controller.getById(req, res));
router.put('/:id', upload_1.uploadBarcode.single('barcode_image'), (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));
exports.default = router;
