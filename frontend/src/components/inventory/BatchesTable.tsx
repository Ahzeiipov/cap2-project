import React from 'react';
import '../../assets/style/inventory/batchesTable.css';

interface Batch {
  id: string;
  batchNo: string;
  expiryDate: string;
  qty: number;
  remaining: number;
  purchaseDate: string;
}

interface BatchesTableProps {
  batches: Batch[];
  onDetailClick: (batchId: string) => void;
}

const BatchesTable: React.FC<BatchesTableProps> = ({ batches, onDetailClick }) => {
  return (
    <div className="batches-table-wrapper">
      <table className="batches-table">
        <thead>
          <tr>
            <th>Batch No</th>
            <th>Expiry Date</th>
            <th>Qty</th>
            <th>Remaining</th>
            <th>Purchase Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch, index) => (
            <tr key={batch.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              <td className="batch-no">{batch.batchNo}</td>
              <td className="expiry-date">{batch.expiryDate}</td>
              <td className="qty">{batch.qty}</td>
              <td className="remaining">{batch.remaining}</td>
              <td className="purchase-date">{batch.purchaseDate}</td>
              <td className="detail-cell">
                <button
                  className="detail-link"
                  onClick={() => onDetailClick(batch.id)}
                >
                  Detail....
                </button> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BatchesTable;

