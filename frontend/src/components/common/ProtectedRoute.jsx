// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import LoadingSpinner from "./LoadingSpinner";

// const ProtectedRoute = ({
//   children,
//   requiredRole = null,
//   requireAuth = true,
// }) => {
//   const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
//   const location = useLocation();

//   // Show loading spinner while checking authentication
//   if (loading) {
//     return <LoadingSpinner message="Verifying access..." />;
//   }

//   // If authentication is required but user is not authenticated
//   if (requireAuth && !isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // If specific role is required but user doesn't have it
//   if (requiredRole && user?.role !== requiredRole) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // If user is authenticated but trying to access auth pages, redirect to dashboard
//   if (
//     !requireAuth &&
//     isAuthenticated &&
//     (location.pathname === "/login" || location.pathname === "/register")
//   ) {
//     const redirectPath =
//       user.role === "business" ? "/business-admin" : "/dashboard";
//     return <Navigate to={redirectPath} replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;









import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ roles = [] }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;