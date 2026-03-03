import React from 'react';

const RefreshButton = ({ onRefresh }) => {
    return (
        <button onClick={onRefresh} className="refresh-button">
            Refresh
        </button>
    );
};

export default RefreshButton;