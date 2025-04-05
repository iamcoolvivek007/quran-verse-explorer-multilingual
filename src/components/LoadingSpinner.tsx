
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="relative mb-4">
        <div className="w-16 h-16 border-4 border-quran-light rounded-full"></div>
        <div className="w-16 h-16 border-4 border-t-quran-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <span className="text-lg text-quran-primary font-semibold">Loading Quran data...</span>
      <p className="text-sm text-gray-500 mt-2">Please wait while we retrieve the verses</p>
    </div>
  );
};

export default LoadingSpinner;
