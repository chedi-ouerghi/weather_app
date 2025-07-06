import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="relative">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;