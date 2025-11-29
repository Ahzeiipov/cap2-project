import type { MedicalRecord, MedicalRecordFormData } from '../../types/medical-record';

type Props = {
  record: MedicalRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: MedicalRecordFormData) => void;
  isFullPage?: boolean;
};

export default function MedicalRecordForm({record, isOpen, onClose, onSubmit, isFullPage}: Props) {
  if (!isOpen) return null;
  return (
    <div className={isFullPage ? 'p-8' : 'p-4'}>
      {/* Form implementation goes here */}
      <h2 className="text-xl font-bold mb-4">{record ? 'Edit Medical Record' : 'Add Medical Record'}</h2>
      <button onClick={onClose} className="btn btn-sm">Back</button>
      {/* Further form fields go here */}
    </div>
  );
}
