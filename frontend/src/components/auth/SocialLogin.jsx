

import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

// Define a fallback URL for development/safety
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SocialLogin = () => {
  const handleGoogleLogin = () => {
    try {
      // Get API URL from environment variables with fallback
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      if (!apiUrl) {
        console.error("API URL is not configured");
        alert(
          "Authentication service is not properly configured. Please try again later."
        );
        return;
      }

      // Construct the full URL for the backend Google OAuth initiation endpoint
      const googleAuthUrl = `${apiUrl}/auth/google`;
      console.log(`Redirecting to Google auth: ${googleAuthUrl}`);
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("Failed to initiate Google login. Please try again.");
    }
  };

  const handleFacebookLogin = () => {
    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      if (!apiUrl) {
        console.error("API URL is not configured");
        alert(
          "Authentication service is not properly configured. Please try again later."
        );
        return;
      }

      const facebookAuthUrl = `${apiUrl}/auth/facebook`;
      console.log(`Redirecting to Facebook auth: ${facebookAuthUrl}`);
      window.location.href = facebookAuthUrl;
    } catch (error) {
      console.error("Error during Facebook login:", error);
      alert("Failed to initiate Facebook login. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
        >
          <FcGoogle className="h-5 w-5 mr-2" />
          Google
        </button>
        <button
          type="button"
          onClick={handleFacebookLogin}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
        >
          <FaFacebook className="h-5 w-5 mr-2 text-blue-600" />
          Facebook
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
