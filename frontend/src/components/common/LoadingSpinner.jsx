



import React from "react";

const LoadingSpinner = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "h-6 w-6 border-2",
    medium: "h-12 w-12 border-4",
    large: "h-16 w-16 border-4",
  };

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="relative">
        {/* Multi-colored spinner with green, yellow, red */}
        <div
          className={`${sizeClasses[size]} rounded-full border-t-green-500 border-r-yellow-500 border-b-red-500 border-l-transparent animate-spin`}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`${sizeClasses[size].split(" ")[0]} ${
              sizeClasses[size].split(" ")[1]
            } rounded-full border-gray-200 opacity-20`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;