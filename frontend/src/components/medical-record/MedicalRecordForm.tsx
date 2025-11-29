import { FormEvent, useState, useEffect } from 'react'
import { User, FileText, Activity, Stethoscope, X, Calendar, Pencil, Trash2, Heart, Pill, Download, Plus, ArrowLeft } from 'lucide-react'
import type { MedicalRecord, MedicalRecordFormData, MedicalRecordStatus } from '../../types/medical-record'
import { formatDateForInput, formatDateForDisplay } from '../../utils/date-format'
import './MedicalRecordForm.css'

interface MedicalRecordFormProps {
  record?: MedicalRecord | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: MedicalRecordFormData) => void
  isFullPage?: boolean
}

const initialFormData: MedicalRecordFormData = {
  patientName: '',
  patientId: '',
  age: 0,
  gender: 'Male',
  dateOfVisit: '',
  diagnosis: [],
  doctor: '',
  status: 'draft',
  dateOfBirth: '',
  address: '',
  contactNumber: '',
  chiefComplaint: '',
  allergies: {
    hasAllergies: false,
    details: '',
  },
  chronicDiseases: {
    hasDiseases: false,
    details: '',
  },
  pastSurgeries: '',
  familyHistories: '',
  currentMedications: '',
  vitalSigns: {
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    pulseRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
  },
  physicalExamination: {
    generalAppearance: '',
    cardiovascular: '',
    respiratory: '',
    abdominal: '',
    neurological: '',
    additionalFindings: '',
  },
  diagnosisAndTests: {
    provisionalDiagnosis: '',
    laboratoryTestsOrdered: {
      cbc: false,
      urineTest: false,
      xRay: false,
      ecg: false,
      other: '',
    },
    testResultsFindings: '',
  },
  treatmentPlanDetails: {
    medicationsPrescribed: '',
    proceduresPerformed: '',
    lifestyleAdvice: '',
  },
  doctorCertification: {
    doctorName: '',
    medicalLicenseNumbers: ['', '', ''],
    dateOfBirth: '',
    physicalDocumentStamp: false,
  },
}

