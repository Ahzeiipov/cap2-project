import React from 'react';
import './home.css';

// All displayed strings/labels in variables for future DB fetching
const labels = {
  pageTitle: 'Pharmacy Inventory',
  pageSubtitle: 'Manage and monitor medicine stock',
  search: 'Search',
  availableGroups: 'Available Medicine Group',
  addGroup: '+ Add Group Medicine',
  scanBarCode: 'Scan Bar Code',
  totalMedicines: 'Total Medicines',
  totalStocks: 'Total Stocks',
  groupMedicines: 'Medicines:',
  more: 'More....',
  edit: '✎ Edit',
  delete: '🗑️ Delete',
  moreGroups: 'See More Medicine Groups...'
};

// Dummy medicine groups, as from DB
const medicineGroups = [
  {
    name: 'Pain Relief',
    totalMedicines: 2,
    totalStocks: 770,
    medicines: [
      { name: 'Paracetamol 500mg' },
      { name: 'Ibuprofen 400mg' }
    ]
  },
  // Placeholder: add additional group objects if desired
  {
    name: 'Pain Relief',
    totalMedicines: 2,
    totalStocks: 770,
    medicines: [
      { name: 'Paracetamol 500mg' },
      { name: 'Ibuprofen 400mg' }
    ]
  },
  {
    name: 'Pain Relief',
    totalMedicines: 2,
    totalStocks: 770,
    medicines: [
      { name: 'Paracetamol 500mg' },
      { name: 'Ibuprofen 400mg' }
    ]
  },
  {
    name: 'Pain Relief',
    totalMedicines: 2,
    totalStocks: 770,
    medicines: [
      { name: 'Paracetamol 500mg' },
      { name: 'Ibuprofen 400mg' }
    ]
  }
];

const Home: React.FC = () => {
  return (
    <div className="pharmacy-inventory-outer">
      <header className="pharmacy-header">
        <h1>{labels.pageTitle}</h1>
        <span className="pharmacy-sub">{labels.pageSubtitle}</span>
        <div className="pharmacy-search">
          <input type="text" className="pharmacy-search-input" placeholder={labels.search} />
        </div>
      </header>
      <section className="available-medicine-group">
        <div className="section-header-row">
          <h2>{labels.availableGroups}</h2>
          <div>
            <button className="add-group-btn">{labels.addGroup}</button>
            <button className="scan-bar-btn">{labels.scanBarCode}</button>
          </div>
        </div>
        <div className="medicine-group-list">
          {medicineGroups.map((group, idx) => (
            <div key={idx} className="med-group-card">
              <div className="med-card-title">{group.name}</div>
              <div className="med-card-info">{labels.totalMedicines}: {group.totalMedicines}</div>
              <div className="med-card-info">{labels.totalStocks}: {group.totalStocks} units</div>
              <div className="med-card-label">{labels.groupMedicines}</div>
              <ul className="med-list">
                {group.medicines.map((med, j) => (
                  <li key={j}>{med.name}</li>
                ))}
              </ul>
              <span className="med-card-more">{labels.more}</span>
              <div className="med-card-actions">
                <button className="edit-btn">{labels.edit}</button>
                <button className="delete-btn">{labels.delete}</button>
              </div>
            </div>
          ))}
        </div>
        <div className="medicine-footer">{labels.moreGroups}</div>
      </section>
    </div>
  );
};

export default Home;
