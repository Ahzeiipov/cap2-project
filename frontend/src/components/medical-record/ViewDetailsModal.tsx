import type { MedicalRecord } from '../../types/medical-record';

type Props = {
  record: MedicalRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (record: MedicalRecord) => void;
  onDelete: (record: MedicalRecord) => void;
  onDownload: (record: MedicalRecord) => void;
};

export default function ViewDetailsModal({record, isOpen, onClose, onEdit, onDelete, onDownload}: Props) {
  if (!isOpen || !record) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Medical Record Detail</h2>
        <pre className="mb-4 text-left whitespace-pre-wrap">{JSON.stringify(record, null, 2)}</pre>
        <div className="flex gap-2">
          <button className="text-blue-600" onClick={()=>onEdit(record)}>Edit</button>
          <button className="text-red-600" onClick={()=>onDelete(record)}>Delete</button>
          <button className="text-indigo-700" onClick={()=>onDownload(record)}>Download</button>
          <button className="text-gray-500 ml-auto" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
