import React from 'react';
import '../../assets/style/medical/medicalRecordDetails.css';

interface MedicalRecordDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  recordData?: {
    patientName: string;
    patientId: string;
    age: string;
    gender: string;
    dateOfVisit: string;
    recordId: string;
    chiefComplaint: string;
    bloodPressure: string;
    temperature: string;
    heartRate: string;
    weight: string;
    medicalHistory: string;
    diagnosis: string;
    currentMedications: string;
    treatmentPlan: string;
    attendingPhysician: string;
    status: 'Completed' | 'Daft';
  };
}

const MedicalRecordDetails: React.FC<MedicalRecordDetailsProps> = ({
  isOpen,
  onClose,
  recordData
}) => {
  if (!isOpen) return null;

  // Default data if none provided
  const data = recordData || {
    patientName: 'Jina sister',
    patientId: 'P-2024-001',
    age: '45 years',
    gender: 'Male',
    dateOfVisit: '1/2/2024',
    recordId: 'MR-2024-001',
    chiefComplaint: 'Elevated blood pressure readings at home',
    bloodPressure: '140/90 mmHg',
    temperature: '98.6°F',
    heartRate: '78 bpm',
    weight: '185 lbs',
    medicalHistory: 'History of hypertension for 5 years, newly diagnosed Type 2 Diabetes',
    diagnosis: 'Hypertension, Type 2 Diabetes',
    currentMedications: 'Lisinopril 10mg daily, Metformin 500mg twice daily',
    treatmentPlan: 'Continue current medications, follow up in 3 months, dietary counseling recommended',
    attendingPhysician: 'Dr. Sarah Johnson',
    status: 'Completed'
  };

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={onClose}></div>

      {/* Modal */}
      <div className="medical-details-modal">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Medical Record Details</h2>
            <p className="modal-subtitle">Complete medical record information for {data.patientName}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Patient Information */}
          <section className="details-section">
            <div className="section-header">
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <h3 className="section-title">Patient Information</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Name</span>
                <span className="info-value">{data.patientName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Patient ID</span>
                <span className="info-value">{data.patientId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Age</span>
                <span className="info-value">{data.age}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Gender</span>
                <span className="info-value">{data.gender}</span>
              </div>
            </div>
          </section>

          {/* Visit Information */}
          <section className="details-section">
            <div className="section-header">
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <h3 className="section-title">Visit Information</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Date of Visit</span>
                <span className="info-value">{data.dateOfVisit}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Record ID</span>
                <span className="info-value">{data.recordId}</span>
              </div>
            </div>
            <div className="info-item full-width">
              <span className="info-label">Chief Complaint</span>
              <span className="info-value">{data.chiefComplaint}</span>
            </div>
          </section>

          {/* Vital Signs */}
          <section className="details-section">
            <div className="section-header">
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <h3 className="section-title">Vital Signs</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Blood Pressure</span>
                <span className="info-value">{data.bloodPressure}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Temperature</span>
                <span className="info-value">{data.temperature}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Heart Rate</span>
                <span className="info-value">{data.heartRate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Weight</span>
                <span className="info-value">{data.weight}</span>
              </div>
            </div>
          </section>

          {/* Medical Details */}
          <section className="details-section">
            <div className="section-header">
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <h3 className="section-title">Medical Details</h3>
            </div>
            <div className="detail-block">
              <span className="detail-label">Medical History</span>
              <p className="detail-text">{data.medicalHistory}</p>
            </div>
            <div className="detail-block">
              <span className="detail-label">Diagnosis</span>
              <p className="detail-text">{data.diagnosis}</p>
            </div>
            <div className="detail-block">
              <span className="detail-label">Current Medications</span>
              <p className="detail-text">{data.currentMedications}</p>
            </div>
            <div className="detail-block">
              <span className="detail-label">Treatment Plan</span>
              <p className="detail-text">{data.treatmentPlan}</p>
            </div>
            <div className="detail-block">
              <span className="detail-label">Attending Physician</span>
              <p className="detail-text">{data.attendingPhysician}</p>
            </div>
            <div className="detail-block">
              <span className="detail-label">Status</span>
              <span className={`status-badge-inline ${data.status.toLowerCase()}`}>
                {data.status}
              </span>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default MedicalRecordDetails;