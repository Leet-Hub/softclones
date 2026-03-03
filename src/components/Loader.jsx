import React from 'react';
import './Loader.css';

const Loader = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader-welcome">Welcome To TechNova</div>
        <div className="loader-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
      <div className="loader-watermark">Powered by Leet-Hub</div>
    </div>
  );
};

export default Loader;