import React, { useState, useEffect } from 'react';
import "../../assets/style/medical/medical.css";
import StatusBadge from '../../components/ui/status';
import ActionMenu from '../../components/medical/actionMenu';
import MedicalRecordDetails from '../../components/medical/medicalRecordDetails';






export interface MedicalRecordData {
  recordId: string;
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  dateOfVisit: string;
  diagnosis: string;
  doctor: string;
  status: 'Completed' | 'Daft';
}

interface MedicalRecordProps {
  onNavigateToForm?: () => void;
  onEditRecord?: (record: MedicalRecordData) => void;
  onSetAddRecord?: (fn: (record: MedicalRecordData) => void) => void;
  onSetUpdateRecord?: (fn: (record: MedicalRecordData) => void) => void;
}

const MedicalRecord: React.FC<MedicalRecordProps> = ({ 
  onNavigateToForm, 
  onEditRecord,
  onSetAddRecord,
  onSetUpdateRecord
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecordData | null>(null);
  const [records, setRecords] = useState<MedicalRecordData[]>([
    {
      recordId: 'MR-2024-001',
      patientName: 'Emily Done',
      patientId: 'P-2024-001',
      age: 54,
      gender: 'Female',
      dateOfVisit: '1/15/2024',
      diagnosis: 'Osteoarthritis, Migraine',
      doctor: 'Dr. Michael Chen',
      status: 'Completed'
    },
    {
      recordId: 'MR-2024-002',
      patientName: 'John Smith',
      patientId: 'P-2024-002',
      age: 45,
      gender: 'Male',
      dateOfVisit: '1/16/2024',
      diagnosis: 'Hypertension',
      doctor: 'Dr. Sarah Johnson',
      status: 'Daft'
    }
  ]);

  // Filter records based on search
  const filteredRecords = records.filter(record => {
    const searchLower = tableSearchTerm.toLowerCase();
    return (
      record.recordId.toLowerCase().includes(searchLower) ||
      record.patientName.toLowerCase().includes(searchLower) ||
      record.patientId.toLowerCase().includes(searchLower) ||
      record.diagnosis.toLowerCase().includes(searchLower) ||
      record.doctor.toLowerCase().includes(searchLower)
    );
  });

  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    setMenuPosition({
      top: rect.bottom + 5,
      left: rect.left - 200, // Offset to show menu to the left of the button
    });
    setActiveMenu(index);
  };

  const handleCloseMenu = () => {
    setActiveMenu(null);
  };

  const handleViewDetails = (index: number) => {
    setSelectedRecord(filteredRecords[index]);
    setIsDetailsOpen(true);
    handleCloseMenu();
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedRecord(null);
  };

  const handleEditRecord = (index: number) => {
    const record = filteredRecords[index];
    if (onEditRecord) {
      onEditRecord(record);
    }
    handleCloseMenu();
  };

  // Create add/update functions and expose them to parent
  useEffect(() => {
    const addRecord = (record: MedicalRecordData) => {
      setRecords(prev => {
        // Check if record already exists (by recordId)
        const exists = prev.find(r => r.recordId === record.recordId);
        if (exists) {
          // If exists, update it instead
          return prev.map(r => r.recordId === record.recordId ? record : r);
        }
        // Add new record at the beginning of the list
        return [record, ...prev];
      });
    };

    const updateRecord = (record: MedicalRecordData) => {
      setRecords(prev => prev.map(r => 
        r.recordId === record.recordId ? record : r
      ));
    };

    // Also store globally as backup
    (window as any).addMedicalRecord = addRecord;
    (window as any).updateMedicalRecord = updateRecord;

    // Expose to parent via callbacks
    if (onSetAddRecord) {
      onSetAddRecord(addRecord);
    }
    if (onSetUpdateRecord) {
      onSetUpdateRecord(updateRecord);
    }
    
    // Cleanup on unmount
    return () => {
      delete (window as any).addMedicalRecord;
      delete (window as any).updateMedicalRecord;
    };
  }, [onSetAddRecord, onSetUpdateRecord]);

  const handleDownloadPDF = (index: number) => {
    const record = filteredRecords[index];
    handleCloseMenu();
    
    // Create PDF content
    const pdfContent = `
MEDICAL RECORD REPORT
=====================

Record ID: ${record.recordId}
Patient Name: ${record.patientName}
Patient ID: ${record.patientId}
Age: ${record.age}
Gender: ${record.gender}
Date of Visit: ${record.dateOfVisit}
Diagnosis: ${record.diagnosis}
Doctor: ${record.doctor}
Status: ${record.status}

Generated on: ${new Date().toLocaleDateString()}
Generated at: ${new Date().toLocaleTimeString()}

---
This is a medical record document.
Please keep this document confidential.
    `;

    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Medical_Record_${record.recordId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`PDF downloaded for ${record.recordId}`);
  };

  const handleDeleteRecord = (index: number) => {
    const record = filteredRecords[index];
    if (window.confirm(`Are you sure you want to delete medical record ${record.recordId}? This action cannot be undone.`)) {
      setRecords(prev => prev.filter(r => r.recordId !== record.recordId));
      handleCloseMenu();
      alert(`Record ${record.recordId} has been deleted.`);
    }
  };


  return (
    <div className="medical-record-container" style={{ padding: '20px', background: '#fff' }}>
      <div className="header">
        <div className="header-left">
          <h1 className="title">Medical Record</h1>
          <p className="subtitle">Manage Organization</p>
        </div>
        <div className="header-right">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="actions-bar">
        <button
          className="add-record-btn"
          onClick={onNavigateToForm}
        >
          <span className="plus-icon">+</span>
          Add New Record
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="table-header-left">
            <h2 className="table-title">List Of Medical Record</h2>
            <p className="record-count">{filteredRecords.length} records found</p>
          </div>
          <div className="table-header-right">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search"
                value={tableSearchTerm}
                onChange={(e) => setTableSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        <table className="medical-table">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Patient Name</th>
              <th>Patient ID</th>
              <th>Age / Gender</th>
              <th>Date of Visit</th>
              <th>Diagnosis</th>
              <th>Doctor</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr key={record.recordId}>
                <td>{record.recordId}</td>
                <td>{record.patientName}</td>
                <td>{record.patientId}</td>
                <td>{record.age} / {record.gender}</td>
                <td>{record.dateOfVisit}</td>
                <td>{record.diagnosis}</td>
                <td>{record.doctor}</td>
                <td>
  <StatusBadge status={record.status} />
</td>
                <td>
                  <button 
                    className="action-btn"
                    onClick={(e) => handleActionClick(e, index)}
                  >
                    ⋮
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Menu */}
      <ActionMenu
        isOpen={activeMenu !== null}
        onClose={handleCloseMenu}
        position={menuPosition}
        onViewDetails={() => handleViewDetails(activeMenu!)}
        onEditRecord={() => handleEditRecord(activeMenu!)}
        onDownloadPDF={() => handleDownloadPDF(activeMenu!)}
        onDeleteRecord={() => handleDeleteRecord(activeMenu!)}
      />
      {/* Modal for record details */}
      <MedicalRecordDetails
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        recordData={selectedRecord as any}
      />
    </div>
  );
};

export default MedicalRecord;