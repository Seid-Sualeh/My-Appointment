import api from "./api";

export const appointmentService = {
  // Appointment CRUD operations
  createAppointment: async (appointmentData) => {
    const response = await api.post("/api/appointments", appointmentData);
    return response.data;
  },

  getAppointments: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(
      `/appointments/my-appointments?${queryParams}`
    );
    return response.data;
  },

  updateAppointmentStatus: async (appointmentId, statusData) => {
    const response = await api.put(
      `/appointments/${appointmentId}/status`,
      statusData
    );
    return response.data;
  },

  cancelAppointment: async (appointmentId, reason) => {
    const response = await api.post(
      `/customer/appointments/${appointmentId}/cancel`,
      { reason }
    );
    return response.data;
  },

  // Business-related operations
  getBusinessTimeSlots: async (businessId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(
      `/business/time-slots/${businessId}?${queryParams}`
    );
    return response.data;
  },

  createTimeSlot: async (timeSlotData) => {
    const response = await api.post("/business/time-slots", timeSlotData);
    return response.data;
  },

  updateTimeSlot: async (timeSlotId, updateData) => {
    const response = await api.put(
      `/business/time-slots/${timeSlotId}`,
      updateData
    );
    return response.data;
  },

  deleteTimeSlot: async (timeSlotId) => {
    const response = await api.delete(`/business/time-slots/${timeSlotId}`);
    return response.data;
  },

  getBusinessStats: async () => {
    const response = await api.get("/business/dashboard/stats");
    return response.data;
  },

  // Customer-related operations
  searchBusinesses: async (searchTerm) => {
    const response = await api.get(
      `/customer/businesses/search?search=${searchTerm}`
    );
    return response.data;
  },

  getBusinessDetails: async (businessId) => {
    const response = await api.get(`/customer/businesses/${businessId}`);
    return response.data;
  },

  getAvailableTimeSlots: async (businessId, date) => {
    const response = await api.get(
      `/customer/businesses/${businessId}/time-slots?date=${date}`
    );
    return response.data;
  },
};

// Export individual functions for direct import
export const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getBusinessTimeSlots,
  createTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
  getBusinessStats,
  searchBusinesses,
  getBusinessDetails,
  getAvailableTimeSlots,
} = appointmentService;
