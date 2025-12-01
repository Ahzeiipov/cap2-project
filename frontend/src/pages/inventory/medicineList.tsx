import React, { useState, useEffect } from 'react';
import '../../assets/style/inventory/medicineList.css';
import MedicineStatus from '../../components/ui/medicineStatus';
import BarCodeScanner from '../../components/inventory/BarCodeScanner';
import AddNewMedicineModal from '../../components/inventory/AddNewMedicineModal';
import EditMedicineModal from '../../components/inventory/EditMedicineModal';
import MedicineDetail from './medicineDetail';
import InventoryBar from '../../components/layout/inventoryBar';
import { getMedicinesByGroup, getMedicineDetail } from '../../data/inventoryData';
import type { MedicineListItem } from '../../data/inventoryData';


interface MedicineListProps {
  groupName: string;
  onBack: () => void;
}

const MedicineList: React.FC<MedicineListProps> = ({ groupName, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false);
  const [isEditMedicineModalOpen, setIsEditMedicineModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<{ id: string; name: string } | null>(null);
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);
  const [medicines, setMedicines] = useState<MedicineListItem[]>([]);

  // Initialize medicines from dummy data
  useEffect(() => {
    const initialMedicines = getMedicinesByGroup(groupName);
    setMedicines(initialMedicines);
  }, [groupName]);

  const handleScanBarcode = () => {
    setIsScannerOpen(true);
  };

  const handleScanSuccess = (data: string) => {
    console.log('Scanned data:', data);
    alert(`Scanned: ${data}`);
  };

  const handleCloseScanner = () => {
    setIsScannerOpen(false);
  };

  const handleAddNewMedicine = () => {
    setIsAddMedicineModalOpen(true);
  };

  const handleSaveMedicine = (medicineData: {
    name: string;
    group: string;
    description: string;
    barcode?: File;
    photo?: File;
  }) => {
    const newMedicine: MedicineListItem = {
      id: `med-${Date.now()}`,
      name: medicineData.name,
      stock: 0,
      status: 'Out of Stock'
    };
    setMedicines(prev => [...prev, newMedicine]);
    console.log('New medicine added:', newMedicine);
    setIsAddMedicineModalOpen(false);
  };

  const handleCloseAddMedicineModal = () => {
    setIsAddMedicineModalOpen(false);
  };

  const handleEditMedicine = (medicineId: string) => {
    setEditingMedicineId(medicineId);
    setIsEditMedicineModalOpen(true);
  };

  const handleSaveEditMedicine = (medicineData: {
    id: string;
    name: string;
    group: string;
    description: string;
    barcode?: File;
    photo?: File;
  }) => {
    setMedicines(prev =>
      prev.map(med =>
        med.id === medicineData.id
          ? { ...med, name: medicineData.name }
          : med
      )
    );
    console.log('Medicine updated:', medicineData);
    setIsEditMedicineModalOpen(false);
    setEditingMedicineId(null);
  };

  const handleCloseEditMedicineModal = () => {
    setIsEditMedicineModalOpen(false);
    setEditingMedicineId(null);
  };

  const handleDeleteMedicine = (medicineId: string) => {
    if (window.confirm('Are you sure you want to delete this medicine? This action cannot be undone.')) {
      setMedicines(prev => prev.filter(med => med.id !== medicineId));
      console.log('Medicine deleted:', medicineId);
    }
  };

  const handleDetailClick = (medicineId: string) => {
    const medicine = medicines.find(m => m.id === medicineId);
    if (medicine) {
      setSelectedMedicine({ id: medicine.id, name: medicine.name });
    }
  };

  const handleBackFromDetail = () => {
    setSelectedMedicine(null);
  };

  // Show medicine detail page if a medicine is selected
  if (selectedMedicine) {
    return (
      <MedicineDetail
        medicineId={selectedMedicine.id}
        medicineName={selectedMedicine.name}
        onBack={handleBackFromDetail}
      />
    );
  }

  return (
    <div className="medicine-list-container">
      {/* Inventory Bar */}
      <InventoryBar
        showBackButton={true}
        onBack={onBack}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Section Header with Actions */}
      <div className="section-header">
        <h2 className="section-title">Available Medicine in {groupName} Group</h2>
        <div className="section-actions">
          <button className="action-btn-primary" onClick={handleScanBarcode}>
            Scan Bar Code
          </button>
          <button className="action-btn-primary" onClick={handleAddNewMedicine}>
            <span className="plus-icon">+</span>
            Add New Medicine
          </button>
        </div>
      </div>

      {/* Medicine Table */}
      <div className="table-wrapper">
        <table className="medicine-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine, index) => (
              <tr key={medicine.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td className="medicine-name">{medicine.name}</td>
                <td className="medicine-stock">{medicine.stock}</td>
                <td>
                  <MedicineStatus status={medicine.status} />
                </td>
                <td className="actions-cell">
                  <button
                    className="action-link edit-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditMedicine(medicine.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="action-link delete-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMedicine(medicine.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
                <td className="detail-cell">
                  <button
                    className="detail-link"
                    onClick={() => handleDetailClick(medicine.id)}
                  >
                    Detail....
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Barcode Scanner Modal */}
      <BarCodeScanner
        isOpen={isScannerOpen}
        onClose={handleCloseScanner}
        onScanSuccess={handleScanSuccess}
      />

      {/* Add New Medicine Modal */}
      <AddNewMedicineModal
        isOpen={isAddMedicineModalOpen}
        onClose={handleCloseAddMedicineModal}
        onSave={handleSaveMedicine}
        groupName={groupName}
      />

      {/* Edit Medicine Modal */}
      {editingMedicineId && (() => {
        const medicine = medicines.find(m => m.id === editingMedicineId);
        const medicineDetail = medicine ? getMedicineDetail(editingMedicineId) : null;
        return medicine ? (
          <EditMedicineModal
            isOpen={isEditMedicineModalOpen}
            onClose={handleCloseEditMedicineModal}
            onSave={handleSaveEditMedicine}
            medicineId={editingMedicineId}
            currentName={medicine.name}
            currentGroup={groupName}
            currentDescription={medicineDetail?.description.genericName || ''}
          />
        ) : null;
      })()}
    </div>
  );
};

export default MedicineList;

