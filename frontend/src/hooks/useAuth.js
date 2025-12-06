import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearError } from "../store/authSlice";
import api from "../services/api";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const response = await api.get("/auth/me");
          dispatch(setUser(response.data.user));
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };

    fetchUser();
  }, [token, user, dispatch]);

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    loading,
    error,
    clearAuthError,
    isAuthenticated: !!token && !!user,
    isBusiness: user?.role === "business",
    isCustomer: user?.role === "customer",
  };
};

export default useAuth;
