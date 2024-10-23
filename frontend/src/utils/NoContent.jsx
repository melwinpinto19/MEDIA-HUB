import React from "react";

const NoContentMessage = ({ message }) => {
  return (
    <div className="flex items-center justify-center w-screen">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-sm text-center">
        {/* Icon */}
        <div className="text-gray-400 dark:text-gray-500 mb-4"></div>
        {/* Message */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {message}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          You haven’t added anything yet.
        </p>
        {/* Suggestion */}
      
      </div>
    </div>
  );
};

export default NoContentMessage;
