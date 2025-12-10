"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const barcodeController_1 = require("../../controllers/medical/barcodeController");
const upload_1 = require("../../utils/upload");
const router = (0, express_1.Router)();
const controller = new barcodeController_1.BarcodeController();
// POST /barcode/scan - Scan barcode from uploaded image
router.post('/scan', upload_1.uploadBarcode.single('barcode_image'), (req, res) => controller.scanBarcode(req, res));
exports.default = router;
