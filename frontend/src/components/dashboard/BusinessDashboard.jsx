// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import LoadingSpinner from "../common/LoadingSpinner";
// import { getBusinessDashboard } from "../../services/appointmentService";
// import "./BusinessDashboard.css";

// const BusinessDashboard = () => {
//   const { user } = useSelector((state) => state.auth);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [timeRange, setTimeRange] = useState("week"); // week, month, year

//   useEffect(() => {
//     fetchDashboardData();
//   }, [timeRange]);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const data = await getBusinessDashboard(timeRange);
//       setDashboardData(data);
//     } catch (err) {
//       setError(err.message || "Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <LoadingSpinner message="Loading dashboard..." />;
//   }

//   if (error) {
//     return (
//       <div className="dashboard-error">
//         <h3>Error Loading Dashboard</h3>
//         <p>{error}</p>
//         <button onClick={fetchDashboardData}>Try Again</button>
//       </div>
//     );
//   }

//   const stats = dashboardData?.stats || {};
//   const recentAppointments = dashboardData?.recentAppointments || [];

//   return (
//     <div className="business-dashboard">
//       <div className="dashboard-header">
//         <h1>Business Dashboard</h1>
//         <div className="dashboard-controls">
//           <select
//             value={timeRange}
//             onChange={(e) => setTimeRange(e.target.value)}
//             className="time-range-selector"
//           >
//             <option value="week">This Week</option>
//             <option value="month">This Month</option>
//             <option value="year">This Year</option>
//           </select>
//           <Link to="/business-admin" className="manage-business-btn">
//             Manage Business
//           </Link>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="stats-grid">
//         <div className="stat-card">
//           <div className="stat-icon">📅</div>
//           <div className="stat-content">
//             <h3>{stats.totalAppointments || 0}</h3>
//             <p>Total Appointments</p>
//           </div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon">✅</div>
//           <div className="stat-content">
//             <h3>{stats.completedAppointments || 0}</h3>
//             <p>Completed</p>
//           </div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon">⏳</div>
//           <div className="stat-content">
//             <h3>{stats.pendingAppointments || 0}</h3>
//             <p>Pending</p>
//           </div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon">💰</div>
//           <div className="stat-content">
//             <h3>${stats.totalRevenue || 0}</h3>
//             <p>Revenue</p>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="quick-actions">
//         <h2>Quick Actions</h2>
//         <div className="actions-grid">
//           <Link to="/appointments/new" className="action-card">
//             <div className="action-icon">➕</div>
//             <h3>New Appointment</h3>
//             <p>Manually create an appointment</p>
//           </Link>

//           <Link to="/time-slots/manage" className="action-card">
//             <div className="action-icon">🕐</div>
//             <h3>Manage Time Slots</h3>
//             <p>Update availability schedule</p>
//           </Link>

//           <Link to="/business/settings" className="action-card">
//             <div className="action-icon">⚙️</div>
//             <h3>Business Settings</h3>
//             <p>Update business information</p>
//           </Link>

//           <Link to="/reports" className="action-card">
//             <div className="action-icon">📊</div>
//             <h3>View Reports</h3>
//             <p>Detailed analytics and reports</p>
//           </Link>
//         </div>
//       </div>

//       {/* Recent Appointments */}
//       <div className="recent-appointments">
//         <div className="section-header">
//           <h2>Recent Appointments</h2>
//           <Link to="/appointments">View All</Link>
//         </div>

//         {recentAppointments.length === 0 ? (
//           <div className="empty-state">
//             <p>No appointments found</p>
//             <Link to="/appointments/new" className="btn-primary">
//               Schedule First Appointment
//             </Link>
//           </div>
//         ) : (
//           <div className="appointments-list">
//             {recentAppointments.map((appointment) => (
//               <div key={appointment._id} className="appointment-item">
//                 <div className="appointment-info">
//                   <h4>{appointment.customer?.name}</h4>
//                   <p>{appointment.service}</p>
//                   <span className={`status status-${appointment.status}`}>
//                     {appointment.status}
//                   </span>
//                 </div>
//                 <div className="appointment-details">
//                   <p>{new Date(appointment.date).toLocaleDateString()}</p>
//                   <p>
//                     {appointment.timeSlot?.startTime} -{" "}
//                     {appointment.timeSlot?.endTime}
//                   </p>
//                 </div>
//                 <div className="appointment-actions">
//                   <Link
//                     to={`/appointments/${appointment._id}`}
//                     className="btn-secondary"
//                   >
//                     View
//                   </Link>
//                   {appointment.status === "pending" && (
//                     <button className="btn-primary">Confirm</button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Calendar Preview */}
//       <div className="calendar-preview">
//         <div className="section-header">
//           <h2>Upcoming Schedule</h2>
//           <Link to="/calendar">View Calendar</Link>
//         </div>
//         <AppointmentCalendar />
//       </div>
//     </div>
//   );
// };

// // Import Calendar component (would be separate file in real implementation)
// const AppointmentCalendar = () => {
//   return (
//     <div className="calendar-placeholder">
//       <p>Calendar view would be implemented here</p>
//       <p>Showing upcoming appointments for the next 7 days</p>
//     </div>
//   );
// };

// export default BusinessDashboard;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const BusinessDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, appointmentsRes] = await Promise.all([
        api.get("/business/dashboard/stats"),
        api.get("/business/appointments?status=confirmed&limit=5"),
      ]);

      setStats(statsRes.data.stats);
      setRecentAppointments(appointmentsRes.data.appointments);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-t-green-500 border-r-2 border-r-yellow-500 border-b-2 border-b-red-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Appointments",
      value: stats?.totalAppointments || 0,
      icon: CalendarDaysIcon,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Today's Appointments",
      value: stats?.todaysAppointments || 0,
      icon: ClockIcon,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Pending",
      value: stats?.pendingAppointments || 0,
      icon: UserGroupIcon,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
    },
    {
      title: "Confirmed",
      value: stats?.confirmedAppointments || 0,
      icon: ArrowTrendingUpIcon,
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.businessName || user?.name}!
        </h1>
        <p className="text-blue-100">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <span className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </span>
            </div>
            <h3 className="text-gray-600 font-medium">{stat.title}</h3>
          </div>
        ))}
      </div>

      {/* Recent Appointments & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Recent Appointments
              </h2>
            </div>
            <div className="p-6">
              {recentAppointments.length > 0 ? (
                <div className="space-y-4">
                  {recentAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {appointment.customer?.name || "Customer"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(appointment.date).toLocaleDateString()} •{" "}
                          {appointment.startTime} - {appointment.endTime}
                        </p>
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {appointment.serviceType}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent appointments</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/business-admin"
                className="flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
              >
                <span className="font-medium">Manage Time Slots</span>
                <ClockIcon className="h-5 w-5" />
              </Link>
              <Link
                to="/appointments"
                className="flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
              >
                <span className="font-medium">View All Appointments</span>
                <CalendarDaysIcon className="h-5 w-5" />
              </Link>
              <button className="flex items-center justify-between w-full p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
                <span className="font-medium">Generate Report</span>
                <ArrowTrendingUpIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tips & Updates */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600 mb-4" />
            <h4 className="font-semibold text-blue-900 mb-2">Pro Tip</h4>
            <p className="text-blue-800 text-sm">
              Set up recurring time slots to save time. Customers can book
              appointments up to 7 days in advance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
