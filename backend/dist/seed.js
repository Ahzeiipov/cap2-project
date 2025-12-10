"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const attendance_1 = require("./models/attendance");
const organization_1 = require("./models/organization");
const network_1 = require("./models/network");
const groupMedicine_1 = require("./models/medical/groupMedicine");
const medicine_1 = require("./models/medical/medicine");
const batch_1 = require("./models/medical/batch");
const medicalRecord_1 = require("./models/medical/medicalRecord");
async function seedDatabase() {
    try {
        const attCount = await attendance_1.Attendance.countDocuments();
        const orgCount = await organization_1.Organization.countDocuments();
        const netCount = await network_1.Network.countDocuments();
        let networks = [];
        if (netCount === 0) {
            const nets = [
                { name: 'Main Network', ipAddress: '192.168.1.1' },
                { name: 'Secondary Network', ipAddress: '192.168.1.50' },
            ];
            networks = await network_1.Network.insertMany(nets);
            console.log('Seeded networks');
        }
        else {
            networks = await network_1.Network.find().lean();
        }
        let orgs = [];
        if (orgCount === 0) {
            const orgDocs = [
                { name: 'Main Clinic', type: 'Primary Care', recordType: 'Hospital', network: networks[0]._id, logo: '🏥' },
                { name: 'Dental Center', type: 'Dental', recordType: 'Clinic', network: networks[1]._id, logo: '🦷' },
            ];
            orgs = await organization_1.Organization.insertMany(orgDocs);
            console.log('Seeded organizations');
        }
        else {
            orgs = await organization_1.Organization.find().lean();
        }
        if (attCount === 0) {
            const defaultDate = new Date().toISOString().split('T')[0];
            const attendances = [
                {
                    profile: '👨‍⚕️',
                    name: 'Dr. Sarah Johnson',
                    staffId: 'S001',
                    role: 'General Physician',
                    organizationId: orgs[0]._id,
                    organization: orgs[0].name,
                    room: '101',
                    shift: 'Morning',
                    checkInTime: '08:45 AM',
                    date: defaultDate,
                    status: 'present',
                },
                {
                    profile: '👨‍⚕️',
                    name: 'Dr. Michael Chen',
                    staffId: 'S002',
                    role: 'Cardiologist',
                    organizationId: orgs[0]._id,
                    organization: orgs[0].name,
                    room: '202',
                    shift: 'Morning',
                    checkInTime: '09:15 AM',
                    date: defaultDate,
                    status: 'late',
                },
                {
                    profile: '👩‍⚕️',
                    name: 'Nurse Emma Wilson',
                    staffId: 'S003',
                    role: 'Registered Nurse',
                    organizationId: orgs[0]._id,
                    organization: orgs[0].name,
                    room: '103',
                    shift: 'Morning',
                    checkInTime: '08:30 AM',
                    checkOutTime: '05:30 PM',
                    date: defaultDate,
                    status: 'present',
                },
            ];
            await attendance_1.Attendance.insertMany(attendances);
            console.log('Seeded attendances');
        }
        // Seed Medical Data
        const groupCount = await groupMedicine_1.GroupMedicine.countDocuments();
        let groups = [];
        if (groupCount === 0) {
            const groupDocs = [
                { group_name: 'Antibiotics' },
                { group_name: 'Pain Relievers' },
                { group_name: 'Vitamins & Supplements' },
                { group_name: 'Cardiovascular' },
            ];
            groups = await groupMedicine_1.GroupMedicine.insertMany(groupDocs);
            console.log('Seeded medicine groups');
        }
        else {
            groups = await groupMedicine_1.GroupMedicine.find().lean();
        }
        const medicineCount = await medicine_1.Medicine.countDocuments();
        if (medicineCount === 0 && groups.length > 0) {
            const medicines = [
                {
                    name: 'Amoxicillin 500mg',
                    group_medicine_id: groups[0]._id,
                    description: 'Broad-spectrum antibiotic',
                    barcode: 1234567890123,
                },
                {
                    name: 'Paracetamol 500mg',
                    group_medicine_id: groups[1]._id,
                    description: 'Pain and fever reducer',
                    barcode: 1234567890124,
                },
                {
                    name: 'Vitamin D3 1000IU',
                    group_medicine_id: groups[2]._id,
                    description: 'Vitamin D supplement',
                    barcode: 1234567890125,
                },
            ];
            const createdMedicines = await medicine_1.Medicine.insertMany(medicines);
            console.log('Seeded medicines');
            // Seed batches for the first medicine
            if (createdMedicines.length > 0) {
                const batches = [
                    {
                        medicine_id: createdMedicines[0]._id,
                        supplier: 'PharmaCorp Inc.',
                        quantity: 100,
                        purchase_date: new Date('2024-01-15'),
                        expiry_date: new Date('2026-01-15'),
                        purchase_price: 5.50,
                        setting_price: 8.00,
                    },
                    {
                        medicine_id: createdMedicines[1]._id,
                        supplier: 'MedSupply Co.',
                        quantity: 200,
                        purchase_date: new Date('2024-02-01'),
                        expiry_date: new Date('2025-12-31'),
                        purchase_price: 2.25,
                        setting_price: 4.50,
                    },
                ];
                await batch_1.Batch.insertMany(batches);
                console.log('Seeded batches');
            }
        }
        // Seed Medical Records
        const medicalRecordCount = await medicalRecord_1.MedicalRecord.countDocuments();
        if (medicalRecordCount === 0) {
            const medicalRecords = [
                {
                    recordId: 'MR-2024-001',
                    patient: {
                        name: 'Emily Done',
                        id: 'P-2024-001',
                        gender: 'Female',
                        dateOfBirth: new Date('1970-05-15'),
                        age: 54,
                        address: '123 Main Street, City, State 12345',
                        contactNumber: '555-0101'
                    },
                    visit: {
                        dateOfVisit: new Date('2024-01-15'),
                        doctor: 'Dr. Michael Chen',
                        reasonOfVisit: 'Routine checkup and joint pain'
                    },
                    medicalHistory: {
                        allergiesStatus: 'has-allergies',
                        allergiesDetails: 'Penicillin, Sulfa drugs',
                        currentMedications: 'Ibuprofen 400mg daily, Vitamin D3 1000IU',
                        chronicDiseases: ['Osteoarthritis', 'Hypertension'],
                        chronicDiseasesDetails: 'Diagnosed with osteoarthritis in 2020, hypertension in 2018',
                        pastSurgeries: 'Appendectomy (1995), Knee surgery (2015)',
                        familyHistories: 'Father had heart disease, Mother has diabetes'
                    },
                    vitalSigns: {
                        height: 165,
                        heightUnit: 'cm',
                        weight: 68,
                        weightUnit: 'kg',
                        bloodPressure: '130/85',
                        pulseRate: 72,
                        temperature: 36.8,
                        respiratoryRate: 16,
                        oxygenSaturation: 98
                    },
                    physicalExamination: {
                        generalAppearance: 'Well-appearing, alert and oriented',
                        cardiovascular: 'Regular rhythm, no murmurs',
                        respiratory: 'Clear to auscultation bilaterally',
                        abdominal: 'Soft, non-tender, non-distended',
                        neurological: 'Intact cranial nerves, normal reflexes',
                        additionalFindings: 'Mild joint tenderness in knees and hands'
                    },
                    diagnosis: {
                        diagnosis: 'Osteoarthritis, Migraine',
                        testsOrdered: 'X-ray of knees, Blood pressure monitoring'
                    },
                    treatmentPlan: {
                        medicationsPrescribed: 'Ibuprofen 400mg twice daily with meals, Acetaminophen 500mg as needed for pain',
                        proceduresPerformed: 'Physical examination, Blood pressure measurement',
                        instruction: 'Follow up in 3 months, continue current medications, apply ice to affected joints'
                    },
                    status: 'Completed'
                },
                {
                    recordId: 'MR-2024-002',
                    patient: {
                        name: 'John Smith',
                        id: 'P-2024-002',
                        gender: 'Male',
                        dateOfBirth: new Date('1979-03-20'),
                        age: 45,
                        address: '456 Oak Avenue, City, State 67890',
                        contactNumber: '555-0202'
                    },
                    visit: {
                        dateOfVisit: new Date('2024-01-16'),
                        doctor: 'Dr. Sarah Johnson',
                        reasonOfVisit: 'High blood pressure follow-up'
                    },
                    medicalHistory: {
                        allergiesStatus: 'no-known',
                        allergiesDetails: '',
                        currentMedications: 'Lisinopril 10mg daily',
                        chronicDiseases: ['Hypertension'],
                        chronicDiseasesDetails: 'Diagnosed with hypertension in 2022',
                        pastSurgeries: 'None',
                        familyHistories: 'Father had hypertension, Mother has high cholesterol'
                    },
                    vitalSigns: {
                        height: 180,
                        heightUnit: 'cm',
                        weight: 85,
                        weightUnit: 'kg',
                        bloodPressure: '145/92',
                        pulseRate: 78,
                        temperature: 37.0,
                        respiratoryRate: 18,
                        oxygenSaturation: 97
                    },
                    physicalExamination: {
                        generalAppearance: 'Well-appearing, no acute distress',
                        cardiovascular: 'Regular rhythm, S4 gallop noted',
                        respiratory: 'Clear to auscultation',
                        abdominal: 'Soft, non-tender',
                        neurological: 'Intact, no focal deficits',
                        additionalFindings: 'Elevated blood pressure, recommend medication adjustment'
                    },
                    diagnosis: {
                        diagnosis: 'Hypertension',
                        testsOrdered: 'ECG, Lipid panel, Complete blood count'
                    },
                    treatmentPlan: {
                        medicationsPrescribed: 'Increase Lisinopril to 20mg daily, Add Hydrochlorothiazide 12.5mg daily',
                        proceduresPerformed: 'Blood pressure measurement, Physical examination',
                        instruction: 'Monitor blood pressure at home, follow up in 2 weeks, reduce sodium intake, exercise regularly'
                    },
                    status: 'Daft'
                }
            ];
            await medicalRecord_1.MedicalRecord.insertMany(medicalRecords);
            console.log('Seeded medical records');
        }
        console.log('Seeding complete');
    }
    catch (err) {
        console.error('Seed error', err);
        throw err;
    }
}
