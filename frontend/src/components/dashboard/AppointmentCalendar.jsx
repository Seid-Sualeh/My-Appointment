









import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { appointmentService } from "../../services/appointmentService";
import LoadingSpinner from "../common/LoadingSpinner";
// Removed: import "./AppointmentCalendar.css";

const AppointmentCalendar = ({
  view = "month", // month, week, day
  onDateSelect,
  onAppointmentSelect,
  selectedDate,
  businessId,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState(view);

  // Helper function to get the date range for fetching appointments
  const getDateRange = useCallback(() => {
    const date = new Date(currentDate);
    let start, end;

    switch (viewMode) {
      case "week":
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        startOfWeek.setHours(0, 0, 0, 0); // Start of day
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999); // End of day
        start = startOfWeek;
        end = endOfWeek;
        break;

      case "day":
        start = new Date(date);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        break;

      default: // month
        start = new Date(date.getFullYear(), date.getMonth(), 1);
        start.setDate(start.getDate() - start.getDay()); // Start from Sunday of the first week
        end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        end.setDate(end.getDate() + (6 - end.getDay())); // End on Saturday of the last week
        end.setHours(23, 59, 59, 999);
    }

    return { start, end };
  }, [currentDate, viewMode]);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const { start, end } = getDateRange();

      const params = {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      };

      if (businessId) {
        params.businessId = businessId;
      }

      const data = await appointmentService.getAppointments(params);
      setAppointments(data.appointments || []);
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [getDateRange, businessId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const navigateCalendar = (direction) => {
    const newDate = new Date(currentDate);

    switch (viewMode) {
      case "week":
        newDate.setDate(currentDate.getDate() + direction * 7);
        break;
      case "day":
        newDate.setDate(currentDate.getDate() + direction);
        break;
      default: // month
        newDate.setMonth(currentDate.getMonth() + direction);
    }

    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    onDateSelect?.(date);
  };

  const handleAppointmentClick = (appointment) => {
    onAppointmentSelect?.(appointment);
  };

  const getCalendarTitle = () => {
    const date = new Date(currentDate);
    const options = { year: "numeric", month: "long", day: "numeric" };

    switch (viewMode) {
      case "week":
        const { start, end } = getDateRange();
        return `${start.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })} - ${end.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      case "day":
        return date.toLocaleDateString(undefined, {
          weekday: "long",
          ...options,
        });
      default: // month
        return date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
        });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading calendar..." />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
        <p className="font-medium">Error loading appointments: {error}</p>
        <button
          onClick={fetchAppointments}
          className="mt-2 text-sm font-semibold text-red-700 hover:text-red-900 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4">
        {/* Navigation */}
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <button
            onClick={() => navigateCalendar(-1)}
            className="p-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 w-48 text-center">
            {getCalendarTitle()}
          </h2>

          <button
            onClick={() => navigateCalendar(1)}
            className="p-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition duration-150"
          >
            Today
          </button>

          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="form-select border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="calendar-content">
        {viewMode === "month" && (
          <MonthView
            currentDate={currentDate}
            appointments={appointments}
            onDateClick={handleDateClick}
            onAppointmentClick={handleAppointmentClick}
            selectedDate={selectedDate}
          />
        )}

        {viewMode === "week" && (
          <WeekView
            currentDate={currentDate}
            appointments={appointments}
            onDateClick={handleDateClick}
            onAppointmentClick={handleAppointmentClick}
            selectedDate={selectedDate}
          />
        )}

        {viewMode === "day" && (
          <DayView
            currentDate={currentDate}
            appointments={appointments}
            onAppointmentClick={handleAppointmentClick}
          />
        )}
      </div>
    </div>
  );
};

// Helper function to dynamically map appointment status to Tailwind colors
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "bg-green-500 hover:bg-green-600";
    case "pending":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "cancelled":
      return "bg-red-500 hover:bg-red-600";
    default:
      return "bg-indigo-500 hover:bg-indigo-600";
  }
};

// --- Month View Component (Styled) ---
const MonthView = ({
  currentDate,
  appointments,
  onDateClick,
  onAppointmentClick,
  selectedDate,
}) => {
  const monthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());

  const days = [];
  const current = new Date(startDate);

  // Generate 6 weeks (42 days)
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="select-none">
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-px text-center text-sm font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-t-lg">
        {dayNames.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px border border-gray-200 border-t-0">
        {days.map((day, index) => {
          const dayAppointments = Array.isArray(appointments)
            ? appointments.filter(
                (apt) =>
                  new Date(apt.date).toDateString() === day.toDateString()
              )
            : [];

          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const isSelected =
            selectedDate && day.toDateString() === selectedDate.toDateString();

          let dayClasses =
            "h-28 py-2 px-3 relative bg-white transition duration-100 cursor-pointer border-r border-b border-gray-200 overflow-y-auto";

          if (!isCurrentMonth) {
            dayClasses += " text-gray-400 bg-gray-50";
          }
          if (isToday) {
            dayClasses += " ring-2 ring-indigo-500 ring-offset-2";
          }
          if (isSelected) {
            dayClasses += " bg-indigo-100 border-indigo-500";
          } else if (isCurrentMonth) {
            dayClasses += " hover:bg-gray-100";
          }

          return (
            <div
              key={index}
              className={dayClasses}
              onClick={() => onDateClick(day)}
            >
              <div
                className={`text-sm font-bold ${
                  isToday ? "text-indigo-600" : "text-gray-900"
                }`}
              >
                {day.getDate()}
              </div>

              <div className="mt-1 space-y-0.5">
                {dayAppointments.slice(0, 2).map((apt, i) => (
                  <div
                    key={i}
                    className={`text-xs p-1 rounded-md text-white truncate shadow-md ${getStatusColor(
                      apt.status
                    )}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAppointmentClick(apt);
                    }}
                    title={`${apt.service} - ${apt.business?.name} (${apt.timeSlot?.startTime})`}
                  >
                    {apt.timeSlot?.startTime || "Time N/A"}
                  </div>
                ))}

                {dayAppointments.length > 2 && (
                  <div className="text-xs text-center text-gray-600 mt-1">
                    +{dayAppointments.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Week View Component (Styled) ---
const WeekView = ({
  currentDate,
  appointments,
  onDateClick,
  onAppointmentClick,
  selectedDate,
}) => {
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());

  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    days.push(day);
  }

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-full divide-x divide-gray-200 border border-gray-200 rounded-lg">
        {days.map((day, index) => {
          const dayAppointments = Array.isArray(appointments)
            ? appointments.filter(
                (apt) =>
                  new Date(apt.date).toDateString() === day.toDateString()
              )
            : [];

          const isToday = day.toDateString() === new Date().toDateString();
          const isSelected =
            selectedDate && day.toDateString() === selectedDate.toDateString();

          let dayClasses =
            "flex-1 min-w-[180px] p-3 transition duration-150 cursor-pointer";

          if (isToday) {
            dayClasses += " bg-indigo-50 border-t-4 border-indigo-500";
          } else if (isSelected) {
            dayClasses += " bg-gray-100";
          } else {
            dayClasses += " bg-white hover:bg-gray-50";
          }

          return (
            <div
              key={index}
              className={dayClasses}
              onClick={() => onDateClick(day)}
            >
              <div className="day-header text-center pb-2 border-b border-gray-200 mb-2">
                <div className="text-xs font-medium text-gray-500">
                  {dayNames[index]}
                </div>
                <div
                  className={`text-xl font-bold ${
                    isToday ? "text-indigo-600" : "text-gray-900"
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>

              <div className="day-appointments space-y-2 max-h-[500px] overflow-y-auto">
                {dayAppointments.length > 0 ? (
                  dayAppointments.map((apt) => (
                    <div
                      key={apt._id}
                      className={`p-2 rounded-lg shadow-sm text-sm text-white transition duration-150 ${getStatusColor(
                        apt.status
                      )}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppointmentClick(apt);
                      }}
                      title={`${apt.service} with ${apt.customer?.name}`}
                    >
                      <div className="font-semibold truncate">
                        {apt.timeSlot?.startTime} - {apt.service}
                      </div>
                      <div className="text-xs opacity-90 truncate">
                        {apt.customer?.name || "Customer N/A"}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic text-center pt-4">
                    No appointments
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Day View Component (Styled) ---
const DayView = ({ currentDate, appointments, onAppointmentClick }) => {
  const dayAppointments = Array.isArray(appointments)
    ? appointments
        .filter(
          (apt) =>
            new Date(apt.date).toDateString() === currentDate.toDateString()
        )
        .sort((a, b) =>
          a.timeSlot?.startTime.localeCompare(b.timeSlot?.startTime)
        )
    : [];

  const timeSlots = generateTimeSlots();

  return (
    <div className="day-view p-4 border border-gray-200 rounded-lg">
      <div className="day-header mb-4 border-b pb-2">
        <h3 className="text-2xl font-bold text-gray-800">
          {currentDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h3>
      </div>

      <div className="day-schedule divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {timeSlots.map((time, index) => {
          const timeAppointment = dayAppointments.find(
            (apt) => apt.timeSlot?.startTime === time
          );

          return (
            <div
              key={time}
              className="flex time-slot group hover:bg-gray-50 transition duration-150"
            >
              <div className="time-label w-20 py-3 pr-2 text-sm font-medium text-gray-500 border-r border-gray-200">
                {time}
              </div>
              <div className="slot-content flex-1 py-2 px-3">
                {timeAppointment ? (
                  <div
                    className={`day-appointment p-2 rounded-lg shadow-md text-sm text-white cursor-pointer transition duration-200 ${getStatusColor(
                      timeAppointment.status
                    )}`}
                    onClick={() => onAppointmentClick(timeAppointment)}
                  >
                    <div className="font-bold truncate">
                      {timeAppointment.service}
                    </div>
                    <div className="text-xs opacity-90">
                      {timeAppointment.customer?.name} -{" "}
                      {timeAppointment.business?.name}
                    </div>
                  </div>
                ) : (
                  <div className="empty-slot h-full flex items-center text-gray-400 text-sm italic group-hover:text-gray-500">
                    Available
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Generate time slots for day view (re-used logic)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      slots.push(time);
    }
  }
  return slots;
};

export default AppointmentCalendar;