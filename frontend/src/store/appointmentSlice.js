import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { appointmentService } from "../services/appointmentService";

export const createAppointment = createAsyncThunk(
  "appointments/create",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await appointmentService.createAppointment(
        appointmentData
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create appointment"
      );
    }
  }
);

export const getAppointments = createAsyncThunk(
  "appointments/get",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointments(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch appointments"
      );
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  "appointments/updateStatus",
  async ({ appointmentId, statusData }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.updateAppointmentStatus(
        appointmentId,
        statusData
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update appointment status"
      );
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  "appointments/cancel",
  async ({ appointmentId, reason }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.cancelAppointment(
        appointmentId,
        reason
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointments",
  initialState: {
    appointments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAppointmentError: (state) => {
      state.error = null;
    },
    addAppointment: (state, action) => {
      state.appointments.push(action.payload);
    },
    updateAppointment: (state, action) => {
      const index = state.appointments.findIndex(
        (appointment) => appointment._id === action.payload._id
      );
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    removeAppointment: (state, action) => {
      state.appointments = state.appointments.filter(
        (appointment) => appointment._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAppointmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(
          (appointment) => appointment._id === action.payload._id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter(
          (appointment) => appointment._id !== action.payload._id
        );
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAppointmentError,
  addAppointment,
  updateAppointment,
  removeAppointment,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
