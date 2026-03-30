import React from 'react';

const ChartCard = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default ChartCard;