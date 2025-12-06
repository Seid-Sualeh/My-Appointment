import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./src/components/common/Layout";
import ProtectedRoute from "./src/components/common/ProtectedRoute";
import Home from "./src/pages/Home";
import Login from "./src/components/auth/Login";
import Register from "./src/components/auth/Register";
import Dashboard from "./src/pages/Dashboard";
import Appointments from "./src/pages/Appointments";
import BusinessAdmin from "./src/pages/BusinessAdmin";
import Profile from "./src/pages/Profile";
import ForgotPassword from "./src/pages/ForgotPassword";
import ResetPassword from "./src/pages/ResetPassword";
import VerifyEmail from "./src/pages/VerifyEmail";
import ResendVerification from "./src/pages/ResendVerification";
import SocialCallback from "./src/pages/SocialCallback";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
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
          element={
            !user ? <ResendVerification /> : <Navigate to="/dashboard" />
          }
        />
        <Route path="/auth/social-callback" element={<SocialCallback />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/book" element={<Appointments />} />
          <Route path="/profile" element={<Profile />} />

          {user?.role === "business" && (
            <Route path="/business-admin" element={<BusinessAdmin />} />
          )}
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
