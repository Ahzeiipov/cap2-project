import React, { useState, useRef } from 'react';
import '../../assets/style/medical/CompleteMedicalRecord.css';
import type { MedicalRecordData } from './page';

// Import all your form components
import PatientForm from '../../components/medical/form/patientForm';
import MedicalHistory from '../../components/medical/form/medicalHistory';
import VitalSigns from '../../components/medical/form/vitalSignsForm';
import PhysicalExamination from '../../components/medical/form/physicalForm';
import TreatmentPlan from '../../components/medical/form/treatmentForm';

interface CompleteMedicalRecordProps {
  onBack?: () => void;
  editingRecord?: MedicalRecordData | null;
  onAddRecord?: (record: MedicalRecordData) => void;
  onUpdateRecord?: (record: MedicalRecordData) => void;
}

const CompleteMedicalRecord: React.FC<CompleteMedicalRecordProps> = ({ 
  onBack, 
  editingRecord,
  onAddRecord,
  onUpdateRecord
}) => {
  const formRef = useRef<HTMLDivElement>(null);

  const collectFormData = (): Partial<MedicalRecordData> => {
    if (!formRef.current) return {};

    // Collect patient form data
    const patientNameInput = formRef.current.querySelector<HTMLInputElement>('input[name="name"]');
    const patientIdInput = formRef.current.querySelector<HTMLInputElement>('input[name="id"]');
    const ageInput = formRef.current.querySelector<HTMLInputElement>('input[name="age"]');
    const genderInput = formRef.current.querySelector<HTMLInputElement>('input[name="gender"]:checked');
    const dateOfVisitInput = formRef.current.querySelector<HTMLInputElement>('input[name="dateOfVisit"]');
    
    // Collect diagnosis
    const diagnosisTextarea = formRef.current.querySelector<HTMLTextAreaElement>('.diagnosis-textarea');
    
    // Default doctor (can be made dynamic)
    const doctor = 'Dr. Michael Chen';

    return {
      patientName: patientNameInput?.value || '',
      patientId: patientIdInput?.value || '',
      age: parseInt(ageInput?.value || '0'),
      gender: genderInput?.value || '',
      dateOfVisit: dateOfVisitInput?.value || new Date().toLocaleDateString(),
      diagnosis: diagnosisTextarea?.value || '',
      doctor: doctor
    };
  };

  const handleSubmit = () => {
    const formData = collectFormData();
    
    console.log('Collected form data:', formData);
    
    if (!formData.patientName || !formData.patientId) {
      alert('Please fill in at least Patient Name and Patient ID');
      return;
    }

    const recordId = editingRecord?.recordId || `MR-2024-${String(Date.now()).slice(-6)}`;
    const newRecord: MedicalRecordData = {
      recordId,
      patientName: formData.patientName || '',
      patientId: formData.patientId || '',
      age: formData.age || 0,
      gender: formData.gender || '',
      dateOfVisit: formData.dateOfVisit || new Date().toLocaleDateString(),
      diagnosis: formData.diagnosis || '',
      doctor: formData.doctor || 'Dr. Michael Chen',
      status: 'Completed'
    };

    console.log('New record to save:', newRecord);
    console.log('addMedicalRecord function exists:', typeof (window as any).addMedicalRecord);

    // Save record using callback or global function
    if (editingRecord) {
      if (onUpdateRecord) {
        onUpdateRecord(newRecord);
        alert('Medical record updated successfully!');
      } else if ((window as any).updateMedicalRecord) {
        (window as any).updateMedicalRecord(newRecord);
        alert('Medical record updated successfully!');
      } else {
        alert('Error: Update function not available. Please refresh the page.');
        console.error('updateMedicalRecord function not found');
        return;
      }
    } else {
      if (onAddRecord) {
        onAddRecord(newRecord);
        alert('Medical record submitted successfully!');
      } else if ((window as any).addMedicalRecord) {
        (window as any).addMedicalRecord(newRecord);
        alert('Medical record submitted successfully!');
      } else {
        alert('Error: Add function not available. Please refresh the page.');
        console.error('addMedicalRecord function not found');
        return;
      }
    }

    // Small delay to ensure state update happens before navigation
    setTimeout(() => {
      if (onBack) {
        onBack();
      }
    }, 100);
  };

  const handleSaveDraft = () => {
    const formData = collectFormData();
    
    console.log('Collected form data (draft):', formData);
    
    if (!formData.patientName || !formData.patientId) {
      alert('Please fill in at least Patient Name and Patient ID');
      return;
    }

    const recordId = editingRecord?.recordId || `MR-2024-${String(Date.now()).slice(-6)}`;
    const newRecord: MedicalRecordData = {
      recordId,
      patientName: formData.patientName || '',
      patientId: formData.patientId || '',
      age: formData.age || 0,
      gender: formData.gender || '',
      dateOfVisit: formData.dateOfVisit || new Date().toLocaleDateString(),
      diagnosis: formData.diagnosis || '',
      doctor: formData.doctor || 'Dr. Michael Chen',
      status: 'Daft'
    };

    console.log('New record to save (draft):', newRecord);
    console.log('addMedicalRecord function exists:', typeof (window as any).addMedicalRecord);

    // Save record using callback or global function
    if (editingRecord) {
      if (onUpdateRecord) {
        onUpdateRecord(newRecord);
        alert('Medical record saved as draft!');
      } else if ((window as any).updateMedicalRecord) {
        (window as any).updateMedicalRecord(newRecord);
        alert('Medical record saved as draft!');
      } else {
        alert('Error: Update function not available. Please refresh the page.');
        console.error('updateMedicalRecord function not found');
        return;
      }
    } else {
      if (onAddRecord) {
        onAddRecord(newRecord);
        alert('Medical record saved as draft!');
      } else if ((window as any).addMedicalRecord) {
        (window as any).addMedicalRecord(newRecord);
        alert('Medical record saved as draft!');
      } else {
        alert('Error: Add function not available. Please refresh the page.');
        console.error('addMedicalRecord function not found');
        return;
      }
    }

    // Small delay to ensure state update happens before navigation
    setTimeout(() => {
      if (onBack) {
        onBack();
      }
    }, 100);
  };

  return (
    <div className="complete-medical-record-page" ref={formRef}>
      {/* Page Header */}
      <div className="page-header main-medical-form-width">
        <div className="header-content">
          {onBack && (
            <button 
              onClick={onBack}
              style={{
                marginBottom: '10px',
                padding: '8px 16px',
                background: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              ← Back to Medical Records
            </button>
          )}
          <h1 className="page-title">{editingRecord ? 'Edit Medical Record' : 'New Medical Record'}</h1>
          <p className="page-subtitle">Complete patient medical record form</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleSaveDraft}>
            Save as Draft
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Submit Record
          </button>
        </div>
      </div>

      {/* Forms Container */}
      <div className="forms-container">
        {/* 1. Patient Information */}
        <div className="form-section main-medical-form-width">
          <PatientForm />
        </div>

        {/* 2. Medical History */}
        <div className="form-section main-medical-form-width">
          <MedicalHistory />
        </div>

        {/* 3. Vital Signs */}
        <div className="form-section main-medical-form-width">
          <VitalSigns />
        </div>

        {/* 4. Physical Examination */}
        <div className="form-section main-medical-form-width">
          <PhysicalExamination />
        </div>

        {/* 5. Diagnosis & Tests */}
        <div className="form-section main-medical-form-width">
          <div className="diagnosis-tests-form">
            <div className="diagnosis-header">
              <div className="diagnosis-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="diagnosis-header-text">
                <h2 className="diagnosis-title">Diagnosis & Tests</h2>
                <p className="diagnosis-subtitle">Medical diagnosis and laboratory tests</p>
              </div>
            </div>
            <div className="diagnosis-content">
              <div className="diagnosis-field">
                <label className="diagnosis-label">Diagnosis</label>
                <textarea className="diagnosis-textarea input-short" rows={4} placeholder="Enter diagnosis"></textarea>
              </div>
              <div className="diagnosis-field">
                <label className="diagnosis-label">Tests Ordered</label>
                <textarea className="diagnosis-textarea input-short" rows={4} placeholder="Enter tests ordered"></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Treatment Plan */}
        <div className="form-section main-medical-form-width">
          <TreatmentPlan />
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="bottom-actions main-medical-form-width">
        <button className="btn-secondary-large" onClick={handleSaveDraft}>
          Save as Draft
        </button>
        <button className="btn-primary-large" onClick={handleSubmit}>
          Submit Medical Record
        </button>
      </div>
    </div>
  );
};

export default CompleteMedicalRecord;

