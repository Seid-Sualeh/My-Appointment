

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

const CustomerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(
        "/appointments/my-appointments?upcoming=true"
      );
      const appointments = response.data.appointments;

      setUpcomingAppointments(appointments.slice(0, 5));

      // Calculate stats
      const total = appointments.length;
      const upcoming = appointments.filter(
        (a) => a.status === "confirmed" || a.status === "pending"
      ).length;
      const completed = appointments.filter(
        (a) => a.status === "completed"
      ).length;
      const cancelled = appointments.filter(
        (a) => a.status === "cancelled"
      ).length;

      setStats({ total, upcoming, completed, cancelled });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Appointments",
      value: stats.total,
      icon: CalendarDaysIcon,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Upcoming",
      value: stats.upcoming,
      icon: ClockIcon,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircleIcon,
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: XCircleIcon,
      color: "bg-red-500",
      textColor: "text-red-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-t-green-500 border-r-2 border-r-yellow-500 border-b-2 border-b-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-green-100">
          Manage your appointments and discover new services.
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

      {/* Quick Actions & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/appointments"
                className="flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
              >
                <span className="font-medium">Book New Appointment</span>
                <PlusCircleIcon className="h-5 w-5" />
              </Link>
              <Link
                to="/appointments"
                className="flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
              >
                <span className="font-medium">Browse Businesses</span>
                <MagnifyingGlassIcon className="h-5 w-5" />
              </Link>
              <Link
                to="/appointments"
                className="flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100"
              >
                <span className="font-medium">View All Appointments</span>
                <CalendarDaysIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Reminders */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <ClockIcon className="h-8 w-8 text-green-600 mb-4" />
            <h4 className="font-semibold text-green-900 mb-2">Remember</h4>
            <ul className="text-green-800 text-sm space-y-2">
              <li>• You can cancel appointments up to 2 hours before</li>
              <li>• Arrive 5-10 minutes before your scheduled time</li>
              <li>• Review businesses before booking</li>
            </ul>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Upcoming Appointments
              </h2>
            </div>
            <div className="p-6">
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div className="mb-4 sm:mb-0">
                        <h4 className="font-medium text-gray-900">
                          {appointment.business?.businessName ||
                            appointment.business?.name ||
                            "Business"}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(appointment.date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }
                          )}{" "}
                          • {appointment.startTime} - {appointment.endTime}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {appointment.serviceType}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
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
                        {appointment.status === "pending" ||
                        appointment.status === "confirmed" ? (
                          <button className="text-sm text-red-600 hover:text-red-800">
                            Cancel
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarDaysIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Book your first appointment today!
                  </p>
                  <Link
                    to="/appointments"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                  >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Book Appointment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
