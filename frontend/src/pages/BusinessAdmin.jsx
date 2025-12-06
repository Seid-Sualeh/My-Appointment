import React, { useState } from "react";
import TimeSlotManager from "../components/dashboard/TimeSlotManager";
import AppointmentCalendar from "../components/dashboard/AppointmentCalendar";
import {
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const BusinessAdmin = () => {
  const [activeTab, setActiveTab] = useState("time-slots");

  const tabs = [
    {
      id: "time-slots",
      name: "Time Slots",
      icon: ClockIcon,
      component: TimeSlotManager,
    },
    {
      id: "calendar",
      name: "Calendar View",
      icon: CalendarDaysIcon,
      component: AppointmentCalendar,
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: ChartBarIcon,
      component: () => (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Analytics Dashboard
          </h3>
          <p className="text-gray-500">
            Coming soon! Detailed analytics and reports.
          </p>
        </div>
      ),
    },
    {
      id: "customers",
      name: "Customers",
      icon: UserGroupIcon,
      component: () => (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Customer Management
          </h3>
          <p className="text-gray-500">
            Coming soon! Manage your customer database.
          </p>
        </div>
      ),
    },
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || TimeSlotManager;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Business Administration</h1>
        <p className="text-blue-100">
          Manage your business settings, time slots, and appointments
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-6">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default BusinessAdmin;