export default function MedicalRecordForm({
  record,
  isOpen,
  onClose,
  onSubmit,
  isFullPage = false,
}: MedicalRecordFormProps) {
  const [formData, setFormData] = useState<MedicalRecordFormData>(initialFormData)
  const [diagnosisInput, setDiagnosisInput] = useState('')

  useEffect(() => {
    if (record) {
      setFormData({
        patientName: record.patientName,
        patientId: record.patientId,
        age: record.age,
        gender: record.gender,
        dateOfVisit: formatDateForInput(record.dateOfVisit),
        diagnosis: record.diagnosis,
        doctor: record.doctor,
        status: record.status,
        dateOfBirth: record.dateOfBirth ? formatDateForInput(record.dateOfBirth) : '',
        address: record.address || '',
        contactNumber: record.contactNumber || '',
        chiefComplaint: record.chiefComplaint || '',
        allergies: record.allergies || { hasAllergies: false, details: '' },
        chronicDiseases: record.chronicDiseases || { hasDiseases: false, details: '' },
        pastSurgeries: record.pastSurgeries || '',
        familyHistories: record.familyHistories || '',
        currentMedications: record.currentMedications?.join(', ') || '',
        vitalSigns: record.vitalSigns || initialFormData.vitalSigns,
        physicalExamination: record.physicalExamination || initialFormData.physicalExamination,
        diagnosisAndTests: record.diagnosisAndTests || initialFormData.diagnosisAndTests,
        treatmentPlanDetails: record.treatmentPlanDetails || initialFormData.treatmentPlanDetails,
        doctorCertification: record.doctorCertification || initialFormData.doctorCertification,
      })
      setDiagnosisInput(record.diagnosis.join(', '))
    } else {
      setFormData(initialFormData)
      setDiagnosisInput('')
    }
  }, [record, isOpen])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const submitData: MedicalRecordFormData = {
      ...formData,
      dateOfVisit: formatDateForDisplay(formData.dateOfVisit),
      dateOfBirth: formData.dateOfBirth ? formatDateForDisplay(formData.dateOfBirth) : undefined,
      // Ensure currentMedications is properly formatted
      currentMedications: formData.currentMedications || '',
    }
    onSubmit(submitData)
    setFormData(initialFormData)
    setDiagnosisInput('')
    onClose()
  }

  const handleDiagnosisChange = (value: string) => {
    setDiagnosisInput(value)
    const diagnoses = value.split(',').map((d) => d.trim()).filter((d) => d.length > 0)
    setFormData({ ...formData, diagnosis: diagnoses })
  }

  if (!isOpen) return null

  const formContent = (
    <>
      <header className="medical-record-form-header">
          <div className="medical-record-form-header-left">
            {isFullPage && (
              <button
                type="button"
                className="medical-record-form-back-btn"
                onClick={onClose}
                aria-label="Back to list"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="medical-record-form-title">Medical Record</h1>
              <p className="medical-record-form-subtitle">Manage and monitor medicine stock</p>
            </div>
          </div>
          <div className="medical-record-form-header-search">
            <input type="text" placeholder="Search" className="search-input" />
          </div>
        </header>

        <form className="medical-record-form" onSubmit={handleSubmit}>
          {/* Patient Information Card */}
          <div className="form-card">
            <div className="form-card-header">
              <div className="form-card-title-section">
                <User size={24} className="form-card-icon" />
                <div>
                  <h3 className="form-card-title">Patient Information</h3>
                  <p className="form-card-subtitle">Basic patients details and contacts information</p>
                </div>
              </div>
              <div className="form-card-actions">
                <button type="button" className="form-card-action-btn form-card-action-btn--edit" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <button type="button" className="form-card-action-btn form-card-action-btn--delete" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="form-card-content">
              <div className="form-grid">
                <div className="form-field">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="Clinic CareLink Network"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Gender</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                      />
                      <span>Female</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                      />
                      <span>Male</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="Other"
                        checked={formData.gender === 'Other'}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                      />
                      <span>Other</span>
                    </label>
                  </div>
                </div>
                <div className="form-field">
                  <label>Date of Birth</label>
                  <div className="input-with-icon">
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                    <Calendar size={18} className="input-icon" />
                  </div>
                </div>
                <div className="form-field">
                  <label>Age</label>
                  <select
                    value={formData.age || ''}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    required
                  >
                    <option value="">Select Age</option>
                    {Array.from({ length: 100 }, (_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>ID</label>
                  <input
                    type="text"
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    placeholder="P-2024-001"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
                <div className="form-field">
                  <label>Contact Number</label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    placeholder="Enter contact number"
                  />
                </div>
                <div className="form-field">
                  <label>Date Of Visit</label>
                  <input
                    type="date"
                    value={formData.dateOfVisit}
                    onChange={(e) => setFormData({ ...formData, dateOfVisit: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Medical History Card */}
          <div className="form-card">
            <div className="form-card-header">
              <div className="form-card-title-section">
                <FileText size={24} className="form-card-icon" />
                <div>
                  <h3 className="form-card-title">Medical History</h3>
                  <p className="form-card-subtitle">Patient's Medical Background And Current Condition</p>
                </div>
              </div>
              <div className="form-card-actions">
                <button type="button" className="form-card-action-btn form-card-action-btn--edit" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <button type="button" className="form-card-action-btn form-card-action-btn--delete" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="form-card-content">
              <div className="form-grid">
                <div className="form-field form-field--full">
                  <label>Chief Complaint <span className="required">*</span></label>
                  <textarea
                    value={formData.chiefComplaint}
                    onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                    placeholder="What brings the patient in today?"
                    rows={4}
                    required
                  />
                </div>
                <div className="form-field form-field--full">
                  <label>Allergies</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="allergies"
                        checked={!formData.allergies?.hasAllergies}
                        onChange={() => setFormData({
                          ...formData,
                          allergies: { hasAllergies: false, details: '' },
                        })}
                      />
                      <span>No Known Allergies</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="allergies"
                        checked={formData.allergies?.hasAllergies}
                        onChange={() => setFormData({
                          ...formData,
                          allergies: { hasAllergies: true, details: formData.allergies?.details || '' },
                        })}
                      />
                      <span>Has Allergies</span>
                    </label>
                  </div>
                  {formData.allergies?.hasAllergies && (
                    <input
                      type="text"
                      value={formData.allergies.details || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        allergies: { hasAllergies: true, details: e.target.value },
                      })}
                      placeholder="Specify allergies"
                      className="mt-2"
                    />
                  )}
                </div>
                <div className="form-field form-field--full">
                  <label>Chronic Diseases</label>
                  <p className="field-subtitle">Select all that apply</p>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="chronicDiseases"
                        checked={!formData.chronicDiseases?.hasDiseases}
                        onChange={() => setFormData({
                          ...formData,
                          chronicDiseases: { hasDiseases: false, details: '' },
                        })}
                      />
                      <span>No Known Diseases</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="chronicDiseases"
                        checked={formData.chronicDiseases?.hasDiseases}
                        onChange={() => setFormData({
                          ...formData,
                          chronicDiseases: { hasDiseases: true, details: formData.chronicDiseases?.details || '' },
                        })}
                      />
                      <span>Has Chronic Diseases</span>
                    </label>
                  </div>
                  {formData.chronicDiseases?.hasDiseases && (
                    <input
                      type="text"
                      value={formData.chronicDiseases.details || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        chronicDiseases: { hasDiseases: true, details: e.target.value },
                      })}
                      placeholder="Specify chronic diseases"
                      className="mt-2"
                    />
                  )}
                </div>
                <div className="form-field">
                  <label>Past Surgeries</label>
                  <input
                    type="text"
                    value={formData.pastSurgeries}
                    onChange={(e) => setFormData({ ...formData, pastSurgeries: e.target.value })}
                    placeholder="Enter past surgeries"
                  />
                </div>
                <div className="form-field">
                  <label>Family Histories</label>
                  <input
                    type="text"
                    value={formData.familyHistories}
                    onChange={(e) => setFormData({ ...formData, familyHistories: e.target.value })}
                    placeholder="Enter family histories"
                  />
                </div>
                <div className="form-field form-field--full">
                  <label>Current Medications</label>
                  <textarea
                    value={formData.currentMedications}
                    onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                    placeholder="List current medications"
                    rows={4}
                  />
                </div>
                <div className="form-field form-field--full">
                  <label>Diagnosis</label>
                  <input
                    type="text"
                    value={diagnosisInput}
                    onChange={(e) => handleDiagnosisChange(e.target.value)}
                    placeholder="Enter diagnosis (comma-separated)"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Attending Physician</label>
                  <input
                    type="text"
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    placeholder="e.g., Dr. Sarah Johnson"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as MedicalRecordStatus })}
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Vital Signs Card */}
          <div className="form-card">
            <div className="form-card-header">
              <div className="form-card-title-section">
                <Activity size={24} className="form-card-icon" />
                <div>
                  <h3 className="form-card-title">Vital Signs</h3>
                  <p className="form-card-subtitle">Current Vital Measurements</p>
                </div>
              </div>
              <div className="form-card-actions">
                <button type="button" className="form-card-action-btn form-card-action-btn--edit" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <button type="button" className="form-card-action-btn form-card-action-btn--delete" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="form-card-content">
              <div className="form-grid">
                <div className="form-field">
                  <label>Height</label>
                  <div className="input-with-dropdown">
                    <input
                      type="text"
                      value={formData.vitalSigns?.height || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, height: e.target.value },
                      })}
                      placeholder="Enter height"
                    />
                    <select
                      value={formData.vitalSigns?.heightUnit || 'cm'}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, heightUnit: e.target.value as 'cm' | 'ft' },
                      })}
                    >
                      <option value="cm">cm</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                </div>
                <div className="form-field">
                  <label>Weight</label>
                  <div className="input-with-dropdown">
                    <input
                      type="text"
                      value={formData.vitalSigns?.weight || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, weight: e.target.value },
                      })}
                      placeholder="Enter weight"
                    />
                    <select
                      value={formData.vitalSigns?.weightUnit || 'kg'}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, weightUnit: e.target.value as 'kg' | 'lbs' },
                      })}
                    >
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                  </div>
                </div>
                <div className="form-field">
                  <label>Blood Pressure</label>
                  <div className="blood-pressure-input">
                    <input
                      type="text"
                      value={formData.vitalSigns?.bloodPressureSystolic || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, bloodPressureSystolic: e.target.value },
                      })}
                      placeholder="Systolic"
                    />
                    <span>/</span>
                    <input
                      type="text"
                      value={formData.vitalSigns?.bloodPressureDiastolic || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, bloodPressureDiastolic: e.target.value },
                      })}
                      placeholder="Diastolic"
                    />
                    <span>mmHg</span>
                  </div>
                </div>
                <div className="form-field">
                  <label>Pulse Rate</label>
                  <div className="input-with-unit">
                    <input
                      type="text"
                      value={formData.vitalSigns?.pulseRate || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, pulseRate: e.target.value },
                      })}
                      placeholder="Enter pulse rate"
                    />
                    <span>bpm</span>
                  </div>
                </div>
                <div className="form-field">
                  <label>Temperature</label>
                  <div className="input-with-unit">
                    <input
                      type="text"
                      value={formData.vitalSigns?.temperature || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, temperature: e.target.value },
                      })}
                      placeholder="Enter temperature"
                    />
                    <span>°C</span>
                  </div>
                </div>
                <div className="form-field">
                  <label>Respiratory Rate</label>
                  <div className="input-with-unit">
                    <input
                      type="text"
                      value={formData.vitalSigns?.respiratoryRate || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, respiratoryRate: e.target.value },
                      })}
                      placeholder="Enter respiratory rate"
                    />
                    <span>min</span>
                  </div>
                </div>
                <div className="form-field">
                  <label>Oxygen Saturation</label>
                  <div className="input-with-unit">
                    <input
                      type="text"
                      value={formData.vitalSigns?.oxygenSaturation || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, oxygenSaturation: e.target.value },
                      })}
                      placeholder="Enter oxygen saturation"
                    />
                    <span>%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Examination Card */}
          <div className="form-card">
            <div className="form-card-header">
              <div className="form-card-title-section">
                <Stethoscope size={24} className="form-card-icon" />
                <div>
                  <h3 className="form-card-title">Physical Examination</h3>
                  <p className="form-card-subtitle">Detailed examination findings by system</p>
                </div>
              </div>
              <div className="form-card-actions">
                <button type="button" className="form-card-action-btn form-card-action-btn--edit" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <button type="button" className="form-card-action-btn form-card-action-btn--delete" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="form-card-content">
              <div className="form-grid">
                <div className="form-field form-field--full">
                  <label>General Appearance</label>
                  <textarea
                    value={formData.physicalExamination?.generalAppearance || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      physicalExamination: {
                        ...formData.physicalExamination,
                        generalAppearance: e.target.value,
                      },
                    })}
                    placeholder="Enter general appearance notes"
                    rows={4}
                  />
                </div>
                <div className="form-field">
                  <label>Cardiovascular</label>
                  <input
                    type="text"
                    value={formData.physicalExamination?.cardiovascular || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      physicalExamination: {
                        ...formData.physicalExamination,
                        cardiovascular: e.target.value,
                      },
                    })}
                    placeholder="Enter cardiovascular findings"
                  />
                </div>
                <div className="form-field">
                  <label>Respiratory</label>
                  <input
                    type="text"
                    value={formData.physicalExamination?.respiratory || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      physicalExamination: {
                        ...formData.physicalExamination,
                        respiratory: e.target.value,
                      },
                    })}
                    placeholder="Enter respiratory findings"
                  />
                </div>
                <div className="form-field">
                  <label>Abdominal</label>
                  <input
                    type="text"
                    value={formData.physicalExamination?.abdominal || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      physicalExamination: {
                        ...formData.physicalExamination,
                        abdominal: e.target.value,
                      },
                    })}
                    placeholder="Enter abdominal findings"
                  />
                </div>
                <div className="form-field">
                  <label>Neurological</label>
                  <input
                    type="text"
                    value={formData.physicalExamination?.neurological || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      physicalExamination: {
                        ...formData.physicalExamination,
                        neurological: e.target.value,
                      },
                    })}
                    placeholder="Enter neurological findings"
                  />
                </div>
                <div className="form-field form-field--full">
                  <label>Additional Findings</label>
                  <textarea
                    value={formData.physicalExamination?.additionalFindings || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      physicalExamination: {
                        ...formData.physicalExamination,
                        additionalFindings: e.target.value,
                      },
                    })}
                    placeholder="Enter additional findings"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis & Tests Card */}
          <div className="form-card">
            <div className="form-card-header">
              <div className="form-card-title-section">
                <Heart size={24} className="form-card-icon" style={{ color: '#ec4899' }} />
                <div>
                  <h3 className="form-card-title">Diagnosis & Tests</h3>
                  <p className="form-card-subtitle">Diagnostic assessment and laboratory investigations</p>
                </div>
              </div>
              <div className="form-card-actions">
                <button type="button" className="form-card-action-btn form-card-action-btn--edit" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <button type="button" className="form-card-action-btn form-card-action-btn--delete" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="form-card-content">
              <div className="form-grid">
                <div className="form-field form-field--full">
                  <label>Provisional Diagnosis</label>
                  <textarea
                    value={formData.diagnosisAndTests?.provisionalDiagnosis || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      diagnosisAndTests: {
                        ...formData.diagnosisAndTests,
                        provisionalDiagnosis: e.target.value,
                      },
                    })}
                    placeholder="Enter provisional diagnosis"
                    rows={4}
                  />
                </div>
                <div className="form-field form-field--full">
                  <label>Laboratory Tests Ordered</label>
                  <p className="field-subtitle">Select all tests requested</p>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.diagnosisAndTests?.laboratoryTestsOrdered?.cbc || false}
                        onChange={(e) => setFormData({
                          ...formData,
                          diagnosisAndTests: {
                            ...formData.diagnosisAndTests,
                            laboratoryTestsOrdered: {
                              ...formData.diagnosisAndTests?.laboratoryTestsOrdered,
                              cbc: e.target.checked,
                            },
                          },
                        })}
                      />
                      <span>CBC</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.diagnosisAndTests?.laboratoryTestsOrdered?.urineTest || false}
                        onChange={(e) => setFormData({
                          ...formData,
                          diagnosisAndTests: {
                            ...formData.diagnosisAndTests,
                            laboratoryTestsOrdered: {
                              ...formData.diagnosisAndTests?.laboratoryTestsOrdered,
                              urineTest: e.target.checked,
                            },
                          },
                        })}
                      />
                      <span>Urine Test</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.diagnosisAndTests?.laboratoryTestsOrdered?.xRay || false}
                        onChange={(e) => setFormData({
                          ...formData,
                          diagnosisAndTests: {
                            ...formData.diagnosisAndTests,
                            laboratoryTestsOrdered: {
                              ...formData.diagnosisAndTests?.laboratoryTestsOrdered,
                              xRay: e.target.checked,
                            },
                          },
                        })}
                      />
                      <span>X-Ray</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.diagnosisAndTests?.laboratoryTestsOrdered?.ecg || false}
                        onChange={(e) => setFormData({
                          ...formData,
                          diagnosisAndTests: {
                            ...formData.diagnosisAndTests,
                            laboratoryTestsOrdered: {
                              ...formData.diagnosisAndTests?.laboratoryTestsOrdered,
                              ecg: e.target.checked,
                            },
                          },
                        })}
                      />
                      <span>ECG</span>
                    </label>
                  </div>
                  {formData.diagnosisAndTests?.laboratoryTestsOrdered && (
                    <input
                      type="text"
                      value={formData.diagnosisAndTests.laboratoryTestsOrdered.other || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        diagnosisAndTests: {
                          ...formData.diagnosisAndTests,
                          laboratoryTestsOrdered: {
                            ...formData.diagnosisAndTests?.laboratoryTestsOrdered,
                            other: e.target.value,
                          },
                        },
                      })}
                      placeholder="Other tests"
                      className="mt-2"
                    />
                  )}
                </div>
                <div className="form-field form-field--full">
                  <label>Test Results & Findings</label>
                  <textarea
                    value={formData.diagnosisAndTests?.testResultsFindings || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      diagnosisAndTests: {
                        ...formData.diagnosisAndTests,
                        testResultsFindings: e.target.value,
                      },
                    })}
                    placeholder="Enter test results and findings"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Plan Card */}
          <div className="form-card">
            <div className="form-card-header">
              <div className="form-card-title-section">
                <Pill size={24} className="form-card-icon" style={{ color: '#a855f7' }} />
                <div>
                  <h3 className="form-card-title">Treatment Plan</h3>
                  <p className="form-card-subtitle">Prescribed medications and care instructions</p>
                </div>
              </div>
              <div className="form-card-actions">
                <button type="button" className="form-card-action-btn form-card-action-btn--edit" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <button type="button" className="form-card-action-btn form-card-action-btn--delete" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="form-card-content">
              <div className="form-grid">
                <div className="form-field form-field--full">
                  <label>Medications Prescribed</label>
                  <p className="field-subtitle">Include drug name, dosage, frequency, and duration</p>
                  <textarea
                    value={formData.treatmentPlanDetails?.medicationsPrescribed || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      treatmentPlanDetails: {
                        ...formData.treatmentPlanDetails,
                        medicationsPrescribed: e.target.value,
                      },
                    })}
                    placeholder="Enter prescribed medications"
                    rows={4}
                  />
                </div>
                <div className="form-field form-field--full">
                  <label>Procedures Performed</label>
                  <textarea
                    value={formData.treatmentPlanDetails?.proceduresPerformed || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      treatmentPlanDetails: {
                        ...formData.treatmentPlanDetails,
                        proceduresPerformed: e.target.value,
                      },
                    })}
                    placeholder="Enter procedures performed"
                    rows={4}
                  />
                </div>
                <div className="form-field form-field--full">
                  <label>Lifestyle Advice & Self-Care Instructions</label>
                  <p className="field-subtitle">Lifestyle advice, precautions, and self-care instructions</p>
                  <textarea
                    value={formData.treatmentPlanDetails?.lifestyleAdvice || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      treatmentPlanDetails: {
                        ...formData.treatmentPlanDetails,
                        lifestyleAdvice: e.target.value,
                      },
                    })}
                    placeholder="Enter lifestyle advice and self-care instructions"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Doctor's Certification Card */}
          <div className="form-card">
            <div className="form-card-header">
              <div className="form-card-title-section">
                <FileText size={24} className="form-card-icon" style={{ color: '#6b7280' }} />
                <div>
                  <h3 className="form-card-title">Doctor's Certification</h3>
                  <p className="form-card-subtitle">Physician verification and signature</p>
                </div>
              </div>
              <div className="form-card-actions">
                <button type="button" className="form-card-action-btn form-card-action-btn--edit" aria-label="Edit">
                  <Pencil size={16} />
                </button>
                <button type="button" className="form-card-action-btn form-card-action-btn--delete" aria-label="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="form-card-content">
              <div className="form-grid">
                <div className="form-field form-field--full">
                  <label>Doctor's Name</label>
                  <input
                    type="text"
                    value={formData.doctorCertification?.doctorName || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      doctorCertification: {
                        ...formData.doctorCertification,
                        doctorName: e.target.value,
                      },
                    })}
                    placeholder="Enter doctor's name"
                  />
                </div>
                <div className="form-field">
                  <label>Medical License Number</label>
                  <input
                    type="text"
                    value={formData.doctorCertification?.medicalLicenseNumbers?.[0] || ''}
                    onChange={(e) => {
                      const licenses = formData.doctorCertification?.medicalLicenseNumbers || ['', '', '']
                      licenses[0] = e.target.value
                      setFormData({
                        ...formData,
                        doctorCertification: {
                          ...formData.doctorCertification,
                          medicalLicenseNumbers: licenses,
                        },
                      })
                    }}
                    placeholder="Enter license number"
                  />
                </div>
                <div className="form-field">
                  <label>Date of Birth</label>
                  <div className="input-with-icon">
                    <input
                      type="date"
                      value={formData.doctorCertification?.dateOfBirth ? formatDateForInput(formData.doctorCertification.dateOfBirth) : ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        doctorCertification: {
                          ...formData.doctorCertification,
                          dateOfBirth: e.target.value,
                        },
                      })}
                    />
                    <Calendar size={18} className="input-icon" />
                  </div>
                </div>
                <div className="form-field">
                  <label>Medical License Number</label>
                  <input
                    type="text"
                    value={formData.doctorCertification?.medicalLicenseNumbers?.[1] || ''}
                    onChange={(e) => {
                      const licenses = formData.doctorCertification?.medicalLicenseNumbers || ['', '', '']
                      licenses[1] = e.target.value
                      setFormData({
                        ...formData,
                        doctorCertification: {
                          ...formData.doctorCertification,
                          medicalLicenseNumbers: licenses,
                        },
                      })
                    }}
                    placeholder="Enter license number"
                  />
                </div>
                <div className="form-field">
                  <label>Medical License Number</label>
                  <input
                    type="text"
                    value={formData.doctorCertification?.medicalLicenseNumbers?.[2] || ''}
                    onChange={(e) => {
                      const licenses = formData.doctorCertification?.medicalLicenseNumbers || ['', '', '']
                      licenses[2] = e.target.value
                      setFormData({
                        ...formData,
                        doctorCertification: {
                          ...formData.doctorCertification,
                          medicalLicenseNumbers: licenses,
                        },
                      })
                    }}
                    placeholder="Enter license number"
                  />
                </div>
                <div className="form-field form-field--full">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.doctorCertification?.physicalDocumentStamp || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        doctorCertification: {
                          ...formData.doctorCertification,
                          physicalDocumentStamp: e.target.checked,
                        },
                      })}
                    />
                    <span>Official clinic/hospital stamp has been applied to physical document</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions form-actions--extended">
            <div className="form-actions__left">
              <button type="button" className="btn btn--draft" onClick={() => {
                setFormData({ ...formData, status: 'draft' })
              }}>
                Draft
              </button>
              <button type="button" className="btn btn--excel" onClick={() => {
                // Handle Excel download
                alert('Excel download functionality would be implemented here')
              }}>
                <Download size={16} />
                Download EXCEL
              </button>
            </div>
            <div className="form-actions__right">
              <button type="button" className="btn btn--ghost" onClick={onClose}>
                {isFullPage ? 'Back' : 'Cancel'}
              </button>
              <button type="submit" className="btn btn--primary">
                {record ? (
                  <>
                    <Plus size={16} />
                    Save Edited Record
                  </>
                ) : (
                  'Save Record'
                )}
              </button>
            </div>
          </div>
        </form>
      </>
    )

  if (isFullPage) {
    return (
      <div className="medical-record-form-fullpage">
        {formContent}
      </div>
    )
  }

  return (
    <div className="medical-record-form-overlay" onClick={onClose}>
      <div className="medical-record-form-container" onClick={(e) => e.stopPropagation()}>
        {formContent}
      </div>
    </div>
  )
}
