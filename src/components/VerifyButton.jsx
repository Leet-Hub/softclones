import React, { useState } from 'react';
import './VerifyButton.css';

const VerifyButton = ({ registration, index, onVerify, isVerified }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isVerified || isLoading) return;

    setIsLoading(true);
    try {
      await onVerify(registration, index);
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <button className="verify-btn verified" disabled>
        ✓ Verified
      </button>
    );
  }

  return (
    <button 
      className="verify-btn"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? 'Verifying...' : 'Verify Payment'}
    </button>
  );
};

export default VerifyButton;