import React, { useState } from 'react';
import '../../assets/style/inventory/inventory.css';
import MedicineGroupCard from '../../components/inventory/MedicineGroupCard';
import BarCodeScanner from '../../components/inventory/BarCodeScanner';
import AddMedicineGroupModal from '../../components/inventory/AddMedicineGroupModal';
import EditMedicineGroupModal from '../../components/inventory/EditMedicineGroupModal';
import MedicineList from './medicineList';
import InventoryBar from '../../components/layout/inventoryBar';
import { medicineGroupsData } from '../../data/inventoryData';
import type { MedicineGroup } from '../../data/inventoryData';



const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  
  // Use dummy data
  const [medicineGroups, setMedicineGroups] = useState<MedicineGroup[]>(medicineGroupsData);

  const handleEdit = (groupId: string) => {
    setEditingGroupId(groupId);
    setIsEditGroupModalOpen(true);
  };

  const handleSaveEdit = (groupId: string, newName: string) => {
    setMedicineGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? { ...group, title: newName }
          : group
      )
    );
    setIsEditGroupModalOpen(false);
    setEditingGroupId(null);
    console.log('Group updated:', groupId, newName);
  };

  const handleCloseEditModal = () => {
    setIsEditGroupModalOpen(false);
    setEditingGroupId(null);
  };

  const handleDelete = (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this medicine group? This action cannot be undone.')) {
      setMedicineGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
      console.log('Group deleted:', groupId);
    }
  };

  const handleScanBarcode = () => {
    setIsScannerOpen(true);
  };

  const handleScanSuccess = (data: string) => {
    console.log('Scanned data:', data);
    // Handle the scanned data here (e.g., search for medicine, add to inventory, etc.)
    alert(`Scanned: ${data}`);
  };

  const handleCloseScanner = () => {
    setIsScannerOpen(false);
  };

  const handleAddGroup = () => {
    setIsAddGroupModalOpen(true);
  };

  const handleSaveGroup = (groupName: string) => {
    const newGroup: MedicineGroup = {
      id: Date.now().toString(),
      title: groupName,
      totalMedicines: 0,
      totalStocks: 0,
      medicines: []
    };
    setMedicineGroups([...medicineGroups, newGroup]);
    console.log('New group added:', newGroup);
  };

  const handleCloseAddGroupModal = () => {
    setIsAddGroupModalOpen(false);
  };

  const handleGroupClick = (groupId: string) => {
    const group = medicineGroups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group.title);
    }
  };

  const handleBackToList = () => {
    setSelectedGroup(null);
  };

  // Show medicine list if a group is selected
  if (selectedGroup) {
    return <MedicineList groupName={selectedGroup} onBack={handleBackToList} />;
  }

  return (
    <div className="inventory-container">
      {/* Inventory Bar */}
      <InventoryBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Action Buttons */}
      <div className="actions-bar">
        <button className="action-btn-primary" onClick={handleScanBarcode}>
          Scan Bar Code
        </button>
        <button className="action-btn-primary" onClick={handleAddGroup}>
          <span className="plus-icon">+</span>
          Add Group Medicine
        </button>
      </div>

      {/* Main Content */}
      <div className="content-section">
        <h2 className="section-title">Available Medicine Group</h2>
        
        <div className="medicine-groups-grid">
          {medicineGroups.map((group) => (
            <div
              key={group.id}
              onClick={() => handleGroupClick(group.id)}
              style={{ cursor: 'pointer' }}
            >
              <MedicineGroupCard
                title={group.title}
                totalMedicines={group.totalMedicines}
                totalStocks={group.totalStocks}
                medicines={group.medicines}
                onEdit={(e) => {
                  e?.stopPropagation();
                  handleEdit(group.id);
                }}
                onDelete={(e) => {
                  e?.stopPropagation();
                  handleDelete(group.id);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      <BarCodeScanner
        isOpen={isScannerOpen}
        onClose={handleCloseScanner}
        onScanSuccess={handleScanSuccess}
      />

      {/* Add Medicine Group Modal */}
      <AddMedicineGroupModal
        isOpen={isAddGroupModalOpen}
        onClose={handleCloseAddGroupModal}
        onSave={handleSaveGroup}
      />

      {/* Edit Medicine Group Modal */}
      {editingGroupId && (
        <EditMedicineGroupModal
          isOpen={isEditGroupModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
          groupId={editingGroupId}
          currentName={medicineGroups.find(g => g.id === editingGroupId)?.title || ''}
        />
      )}
    </div>
  );
};

export default InventoryPage;

