import React from 'react';
import VerifyButton from './VerifyButton';
import './AdminTable.css';

const AdminTable = ({ registrations, onVerify }) => {
  if (!registrations || registrations.length === 0) {
    return (
      <div className="no-data">
        <p>No registrations found</p>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Timestamp</th>
              <th>Member 1 Name</th>
              <th>Member 1 Email</th>
              <th>Member 1 Phone</th>
              <th>Member 2 Name</th>
              <th>Member 2 Email</th>
              <th>Member 2 Phone</th>
              <th>College</th>
              <th>Event</th>
              <th>Payment Method</th>
              <th>Transaction ID</th>
              <th>Token</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{reg.timestamp ? new Date(reg.timestamp).toLocaleString() : '-'}</td>
                <td>{reg.name1}</td>
                <td>{reg.email1}</td>
                <td>{reg.phone1}</td>
                <td>{reg.name2}</td>
                <td>{reg.email2}</td>
                <td>{reg.phone2}</td>
                <td>{reg.college}</td>
                <td>{reg.event}</td>
                <td>
                  <span className="payment-method-badge">
                    {reg.paymentMethod || '-'}
                  </span>
                </td>
                <td className="transaction-id">{reg.transactionId}</td>
                <td>{reg.tokenNumber || '-'}</td>
                <td>
                  <span className={`status-badge status-${reg.status?.toLowerCase() || 'pending'}`}>
                    {reg.status || 'Pending'}
                  </span>
                </td>
                <td>
                  <VerifyButton 
                    registration={reg}
                    index={index}
                    onVerify={onVerify}
                    isVerified={reg.status === 'Verified'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;