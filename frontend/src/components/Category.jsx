import React from 'react'


function Category({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="p-4 sm:p-6 border-b border-gray-200">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
              category === selectedCategory
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};


export default Category;
