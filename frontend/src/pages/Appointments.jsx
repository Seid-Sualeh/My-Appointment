import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AppointmentList from "../components/appointments/AppointmentList";
import AppointmentForm from "../components/appointments/AppointmentForm";
import CalendarView from "../components/calendar/CalendarView";
import api from "../services/api";
import {
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const Appointments = () => {
  const { user } = useSelector((state) => state.auth);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "customer") {
      fetchBusinesses();
    }
  }, [user?.role]);

  const fetchBusinesses = async () => {
    try {
      const response = await api.get("/customer/businesses/search");
      setBusinesses(response.data.businesses || []);
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
    } finally {
      setLoading(false);
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

  if (user?.role === "business") {
    return <AppointmentList />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
        <p className="text-green-100">
          Find and book appointments with trusted businesses
        </p>
      </div>

      {/* Business Search Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
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
                  setShowBookingForm(true);
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                      {business.businessName?.[0] || business.name?.[0] || "B"}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {business.businessName || business.name}
                      </h3>
                      <p className="text-gray-600">{business.name}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200">
                    Book Now
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

      {/* Calendar View */}
      {selectedBusiness && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Available Time Slots for{" "}
            {selectedBusiness.businessName || selectedBusiness.name}
          </h3>
          <CalendarView
            businessId={selectedBusiness._id}
            onSlotSelect={(slot) => {
              setSelectedBusiness({
                ...selectedBusiness,
                selectedSlot: slot,
              });
              setShowBookingForm(true);
            }}
          />
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Book Appointment
                </h3>
                <p className="text-gray-600">
                  with {selectedBusiness.businessName || selectedBusiness.name}
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
            <div className="p-6">
              <AppointmentForm
                business={selectedBusiness}
                timeSlot={selectedBusiness.selectedSlot}
                onSuccess={() => {
                  setShowBookingForm(false);
                  setSelectedBusiness(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Customer's Appointments */}
      <div>
        <AppointmentList />
      </div>
    </div>
  );
};

export default Appointments;
