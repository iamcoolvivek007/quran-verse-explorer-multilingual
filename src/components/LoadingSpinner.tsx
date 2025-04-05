
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-quran-light rounded-full"></div>
        <div className="w-16 h-16 border-4 border-t-quran-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <span className="ml-4 text-lg text-quran-primary font-semibold">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
