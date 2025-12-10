"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicineController = void 0;
const medicine_1 = require("../../models/medical/medicine");
const groupMedicine_1 = require("../../models/medical/groupMedicine");
const batch_1 = require("../../models/medical/batch");
const upload_1 = require("../../utils/upload");
const barcodeExtractor_1 = require("../../utils/barcodeExtractor");
class MedicineController {
    // GET /medicines
    async getAll(_req, res) {
        try {
            const medicines = await medicine_1.Medicine.find().populate('group_medicine_id', 'group_name').lean();
            return res.json({ data: medicines });
        }
        catch (err) {
            console.error('Error fetching medicines', err);
            return res.status(500).json({ error: 'Failed to fetch medicines' });
        }
    }
    // GET /medicines/:id
    async getById(req, res) {
        try {
            const medicine = await medicine_1.Medicine.findById(req.params.id)
                .populate('group_medicine_id', 'group_name')
                .lean();
            if (!medicine)
                return res.status(404).json({ error: 'Medicine not found' });
            // Calculate stock from batches
            const batches = await batch_1.Batch.find({
                medicine_id: medicine._id,
                deleted_at: null
            }).lean();
            const totalStock = batches.reduce((sum, batch) => sum + (batch.quantity || 0), 0);
            const batchCount = batches.length;
            return res.json({
                data: {
                    ...medicine,
                    stock: {
                        total: totalStock,
                        batches: batchCount
                    }
                }
            });
        }
        catch (err) {
            console.error('Error fetching medicine', err);
            return res.status(500).json({ error: 'Failed to fetch medicine' });
        }
    }
    // GET /medicines/group/:groupName
    async getByGroup(req, res) {
        try {
            const group = await groupMedicine_1.GroupMedicine.findOne({ group_name: req.params.groupName }).lean();
            if (!group)
                return res.json({ data: [] });
            const medicines = await medicine_1.Medicine.find({ group_medicine_id: group._id })
                .populate('group_medicine_id', 'group_name')
                .lean();
            return res.json({ data: medicines });
        }
        catch (err) {
            console.error('Error fetching medicines by group', err);
            return res.status(500).json({ error: 'Failed to fetch medicines by group' });
        }
    }
    // GET /medicines/group-id/:groupId
    async getByGroupId(req, res) {
        try {
            const searchQuery = req.query.search;
            // Build query with optional search
            const query = {
                group_medicine_id: req.params.groupId,
                deleted_at: null
            };
            if (searchQuery && searchQuery.trim()) {
                // Search by medicine name (case-insensitive)
                query.name = { $regex: searchQuery.trim(), $options: 'i' };
            }
            const medicines = await medicine_1.Medicine.find(query)
                .populate('group_medicine_id', 'group_name')
                .lean();
            return res.json({ data: medicines });
        }
        catch (err) {
            console.error('Error fetching medicines by group id', err);
            return res.status(500).json({ error: 'Failed to fetch medicines by group id' });
        }
    }
    // POST /medicines
    async create(req, res) {
        try {
            const { group_medicine_id, name, description, photo, deleted_at } = req.body;
            if (!group_medicine_id || !name) {
                return res.status(400).json({ error: 'group_medicine_id and name are required' });
            }
            // Verify group exists
            const group = await groupMedicine_1.GroupMedicine.findById(group_medicine_id);
            if (!group) {
                return res.status(400).json({ error: 'Invalid group_medicine_id' });
            }
            // Handle barcode image upload
            let barcode_image = null;
            let barcode_value = null;
            if (req.file) {
                barcode_image = (0, upload_1.getBarcodeImageUrl)(req.file.filename);
                // Extract barcode value from image
                try {
                    barcode_value = await (0, barcodeExtractor_1.generateBarcodeValueFromImage)(req.file.path);
                }
                catch (error) {
                    console.error('Error extracting barcode value:', error);
                    // Continue without barcode value if extraction fails
                }
            }
            const medicine = await medicine_1.Medicine.create({
                group_medicine_id,
                name,
                description,
                photo,
                barcode_image,
                barcode_value,
                deleted_at,
            });
            // Populate and return the created medicine
            const populatedMedicine = await medicine_1.Medicine.findById(medicine._id)
                .populate('group_medicine_id', 'group_name')
                .lean();
            return res.status(201).json({ data: populatedMedicine });
        }
        catch (err) {
            console.error('Error creating medicine', err);
            return res.status(500).json({ error: 'Failed to create medicine' });
        }
    }
    // PUT /medicines/:id
    async update(req, res) {
        try {
            const { group_medicine_id, name, description, photo, deleted_at } = req.body;
            const medicine = await medicine_1.Medicine.findById(req.params.id);
            if (!medicine)
                return res.status(404).json({ error: 'Medicine not found' });
            if (group_medicine_id !== undefined)
                medicine.group_medicine_id = group_medicine_id;
            if (name !== undefined)
                medicine.name = name;
            if (description !== undefined)
                medicine.description = description;
            if (photo !== undefined)
                medicine.photo = photo;
            if (deleted_at !== undefined)
                medicine.deleted_at = deleted_at;
            // Handle barcode image upload
            if (req.file) {
                medicine.barcode_image = (0, upload_1.getBarcodeImageUrl)(req.file.filename);
                // Extract barcode value from image
                try {
                    medicine.barcode_value = await (0, barcodeExtractor_1.generateBarcodeValueFromImage)(req.file.path);
                }
                catch (error) {
                    console.error('Error extracting barcode value:', error);
                    // Continue without updating barcode value if extraction fails
                }
            }
            await medicine.save();
            return res.json({ data: medicine });
        }
        catch (err) {
            console.error('Error updating medicine', err);
            return res.status(500).json({ error: 'Failed to update medicine' });
        }
    }
    // DELETE /medicines/:id
    async delete(req, res) {
        try {
            const medicine = await medicine_1.Medicine.findById(req.params.id);
            if (!medicine)
                return res.status(404).json({ error: 'Medicine not found' });
            await medicine.deleteOne();
            return res.status(204).send();
        }
        catch (err) {
            console.error('Error deleting medicine', err);
            return res.status(500).json({ error: 'Failed to delete medicine' });
        }
    }
}
exports.MedicineController = MedicineController;
