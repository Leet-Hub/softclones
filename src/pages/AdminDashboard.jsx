import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import AdminTable from '../components/AdminTable';
import Popup from '../components/Popup';
import RefreshButton from '../components/RefreshButton';
import { getAllRegistrations, verifyPayment } from '../services/adminApi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const isAuth = sessionStorage.getItem('adminAuth');
    if (!isAuth) {
      navigate('/admin');
      return;
    }

    // Fetch registrations
    fetchRegistrations();
  }, [navigate]);

  const fetchRegistrations = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await getAllRegistrations();
      setRegistrations(data);
    } catch (err) {
      setError('Failed to load registrations. Please try again.');
      console.error('Error fetching registrations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPayment = async (registration, index) => {
    try {
      const result = await verifyPayment(registration, index);
      
      if (result.success) {
        // Update local state
        const updatedRegistrations = [...registrations];
        updatedRegistrations[index] = {
          ...updatedRegistrations[index],
          status: 'Verified',
          tokenNumber: result.tokenNumber
        };
        setRegistrations(updatedRegistrations);

        // ✅ FIXED: Show simple admin-friendly message
        setPopup({
          show: true,
          message: `Payment verified successfully! Confirmation emails with token number and WhatsApp group link have been sent to both team members.`,
          type: 'success'
        });
      } else {
        setPopup({
          show: true,
          message: result.message || 'Failed to verify payment',
          type: 'error'
        });
      }
    } catch (err) {
      setPopup({
        show: true,
        message: 'Error verifying payment. Please try again.',
        type: 'error'
      });
      console.error('Verification error:', err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const closePopup = () => {
    setPopup({ show: false, message: '', type: '' });
  };

  return (
    <div className="admin-dashboard">
      <AdminNavbar onLogout={handleLogout} />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Team Registration Management</h1>
          <p>Total Teams Registered: <span className="count">{registrations.length}</span></p>
        </div>

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={fetchRegistrations} className="retry-btn">Retry</button>
          </div>
        )}

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading team registrations...</p>
          </div>
        ) : (
          <>
            <RefreshButton onRefresh={fetchRegistrations} />
            <AdminTable 
              registrations={registrations}
              onVerify={handleVerifyPayment}
            />
          </>
        )}
      </div>

      {popup.show && (
        <Popup 
          message={popup.message}
          type={popup.type}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default AdminDashboard;