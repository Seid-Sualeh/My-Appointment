// import React from "react";
// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";
// import BusinessDashboard from "../components/dashboard/BusinessDashboard";
// import CustomerDashboard from "../components/dashboard/CustomerDashboard";
// import LoadingSpinner from "../components/common/LoadingSpinner";

// const Dashboard = () => {
//   const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

//   // Show loading spinner while checking authentication
//   if (loading) {
//     return <LoadingSpinner message="Loading dashboard..." />;
//   }

//   // Redirect to login if not authenticated
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // Render appropriate dashboard based on user role
//   switch (user?.role) {
//     case "business":
//       return <BusinessDashboard />;
//     case "customer":
//       return <CustomerDashboard />;
//     default:
//       return (
//         <div className="dashboard-error">
//           <h2>Unknown User Role</h2>
//           <p>Please contact support for assistance.</p>
//         </div>
//       );
//   }
// };

// export default Dashboard;


















import React from "react";
import { useSelector } from "react-redux";
import BusinessDashboard from "../components/dashboard/BusinessDashboard";
import CustomerDashboard from "../components/dashboard/CustomerDashboard";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Dashboard = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Please sign in to view your dashboard
        </h2>
      </div>
    );
  }

  return (
    <div>
      {user.role === "business" ? <BusinessDashboard /> : <CustomerDashboard />}
    </div>
  );
};

export default Dashboard;