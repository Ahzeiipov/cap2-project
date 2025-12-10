"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarcodeController = void 0;
const medicine_1 = require("../../models/medical/medicine");
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
class BarcodeController {
    // POST /barcode/scan
    async scanBarcode(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No barcode image provided' });
            }
            const imagePath = req.file.path;
            try {
                // Generate image hash for comparison
                const imageHash = await this.generateImageHash(imagePath);
                // Find medicine by comparing with stored barcode images
                const medicine = await this.findMedicineByBarcode(imageHash, imagePath);
                // Clean up uploaded file
                fs_1.default.unlinkSync(imagePath);
                if (!medicine) {
                    return res.status(404).json({ error: 'No medicine found with matching barcode' });
                }
                return res.json({
                    data: {
                        medicineId: medicine._id.toString(),
                        medicineName: medicine.name,
                        groupId: medicine.group_medicine_id.toString()
                    }
                });
            }
            catch (error) {
                // Clean up on error
                if (fs_1.default.existsSync(imagePath)) {
                    fs_1.default.unlinkSync(imagePath);
                }
                throw error;
            }
        }
        catch (err) {
            console.error('Error scanning barcode', err);
            return res.status(500).json({ error: 'Failed to scan barcode' });
        }
    }
    // Helper: Generate perceptual hash from image
    async generateImageHash(imagePath) {
        try {
            // Resize image to small size for consistent hashing
            const resized = await (0, sharp_1.default)(imagePath)
                .resize(16, 16, { fit: 'fill' })
                .greyscale()
                .raw()
                .toBuffer();
            // Generate hash from image data
            const hash = crypto_1.default.createHash('md5').update(resized).digest('hex');
            return hash;
        }
        catch (error) {
            console.error('Error generating image hash:', error);
            // Fallback: use file stats
            const stats = fs_1.default.statSync(imagePath);
            const metadata = await (0, sharp_1.default)(imagePath).metadata();
            return `${metadata.width}x${metadata.height}-${stats.size}`;
        }
    }
    // Helper: Find medicine by barcode image comparison
    async findMedicineByBarcode(uploadedHash, uploadedImagePath) {
        // Get all medicines with barcode images
        const medicines = await medicine_1.Medicine.find({
            barcode_image: { $ne: null },
            deleted_at: null
        }).populate('group_medicine_id', 'group_name').lean();
        let bestMatch = null;
        let bestSimilarity = 0;
        // For each medicine, compare barcode images
        for (const medicine of medicines) {
            if (medicine.barcode_image) {
                // Extract filename from URL path
                const filename = medicine.barcode_image.split('/').pop() || '';
                const barcodePath = path_1.default.join(process.cwd(), 'uploads', 'barcodes', filename);
                if (fs_1.default.existsSync(barcodePath)) {
                    // Compare images using similarity
                    const similarity = await this.calculateImageSimilarity(barcodePath, uploadedImagePath);
                    // Keep track of best match
                    if (similarity > bestSimilarity) {
                        bestSimilarity = similarity;
                        bestMatch = medicine;
                    }
                }
            }
        }
        // Return match if similarity is above threshold (85%)
        return bestSimilarity > 0.85 ? bestMatch : null;
    }
    // Helper: Calculate image similarity using pixel comparison
    async calculateImageSimilarity(image1Path, image2Path) {
        try {
            // Resize both images to same size for comparison
            const size = 32;
            const image1 = await (0, sharp_1.default)(image1Path)
                .resize(size, size, { fit: 'fill' })
                .greyscale()
                .raw()
                .toBuffer();
            const image2 = await (0, sharp_1.default)(image2Path)
                .resize(size, size, { fit: 'fill' })
                .greyscale()
                .raw()
                .toBuffer();
            // Calculate similarity based on pixel differences
            let matches = 0;
            const totalPixels = image1.length;
            for (let i = 0; i < totalPixels; i++) {
                const diff = Math.abs(image1[i] - image2[i]);
                // Consider pixels similar if difference is less than 10
                if (diff < 10) {
                    matches++;
                }
            }
            return matches / totalPixels;
        }
        catch (error) {
            console.error('Error calculating similarity:', error);
            return 0;
        }
    }
}
exports.BarcodeController = BarcodeController;
