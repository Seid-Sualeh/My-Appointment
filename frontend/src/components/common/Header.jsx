// import React from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../store/authSlice";
// import "./Header.css";

// const Header = () => {
//   const { user, isAuthenticated } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };

//   const isActive = (path) => {
//     return location.pathname === path ? "active" : "";
//   };

//   return (
//     <header className="header">
//       <nav className="navbar">
//         <div className="nav-container">
//           <Link to="/" className="nav-logo">
//             <h2>AppointmentHub</h2>
//           </Link>

//           <ul className="nav-menu">
//             <li className="nav-item">
//               <Link to="/" className={`nav-link ${isActive("/")}`}>
//                 Home
//               </Link>
//             </li>

//             {isAuthenticated ? (
//               <>
//                 <li className="nav-item">
//                   <Link
//                     to="/dashboard"
//                     className={`nav-link ${isActive("/dashboard")}`}
//                   >
//                     Dashboard
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link
//                     to="/appointments"
//                     className={`nav-link ${isActive("/appointments")}`}
//                   >
//                     My Appointments
//                   </Link>
//                 </li>

//                 {user?.role === "business" && (
//                   <li className="nav-item">
//                     <Link
//                       to="/business-admin"
//                       className={`nav-link ${isActive("/business-admin")}`}
//                     >
//                       Business Admin
//                     </Link>
//                   </li>
//                 )}

//                 <li className="nav-item">
//                   <Link
//                     to="/profile"
//                     className={`nav-link ${isActive("/profile")}`}
//                   >
//                     Profile
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <button
//                     onClick={handleLogout}
//                     className="nav-link logout-btn"
//                   >
//                     Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li className="nav-item">
//                   <Link
//                     to="/login"
//                     className={`nav-link ${isActive("/login")}`}
//                   >
//                     Login
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link
//                     to="/register"
//                     className={`nav-link ${isActive("/register")}`}
//                   >
//                     Register
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>

//           <div className="hamburger">
//             <span className="bar"></span>
//             <span className="bar"></span>
//             <span className="bar"></span>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import {
  CalendarDaysIcon,
  UserCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AppointMate</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Dashboard
                </Link>
                {user.role === "business" && (
                  <Link
                    to="/business-admin"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Business Admin
                  </Link>
                )}
                <Link
                  to="/appointments"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Appointments
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/features"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Features
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Contact
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <UserCircleIcon className="h-8 w-8 text-gray-600" />
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
