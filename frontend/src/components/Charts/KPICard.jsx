import React from 'react';

const KPICard = ({ title, value, subtitle, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-orange-500 hover:shadow-lg transition ${onClick ? 'cursor-pointer' : ''}`}
    >
      <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-2">{title}</p>
      <p className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
    </div>
  );
};

export default KPICard;