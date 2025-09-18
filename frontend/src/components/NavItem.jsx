import React from "react";

function Navigation({ icon: Icon, label, isActive = false, href = "#" }) {
  return (
    <div>
      <li>
        <a
          href={href}
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm sm:text-base ${
            isActive
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="truncate">{label}</span>
        </a>
      </li>
    </div>
  );
}

export default Navigation;
