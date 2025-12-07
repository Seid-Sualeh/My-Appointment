import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./Home";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Dashboard from "./Dashboard";
import Appointments from "./Appointments";
import BusinessAdmin from "./BusinessAdmin";
import Profile from "./Profile";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";
import ResendVerification from "./ResendVerification";
import SocialCallback from "./SocialCallback";
import NotFound from "./NotFound";
import ProtectedRoute from "../components/common/ProtectedRoute";

function AllRoutes() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/forgot-password"
        element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/reset-password/:token"
        element={!user ? <ResetPassword /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/verify-email/:token"
        element={!user ? <VerifyEmail /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/resend-verification"
        element={!user ? <ResendVerification /> : <Navigate to="/dashboard" />}
      />
      <Route path="/auth/social-callback" element={<SocialCallback />} />

      <Route path="/" element={<Home />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/appointments/book" element={<Appointments />} />
        <Route path="/profile" element={<Profile />} />

        {user?.role === "business" && (
          <Route path="/business-admin" element={<BusinessAdmin />} />
        )}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AllRoutes;
