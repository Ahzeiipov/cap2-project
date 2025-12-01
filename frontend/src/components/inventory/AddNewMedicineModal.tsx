import React, { useState } from 'react';
import '../../assets/style/inventory/addNewMedicineModal.css';

interface AddNewMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicineData: {
    name: string;
    group: string;
    description: string;
    barcode?: File;
    photo?: File;
  }) => void;
  groupName?: string;
}

const AddNewMedicineModal: React.FC<AddNewMedicineModalProps> = ({
  isOpen,
  onClose,
  onSave,
  groupName = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    group: groupName,
    description: '',
    barcode: null as File | null,
    photo: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'barcode' | 'photo') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.group.trim()) {
      onSave({
        name: formData.name.trim(),
        group: formData.group.trim(),
        description: formData.description.trim(),
        barcode: formData.barcode || undefined,
        photo: formData.photo || undefined
      });
      // Reset form
      setFormData({
        name: '',
        group: groupName,
        description: '',
        barcode: null,
        photo: null
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      group: groupName,
      description: '',
      barcode: null,
      photo: null
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={handleCancel}></div>

      {/* Modal Card */}
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">New Medicine Registration</h2>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Medicine Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Medicine Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter medicine name"
              required
              autoFocus
            />
          </div>

          {/* Medicine Group */}
          <div className="form-group">
            <label htmlFor="group" className="form-label">
              Medicine Group:
            </label>
            <input
              type="text"
              id="group"
              name="group"
              className="form-input"
              value={formData.group}
              onChange={handleInputChange}
              placeholder="Enter medicine group"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter medicine description"
              rows={4}
            />
          </div>

          {/* Bar Code */}
          <div className="form-group">
            <label htmlFor="barcode" className="form-label">
              Bar Code:
            </label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="barcode"
                name="barcode"
                className="file-input"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, 'barcode')}
              />
              <label htmlFor="barcode" className="file-upload-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                {formData.barcode ? formData.barcode.name : 'Upload barcode'}
              </label>
            </div>
          </div>

          {/* Photo */}
          <div className="form-group">
            <label htmlFor="photo" className="form-label">
              Photo:
            </label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="photo"
                name="photo"
                className="file-input"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'photo')}
              />
              <label htmlFor="photo" className="file-upload-label">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                {formData.photo ? formData.photo.name : 'Upload photo'}
              </label>
            </div>
          </div>

          {/* Form Actions */}
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
              disabled={!formData.name.trim() || !formData.group.trim()}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddNewMedicineModal;

