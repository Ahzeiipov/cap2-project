import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import type { MedicalRecord, MedicalRecordFormData } from '../types/medical-record'
import SearchBar from '../components/medical-record/SearchBar'
import MedicalRecordTable from '../components/medical-record/MedicalRecordTable'
import MedicalRecordForm from '../components/medical-record/MedicalRecordForm'
import ViewDetailsModal from '../components/medical-record/ViewDetailsModal'


// ... keep initialRecords here temporarily, but should later extract to a seed/data file if reused ...
const initialRecords: MedicalRecord[] = [/* ...sample data as before... */]

export default function MedicalRecordPage() {
  const [records, setRecords] = useState<MedicalRecord[]>(initialRecords)
  const [searchQuery, setSearchQuery] = useState('')
  const [tableSearchQuery, setTableSearchQuery] = useState('')
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null)
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [showFormView, setShowFormView] = useState(false)

  // ...handlers as before...
  // ...generateRecordId, filter logic, handle* functions...

  if (showFormView) {
    return (
      <MedicalRecordForm
        record={editingRecord}
        isOpen={showFormView}
        onClose={() => { setShowFormView(false); setEditingRecord(null); }}
        onSubmit={() => { setShowFormView(false); setEditingRecord(null); }}
      />
    )
  }

  // Fix: Top-aligned clean blue background, card with shadow, grid layout
  return (
    <main className="w-full min-h-screen bg-blue-50 text-gray-900 font-sans px-0 py-0">
      <div className="max-w-7xl mx-auto py-10 px-4 md:px-8">
        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-4xl font-extrabold mb-1 text-gray-900">Medical Record</h1>
            <p className="text-lg font-medium text-gray-500">Manage Organization</p>
          </div>
          <div className="flex gap-3 items-center">
            <SearchBar value={searchQuery} onChange={setSearchQuery} className="bg-gray-100 rounded-2xl px-6 py-2 text-base border border-gray-200 focus:border-blue-400 w-full md:w-80" />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-7 py-3 flex items-center gap-3 text-lg shadow-md border border-blue-500" onClick={() => { setEditingRecord(null); setShowFormView(true); }}>
              <Plus size={24} /> Add New Record
            </button>
          </div>
        </div>

        {/* Card with table and secondary search */}
        <div className="mt-6 bg-white rounded-2xl border border-blue-200 shadow-lg p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">List Of Medical Record</h2>
              <p className="text-sm text-gray-500">{records.length} record{records.length !== 1 ? 's' : ''} found</p>
            </div>
            <SearchBar value={tableSearchQuery} onChange={setTableSearchQuery} className="bg-gray-100 rounded-2xl px-6 py-2 text-base border border-gray-200 focus:border-blue-400 w-full md:w-80" />
          </div>
          <div className="overflow-x-auto mt-1">
            <MedicalRecordTable
              records={records}
              onEdit={() => {}}
              onDelete={() => {}}
              onView={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Details modal if needed */}
      <ViewDetailsModal
        record={viewingRecord}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setViewingRecord(null)
        }}
        onEdit={() => {}}
        onDelete={() => {}}
        onDownload={() => {}}
      />
    </main>
  );
}
