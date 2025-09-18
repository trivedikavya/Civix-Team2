import React from 'react'

function Location({ location }) {

  return (
    <div className="flex items-center space-x-2 flex-wrap">
      <span className="text-xs sm:text-sm text-gray-600">Showing for:</span>
      <div className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-2 sm:px-3 py-1 rounded-full">
        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
        <span className="text-xs sm:text-sm font-medium">{location}</span>
        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
      </div>
    </div>
  );
};

export default Location
