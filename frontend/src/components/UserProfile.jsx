import React from 'react'

function UserProfile() {
  return (
    <div className="p-4 sm:p-6 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 font-medium text-sm sm:text-base">S</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-gray-800 text-sm sm:text-base">Sri</div>
          <div className="text-xs sm:text-sm text-gray-500">Unverified Official</div>
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <div className="flex items-center text-xs sm:text-sm text-gray-500">
          <span className="mr-2">📍</span>
          <span>San Diego, CA</span>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 break-all">2041020002.sridhartamarapalli@gmail.com</div>
      </div>
    </div>
  )
}

export default UserProfile
