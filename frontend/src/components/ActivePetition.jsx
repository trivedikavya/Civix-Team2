import React from 'react'

function ActivePetition({ categories, selectedCategory, onCategoryChange, location }) {

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Active Petitions Near You</h2>
          <LocationFilter location={location} />
        </div>
      </div>

      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />

      {/* Empty State */}
      <div className="p-8 sm:p-12 text-center">
        <p className="text-gray-500 mb-4 text-sm sm:text-base">No petitions found with the current filters.</p>
        <button className="text-blue-500 hover:text-blue-600 font-medium text-sm sm:text-base">
          Clear Filters
        </button>
      </div>
    </div>
  );
};


export default ActivePetition
