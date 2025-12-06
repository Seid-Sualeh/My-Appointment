import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { verifyEmail } from "../store/authSlice";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        const result = await dispatch(verifyEmail(token));

        if (verifyEmail.fulfilled.match(result)) {
          setIsVerified(true);
          setMessage("Email verified successfully! You can now login.");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else if (verifyEmail.rejected.match(result)) {
          setError(result.payload?.message || "Failed to verify email");
        }
      } catch (err) {
        setError("An error occurred while verifying your email");
        console.error("Email verification failed:", err);
      }
    };

    verifyUserEmail();
  }, [token, dispatch, navigate]);

  if (loading) {
    return <LoadingSpinner message="Verifying email..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">{message}</p>
                </div>
              </div>
            </div>
          )}

          {!error && !message && (
            <div className="text-center">
              <p className="text-gray-600">Verifying your email address...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
