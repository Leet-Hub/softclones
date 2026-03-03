import React from 'react';
import './AdminNavbar.css';

const AdminNavbar = ({ onLogout }) => {
  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="admin-navbar-brand">
          <h2>Admin Panel</h2>
        </div>
        
        <button onClick={onLogout} className="admin-logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
