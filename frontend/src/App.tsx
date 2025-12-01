import { useState, useRef } from 'react';
import MedicalRecord from './pages/medical/page';
import CompleteMedicalRecord from './pages/medical/completeMedicalRecord';
import type { MedicalRecordData } from './pages/medical/page';

type Page = 'medical' | 'complete-medical-record';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('medical');
  const [editingRecord, setEditingRecord] = useState<MedicalRecordData | null>(null);
  const addRecordRef = useRef<((record: MedicalRecordData) => void) | null>(null);
  const updateRecordRef = useRef<((record: MedicalRecordData) => void) | null>(null);

  const handleNavigateToForm = () => {
    setEditingRecord(null);
    setCurrentPage('complete-medical-record');
  };

  const handleEditRecord = (record: MedicalRecordData) => {
    setEditingRecord(record);
    setCurrentPage('complete-medical-record');
  };

  const handleBack = () => {
    setEditingRecord(null);
    setCurrentPage('medical');
  };

  const handleAddRecord = (record: MedicalRecordData) => {
    if (addRecordRef.current) {
      addRecordRef.current(record);
    }
  };

  const handleUpdateRecord = (record: MedicalRecordData) => {
    if (updateRecordRef.current) {
      updateRecordRef.current(record);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#fff', minHeight: '100vh' }}>
      {/* Keep MedicalRecord mounted but hidden when on form page */}
      <div style={{ display: currentPage === 'medical' ? 'block' : 'none' }}>
        <MedicalRecord 
          onNavigateToForm={handleNavigateToForm}
          onEditRecord={handleEditRecord}
          onSetAddRecord={(fn) => { addRecordRef.current = fn; }}
          onSetUpdateRecord={(fn) => { updateRecordRef.current = fn; }}
        />
      </div>
      
      {/* Show CompleteMedicalRecord when on form page */}
      {currentPage === 'complete-medical-record' && (
        <CompleteMedicalRecord 
          onBack={handleBack} 
          editingRecord={editingRecord}
          onAddRecord={handleAddRecord}
          onUpdateRecord={handleUpdateRecord}
        />
      )}
    </div>
  );
}

export default App;
