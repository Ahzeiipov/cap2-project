export interface MedicalRecord {
  id: string;
  recordId: string;
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  dateOfVisit: string;
  diagnosis: string[];
  doctor: string;
  status: 'completed' | 'draft';
  chiefComplaint?: string;
  vitalSigns?: {
    bloodPressureSystolic?: string;
    bloodPressureDiastolic?: string;
    pulseRate?: string;
    temperature?: string;
    weight?: string;
    weightUnit?: string;
  };
  medicalHistory?: string;
  currentMedications?: string[];
  treatmentPlan?: string;
}

export interface MedicalRecordFormData extends Omit<MedicalRecord, 'id' | 'recordId'> {
  currentMedications?: string[];
}
