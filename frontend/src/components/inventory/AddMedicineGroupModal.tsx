import React, { useState } from 'react';
import '../../assets/style/inventory/addMedicineGroupModal.css';

interface AddMedicineGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupName: string) => void;
}

const AddMedicineGroupModal: React.FC<AddMedicineGroupModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [groupName, setGroupName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim()) {
      onSave(groupName.trim());
      setGroupName('');
      onClose();
    }
  };

  const handleCancel = () => {
    setGroupName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={handleCancel}></div>

      {/* Modal Card */}
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">New Medicine Group Entry</h2>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="groupName" className="form-label">
              Group Medicine Name:
            </label>
            <input
              type="text"
              id="groupName"
              className="form-input"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter medicine group name"
              autoFocus
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={!groupName.trim()}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddMedicineGroupModal;

