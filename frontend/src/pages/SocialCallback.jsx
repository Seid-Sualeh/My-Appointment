import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SocialCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Parse the URL hash parameters
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const token = params.get('token');
    const userStr = params.get('user');
    const error = params.get('error');

    if (error) {
      console.error('Social login error:', error);
      navigate('/login', { state: { error: `Social login failed: ${error}` } });
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));

        // Store token and user in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Dispatch login success action
        dispatch(loginSuccess({ token, user }));

        // Redirect to dashboard or home page
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to parse user data:', err);
        navigate('/login', { state: { error: 'Failed to process social login' } });
      }
    } else {
      // No token or user data - redirect to login with error
      navigate('/login', { state: { error: 'Social login failed - no authentication data received' } });
    }
  }, [navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Processing social login...</p>
      </div>
    </div>
  );
};

export default SocialCallback;