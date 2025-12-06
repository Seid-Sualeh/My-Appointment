import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// Assuming these paths/services are correct
import {
  getAppointments,
  cancelAppointment,
} from "../../services/appointmentService";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import AppointmentForm from "./AppointmentForm";
import CalendarView from "../calendar/CalendarView";
import api from "../../services/api";

// Helper function (moved outside to avoid re-declaration)
const isPastAppointment = (appointment) => {
  // Ensure 'date' property exists before creating a Date object
  if (!appointment || !appointment.date) return false;
  const appointmentDate = new Date(appointment.date);
  const now = new Date();
  // Check if the appointment date is strictly before the current date/time
  return appointmentDate < now;
};

// Helper function (moved outside to avoid re-declaration)
const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  // Convert time string (like "10:00") to a displayable time format
  return new Date(`2000-01-01T${timeString}:00`).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Helper function (moved outside to avoid re-declaration)
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const AppointmentList = ({
  filter: initialFilter = "all", // Use prop for initial value
  businessId = null,
  showActions = true,
}) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // NEW STATE: Manage filter selection internally
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);

  // Booking modal state
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Note: dispatch is used but not needed in current logic, removed from dependency array

  // LOGIC FIX: useEffect now depends on selectedFilter (local state) and currentPage
  useEffect(() => {
    fetchAppointments();
  }, [selectedFilter, businessId, currentPage]);

  // LOGIC FIX: Added initialFilter to useEffect to reset the state if prop changes from parent
  useEffect(() => {
    setSelectedFilter(initialFilter);
    setCurrentPage(1); // Reset page when filter prop changes externally
  }, [initialFilter]);

  // Fetch businesses for booking modal
  useEffect(() => {
    if (user?.role === "customer" && showBookingForm) {
      fetchBusinesses();
    }
  }, [user?.role, showBookingForm]);

  const fetchBusinesses = async () => {
    try {
      const response = await api.get("/customer/businesses/search");
      setBusinesses(response.data.businesses || []);
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
    }
  };

  const filteredBusinesses = businesses.filter(
    (business) =>
      business.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.businessDescription
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const fetchAppointments = async () => {
    // Only dispatch if you have Redux actions that handle loading/error,
    // otherwise, the local state management is fine.
    try {
      setLoading(true);
      setError(null); // Clear previous error

      const params = {
        page: currentPage,
        limit: 10,
        filter: selectedFilter, // Use the local state filter
      };

      if (businessId) {
        params.businessId = businessId;
      }

      // getAppointments is likely an async thunk or direct API call
      const data = await getAppointments(params);
      setAppointments(data.appointments || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      // It's good practice to log the error for debugging
      console.error("Fetch appointments error:", err);
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      // Note: If cancelAppointment is a Redux thunk, you would do:
      // await dispatch(cancelAppointment(appointmentId));
      await cancelAppointment(appointmentId);
      await fetchAppointments(); // Refresh the list
    } catch (err) {
      setError(err.message || "Failed to cancel appointment");
    }
  };

  const handleRescheduleAppointment = (appointmentId) => {
    // This should typically navigate to a booking/reschedule page, e.g., using useNavigate hook
    // Example: navigate(`/appointments/${appointmentId}/reschedule`);
    console.log("Reschedule appointment:", appointmentId);
  };

  // Handlers for Pagination and Filter Change

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setSelectedFilter(newFilter);
    setCurrentPage(1); // Crucial: Reset page to 1 on filter change
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // --- Render Logic ---

  if (loading) {
    return <LoadingSpinner message="Loading appointments..." />;
  }

  if (error) {
    return (
      <div className="appointments-error p-6 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center mb-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mr-2" />
          <h3 className="text-xl font-semibold text-red-800">
            Error Loading Appointments
          </h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchAppointments}
          className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          <FunnelIcon className="inline w-6 h-6 mr-2 text-green-600" />
          {selectedFilter === "all" && "All Appointments"}
          {selectedFilter === "upcoming" && "Upcoming Appointments"}
          {selectedFilter === "past" && "Past Appointments"}
          {selectedFilter === "cancelled" && "Cancelled Appointments"}
        </h2>

        <div className="flex items-center gap-4">
          <select
            value={selectedFilter} // Bind to local state
            onChange={handleFilterChange} // Use the new handler
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Appointments</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {user?.role === "customer" && (
            <button
              onClick={() => setShowBookingForm(true)}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Book New Appointment
            </button>
          )}
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No appointments found
          </h3>
          <p className="text-gray-600 mb-6">
            {selectedFilter === "all" &&
              "You haven't booked any appointments yet."}
            {selectedFilter === "upcoming" &&
              "You don't have any upcoming appointments."}
            {selectedFilter === "past" &&
              "You don't have any past appointments."}
            {selectedFilter === "cancelled" &&
              "You don't have any cancelled appointments."}
          </p>

          {user?.role === "customer" && (
            <Link
              to="/businesses"
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Businesses
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onCancel={handleCancelAppointment}
              onReschedule={handleRescheduleAppointment}
              showActions={showActions}
              userRole={user?.role}
              // Pass the helper functions down
              isPastAppointment={isPastAppointment}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingForm && user?.role === "customer" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Book New Appointment
                </h3>
                <p className="text-gray-600">
                  Browse businesses and book your appointment
                </p>
              </div>
              <button
                onClick={() => {
                  setShowBookingForm(false);
                  setSelectedBusiness(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Business Search Section */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Find Businesses
                  </h2>
                  <p className="text-gray-600">
                    Browse businesses and book your appointment
                  </p>
                </div>
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search businesses by name, service, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : filteredBusinesses.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredBusinesses.map((business) => (
                    <div
                      key={business._id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedBusiness(business);
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {business.businessName?.[0] ||
                              business.name?.[0] ||
                              "B"}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {business.businessName || business.name}
                            </h3>
                            <p className="text-gray-600">{business.name}</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200">
                          Select
                        </button>
                      </div>

                      <p className="text-gray-700 mb-6 line-clamp-2">
                        {business.businessDescription ||
                          "Professional service provider"}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                          <span>Business</span>
                        </div>
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          <span>Available Online</span>
                        </div>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 mr-1 text-yellow-500" />
                          <span>4.8</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BuildingOfficeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No businesses found
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? "Try a different search term"
                      : "No businesses available at the moment"}
                  </p>
                </div>
              )}
            </div>

            {/* Appointment Form Section */}
            {selectedBusiness && (
              <div className="p-6 border-t">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Appointment Details
                </h3>
                <AppointmentForm
                  business={selectedBusiness}
                  onSuccess={() => {
                    setShowBookingForm(false);
                    setSelectedBusiness(null);
                    fetchAppointments(); // Refresh appointments list
                  }}
                  onCancel={() => {
                    setSelectedBusiness(null);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Individual Appointment Card Component
const AppointmentCard = ({
  appointment,
  onCancel,
  onReschedule,
  showActions = true,
  userRole,
  // Receive helper functions as props
  isPastAppointment,
  formatDate,
  formatTime,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Use the helper function passed via props
  const isPast = isPastAppointment(appointment);

  const canCancel =
    (appointment.status === "confirmed" || appointment.status === "pending") &&
    !isPast; // Added !isPast check for cancellation logic

  const canReschedule = appointment.status === "confirmed" && !isPast;

  // Removed duplicated helper functions (getStatusColor, formatDate, formatTime) from here
  // as they are passed down or only needed for styling.

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {appointment.business?.name || "Unknown Business"}{" "}
            {/* Safe access */}
          </h3>
          <p className="text-gray-600 text-sm">
            {appointment.service || "Unknown Service"}
          </p>
          {userRole === "business" && appointment.customer && (
            <p className="text-gray-600 text-sm mt-1">
              Customer:{" "}
              <span className="font-medium text-gray-800">
                {appointment.customer.name}
              </span>
            </p>
          )}
        </div>

        <div className="flex-shrink-0">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
              appointment.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : appointment.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : appointment.status === "cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {appointment.status}
          </span>
          {isPast &&
            appointment.status !== "cancelled" &&
            appointment.status !== "completed" && (
              <span className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                Past Date
              </span>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="flex items-center">
          <CalendarDaysIcon className="w-5 h-5 text-gray-500 mr-2" />
          <span className="font-medium text-gray-700 mr-2">Date:</span>
          <span className="text-gray-600">{formatDate(appointment.date)}</span>
        </div>

        <div className="flex items-center">
          <ClockIcon className="w-5 h-5 text-gray-500 mr-2" />
          <span className="font-medium text-gray-700 mr-2">Time:</span>
          <span className="text-gray-600">
            {formatTime(appointment.timeSlot?.startTime)} -
            {formatTime(appointment.timeSlot?.endTime)}
          </span>
        </div>

        {userRole === "customer" && appointment.business?.address && (
          <div className="flex items-center">
            <span className="font-medium text-gray-700 mr-2">Location:</span>
            <span className="text-gray-600">
              {appointment.business.address}
            </span>
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showDetails ? "Hide Details" : "View Details"}
          </button>

          {canReschedule && (
            <button
              onClick={() => onReschedule(appointment._id)}
              className="px-4 py-2 border border-blue-300 text-blue-700 bg-blue-50 font-medium rounded-lg hover:bg-blue-100 transition-colors"
            >
              Reschedule
            </button>
          )}

          {canCancel && (
            <button
              onClick={() => onCancel(appointment._id)}
              className="px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
            >
              Cancel
            </button>
          )}

          {isPast &&
            appointment.status !== "cancelled" &&
            appointment.status !== "completed" && (
              <span className="px-3 py-2 text-sm text-gray-500 italic">
                (Actions unavailable for past appointments)
              </span>
            )}
        </div>
      )}

      {showDetails && (
        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Business Information
              </h4>
              <p className="text-sm text-gray-600">
                <strong>Phone:</strong> {appointment.business?.phone || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {appointment.business?.email || "N/A"}
              </p>
              {appointment.business?.website && (
                <p className="text-sm text-gray-600">
                  <strong>Website:</strong> {appointment.business.website}
                </p>
              )}
            </div>

            {/* Displaying Customer info if role is business, or logged-in user's info if role is customer */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {userRole === "business"
                  ? "Customer Information"
                  : "Your Details"}
              </h4>
              <p className="text-sm text-gray-600">
                <strong>Name:</strong> {appointment.customer?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {appointment.customer?.email || "N/A"}
              </p>
              {appointment.customer?.phone && (
                <p className="text-sm text-gray-600">
                  <strong>Phone:</strong> {appointment.customer.phone}
                </p>
              )}
            </div>

            {appointment.notes && (
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-1">Notes:</h4>
                <p className="text-sm text-gray-600 border-l-2 border-green-500 pl-3 italic">
                  {appointment.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
