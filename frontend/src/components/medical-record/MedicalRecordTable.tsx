import type { MedicalRecord } from '../../types/medical-record'
import StatusBadge from './StatusBadge'
import ActionMenu from './ActionMenu'
import './MedicalRecordTable.css'

interface MedicalRecordTableProps {
  records: MedicalRecord[]
  onEdit?: (record: MedicalRecord) => void
  onDelete?: (record: MedicalRecord) => void
  onView?: (record: MedicalRecord) => void
  onDownload?: (record: MedicalRecord) => void
}

export default function MedicalRecordTable({ 
  records, 
  onEdit, 
  onDelete, 
  onView,
  onDownload
}: MedicalRecordTableProps) {
  return (
    <div className="medical-record-table-container">
      <table className="medical-record-table">
        <thead>
          <tr>
            <th>Record ID</th>
            <th>Patient Name</th>
            <th>Patient ID</th>
            <th>Age / Gender</th>
            <th>Date of Visit</th>
            <th>Diagnosis</th>
            <th>Doctor</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={9} className="medical-record-table__empty">
                No records found
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.id}>
                <td>{record.recordId}</td>
                <td>{record.patientName}</td>
                <td>{record.patientId}</td>
                <td>{record.age} / {record.gender}</td>
                <td>{record.dateOfVisit}</td>
                <td>{record.diagnosis.join(', ')}</td>
                <td>{record.doctor}</td>
                <td>
                  <StatusBadge status={record.status} />
                </td>
                <td>
                  <ActionMenu
                    onEdit={() => onEdit?.(record)}
                    onDelete={() => onDelete?.(record)}
                    onView={() => onView?.(record)}
                    onDownload={() => onDownload?.(record)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

