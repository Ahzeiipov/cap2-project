import React, { useState, useEffect } from 'react';
import '../../assets/style/inventory/medicineDetail.css';
import BatchesTable from '../../components/inventory/BatchesTable';
import BatchDetailModal from '../../components/inventory/BatchDetailModal';
import AddBatchModal from '../../components/inventory/AddBatchModal';
import EditBatchModal from '../../components/inventory/EditBatchModal';
import InventoryBar from '../../components/layout/inventoryBar';
import { getMedicineDetail, getBatchesByMedicine, getBatchDetail } from '../../data/inventoryData';
import type { Batch } from '../../data/inventoryData';

interface MedicineDetailProps {
  medicineId: string;
  medicineName: string;
  onBack: () => void;
}

const MedicineDetail: React.FC<MedicineDetailProps> = ({
  medicineId,
  medicineName,
  onBack
  }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isBatchesOpen, setIsBatchesOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [isEditBatchModalOpen, setIsEditBatchModalOpen] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batchDetails, setBatchDetails] = useState<{ [key: string]: any }>({});
  const [medicineData, setMedicineData] = useState(getMedicineDetail(medicineId) || {
    id: medicineId,
    name: medicineName,
    group: 'Unknown',
    description: {
      genericName: 'N/A',
      strength: 'N/A',
      dosageForm: 'N/A',
      therapeuticClass: 'N/A'
    },
    stock: { total: 0, batches: 0 }
  });

  // Initialize batches and batch details from dummy data
  useEffect(() => {
    const initialBatches = getBatchesByMedicine(medicineId);
    setBatches(initialBatches);
    
    // Initialize batch details
    const details: { [key: string]: any } = {};
    initialBatches.forEach(batch => {
      const detail = getBatchDetail(batch.id);
      if (detail) {
        details[batch.id] = detail;
      }
    });
    setBatchDetails(details);
    
    const detail = getMedicineDetail(medicineId);
    if (detail) {
      setMedicineData(detail);
    }
  }, [medicineId]);

  const handleAddStock = () => {
    setIsAddBatchModalOpen(true);
  };

  const handleSaveBatch = (batchData: {
    batchNo: string;
    supplier: string;
    quantity: number;
    purchaseDate: string;
    expiryDate: string;
    purchasingPrice: number;
    settingPrice: number;
  }) => {
    const batchId = `batch-${Date.now()}`;
    const newBatch: Batch = {
      id: batchId,
      batchNo: batchData.batchNo,
      expiryDate: batchData.expiryDate,
      qty: batchData.quantity,
      remaining: batchData.quantity,
      purchaseDate: batchData.purchaseDate
    };
    
    // Create batch detail
    const newBatchDetail = {
      batchNo: batchData.batchNo,
      supplier: batchData.supplier,
      quantity: batchData.quantity,
      purchaseDate: batchData.purchaseDate,
      expiryDate: batchData.expiryDate,
      purchasingPrice: batchData.purchasingPrice,
      settingPrice: batchData.settingPrice,
      priceUnit: 'Tablet' // Default, can be made configurable
    };
    
    setBatches(prev => [...prev, newBatch]);
    setBatchDetails(prev => ({ ...prev, [batchId]: newBatchDetail }));
    setMedicineData(prev => ({
      ...prev,
      stock: {
        total: prev.stock.total + batchData.quantity,
        batches: prev.stock.batches + 1
      }
    }));
    console.log('New batch added:', newBatch);
    setIsAddBatchModalOpen(false);
  };

  const handleCloseAddBatchModal = () => {
    setIsAddBatchModalOpen(false);
  };

  const handleBatchesClick = () => {
    setIsBatchesOpen(!isBatchesOpen);
  };

  const handleBatchDetailClick = (batchId: string) => {
    setSelectedBatchId(batchId);
  };

  const handleCloseBatchDetail = () => {
    setSelectedBatchId(null);
  };

  const handleEditBatch = () => {
    setIsEditBatchModalOpen(true);
  };

  const handleSaveEditBatch = (batchId: string, batchData: {
    batchNo: string;
    supplier: string;
    quantity: number;
    purchaseDate: string;
    expiryDate: string;
    purchasingPrice: number;
    settingPrice: number;
  }) => {
    const batch = batches.find(b => b.id === batchId);
    if (batch) {
      const oldQty = batch.qty;
      const currentDetail = batchDetails[batchId] || getBatchDetail(batchId);
      
      setBatches(prev =>
        prev.map(b =>
          b.id === batchId
            ? {
                ...b,
                batchNo: batchData.batchNo,
                expiryDate: batchData.expiryDate,
                qty: batchData.quantity,
                remaining: batchData.quantity,
                purchaseDate: batchData.purchaseDate
              }
            : b
        )
      );
      
      // Update batch detail
      setBatchDetails(prev => ({
        ...prev,
        [batchId]: {
          ...(currentDetail || {}),
          batchNo: batchData.batchNo,
          supplier: batchData.supplier,
          quantity: batchData.quantity,
          purchaseDate: batchData.purchaseDate,
          expiryDate: batchData.expiryDate,
          purchasingPrice: batchData.purchasingPrice,
          settingPrice: batchData.settingPrice,
          priceUnit: currentDetail?.priceUnit || 'Tablet'
        }
      }));
      
      setMedicineData(prev => ({
        ...prev,
        stock: {
          total: prev.stock.total - oldQty + batchData.quantity,
          batches: prev.stock.batches
        }
      }));
      console.log('Batch updated:', batchId, batchData);
    }
    setIsEditBatchModalOpen(false);
    handleCloseBatchDetail();
  };

  const handleCloseEditBatchModal = () => {
    setIsEditBatchModalOpen(false);
  };

  const handleDeleteBatch = () => {
    if (selectedBatchId) {
      if (window.confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
        const batch = batches.find(b => b.id === selectedBatchId);
        if (batch) {
          setBatches(prev => prev.filter(b => b.id !== selectedBatchId));
          setBatchDetails(prev => {
            const newState = { ...prev };
            delete newState[selectedBatchId];
            return newState;
          });
          setMedicineData(prev => ({
            ...prev,
            stock: {
              total: Math.max(0, prev.stock.total - batch.qty),
              batches: Math.max(0, prev.stock.batches - 1)
            }
          }));
          console.log('Batch deleted:', selectedBatchId);
        }
        handleCloseBatchDetail();
      }
    }
  };

  // Get batch detail - check state first, then fallback to dummy data
  const selectedBatchDetail = selectedBatchId ? (
    batchDetails[selectedBatchId] || getBatchDetail(selectedBatchId)
  ) : null;

  return (
    <div className="medicine-detail-container">
      {/* Inventory Bar */}
      <InventoryBar
        showBackButton={true}
        onBack={onBack}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Medicine Name and Add Stock Button */}
      <div className="medicine-header">
        <h2 className="medicine-name">{medicineData.name}</h2>
        <button className="add-stock-btn" onClick={handleAddStock}>
          <span className="plus-icon">+</span>
          Add Stock
        </button>
      </div>

      {/* Medicine Detail Card */}
      <div className="detail-card">
        {/* Group */}
        <div className="detail-section group-section">
          <span className="detail-label">Group:</span>
          <span className="detail-value group-value">{medicineData.group}</span>
        </div>

        {/* Description */}
        <div className="detail-section description-section">
          <div className="section-label">Description:</div>
          <div className="description-content">
            <div className="description-item">
              <span className="desc-label">Generic Name:</span>
              <span className="desc-value">{medicineData.description.genericName}</span>
            </div>
            <div className="description-item">
              <span className="desc-label">Strength:</span>
              <span className="desc-value">{medicineData.description.strength}</span>
            </div>
            <div className="description-item">
              <span className="desc-label">Dosage Form:</span>
              <span className="desc-value">{medicineData.description.dosageForm}</span>
            </div>
            <div className="description-item">
              <span className="desc-label">Therapeutic Class:</span>
              <span className="desc-value">{medicineData.description.therapeuticClass}</span>
            </div>
          </div>
        </div>

        {/* Stock */}
        <div className="detail-section stock-section">
          <div className="section-label">Stock:</div>
          <div className="stock-content">
            <div className="stock-item">
              <span className="stock-label">Total:</span>
              <span className="stock-value">{medicineData.stock.total} units</span>
            </div>
            <div className="batches-item" onClick={handleBatchesClick}>
              <span className="batches-count">{medicineData.stock.batches} Batches</span>
              <div className="batches-icons">
                <span className="warning-icon">⚠️</span>
                <svg 
                  className={`dropdown-arrow ${isBatchesOpen ? 'open' : ''}`} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
            {isBatchesOpen && (
              <BatchesTable
                batches={batches}
                onDetailClick={handleBatchDetailClick}
              />
            )}
          </div>
        </div>
      </div>

      {/* Batch Detail Modal */}
      {selectedBatchDetail && (
        <BatchDetailModal
          isOpen={selectedBatchId !== null && !isEditBatchModalOpen}
          onClose={handleCloseBatchDetail}
          batchDetail={selectedBatchDetail}
          onEdit={handleEditBatch}
          onDelete={handleDeleteBatch}
        />
      )}

      {/* Edit Batch Modal */}
      {selectedBatchId && selectedBatchDetail && (
        <EditBatchModal
          isOpen={isEditBatchModalOpen}
          onClose={handleCloseEditBatchModal}
          onSave={handleSaveEditBatch}
          batchId={selectedBatchId}
          batchDetail={selectedBatchDetail}
        />
      )}

      {/* Add Batch Modal */}
      <AddBatchModal
        isOpen={isAddBatchModalOpen}
        onClose={handleCloseAddBatchModal}
        onSave={handleSaveBatch}
        medicineName={medicineData.name}
      />
    </div>
  );
};

export default MedicineDetail;

