import type { MedicalRecord } from '../../types/medical-record';
import StatusPill from './StatusPill';
import ActionMenu from './ActionMenu';

type Props = {
  records: MedicalRecord[];
  onEdit: (record: MedicalRecord) => void;
  onDelete: (record: MedicalRecord) => void;
  onView: (record: MedicalRecord) => void;
  onDownload?: (record: MedicalRecord) => void;
};

export default function MedicalRecordTable({ records, onEdit, onDelete, onView }: Props) {
  return (
    <table className="min-w-full border-t divide-y divide-gray-200">
      <thead>
        <tr className="bg-gray-50 text-gray-700 text-sm">
          <th className="px-4 py-3 font-semibold text-left">Record ID</th>
          <th className="px-4 py-3 font-semibold text-left">Patient Name</th>
          <th className="px-4 py-3 font-semibold text-left">Patient ID</th>
          <th className="px-4 py-3 font-semibold text-left">Age / Gender</th>
          <th className="px-4 py-3 font-semibold text-left">Date of Visit</th>
          <th className="px-4 py-3 font-semibold text-left">Diagnosis</th>
          <th className="px-4 py-3 font-semibold text-left">Doctor</th>
          <th className="px-4 py-3 font-semibold text-left">Status</th>
          <th className="px-4 py-3 font-semibold text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {records.map(record => (
          <tr key={record.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 whitespace-nowrap">{record.recordId}</td>
            <td className="px-4 py-3 whitespace-nowrap">{record.patientName}</td>
            <td className="px-4 py-3 whitespace-nowrap">{record.patientId}</td>
            <td className="px-4 py-3 whitespace-nowrap">{record.age} / {record.gender}</td>
            <td className="px-4 py-3 whitespace-nowrap">{record.dateOfVisit}</td>
            <td className="px-4 py-3">{record.diagnosis.join(', ')}</td>
            <td className="px-4 py-3 whitespace-nowrap">{record.doctor}</td>
            <td className="px-4 py-3"><StatusPill status={record.status} /></td>
            <td className="px-4 py-3"><ActionMenu /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
