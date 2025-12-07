import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">404</h2>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Page Not Found
          </h3>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
          >
            Go back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
