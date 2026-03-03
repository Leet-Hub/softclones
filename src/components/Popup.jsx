import React, { useEffect } from 'react';
import './Popup.css';

const Popup = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={`popup-card popup-${type}`} onClick={(e) => e.stopPropagation()}>
        <div className="popup-icon">
          {type === 'success' ? '✓' : '✕'}
        </div>
        <div className="popup-content">
          <p>{message}</p>
        </div>
        <button className="popup-close-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default Popup;