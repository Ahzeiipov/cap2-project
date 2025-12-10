import { useState, useRef, useEffect } from 'react';
import MainLayout from './components/MainLayout';
import MedicalRecord from './pages/medical/page';
import CompleteMedicalRecord from './pages/medical/completeMedicalRecord';
import Inventory from './pages/inventory/page';
import type { MedicalRecordData } from './pages/medical/page';

// Map paths to page identifiers - clean and maintainable
const PATH_TO_PAGE: Record<string, 'medical' | 'complete-medical-record' | 'inventory'> = {
  '/medical': 'medical',
  '/inventory': 'inventory',
  '/dashboard': 'medical', // Default dashboard to medical for now
  '/attendance': 'medical',
  '/appointment': 'medical',
  '/settings': 'medical',
};

function App() {
  const [currentPage, setCurrentPage] = useState<'medical' | 'complete-medical-record' | 'inventory'>('medical');
  const [editingRecord, setEditingRecord] = useState<MedicalRecordData | null>(null);
  const addRecordRef = useRef<((record: MedicalRecordData) => void) | null>(null);
  const updateRecordRef = useRef<((record: MedicalRecordData) => void) | null>(null);

  // Expose navigation function globally for MenuSideBar - just pass the path!
  useEffect(() => {
    (window as any).navigate = (path: string) => {
      const page = PATH_TO_PAGE[path] || 'medical';
      setCurrentPage(page);
      // Reset editing record when switching pages
      if (page !== 'complete-medical-record') {
        setEditingRecord(null);
      }
    };
    // Update currentPage on window for sidebar active state
    const currentPath = Object.keys(PATH_TO_PAGE).find(
      path => PATH_TO_PAGE[path] === currentPage
    ) || '/medical';
    (window as any).currentPage = currentPath;
    
    return () => {
      delete (window as any).navigate;
      delete (window as any).currentPage;
    };
  }, [currentPage]);

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
    <MainLayout>
      {/* Medical Records List Page */}
      {currentPage === 'medical' && (
        <MedicalRecord 
          onNavigateToForm={handleNavigateToForm}
          onEditRecord={handleEditRecord}
          onSetAddRecord={(fn) => { addRecordRef.current = fn; }}
          onSetUpdateRecord={(fn) => { updateRecordRef.current = fn; }}
        />
      )}
      
      {/* Complete Medical Record Form Page */}
      {currentPage === 'complete-medical-record' && (
        <CompleteMedicalRecord 
          onBack={handleBack} 
          editingRecord={editingRecord}
          onAddRecord={handleAddRecord}
          onUpdateRecord={handleUpdateRecord}
        />
      )}

      {/* Inventory Page */}
      {currentPage === 'inventory' && (
        <Inventory />
      )}
    </MainLayout>
  );
}

export default App;
