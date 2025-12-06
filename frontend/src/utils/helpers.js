import { APPOINTMENT_STATUS_LABELS, STATUS_COLORS } from "./constants";

export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString);
  const defaultOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", { ...defaultOptions, ...options });
};

export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${suffix}`;
};

export const formatDateTime = (dateString, timeString) => {
  const date = formatDate(dateString, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = formatTime(timeString);
  return `${date} • ${time}`;
};

export const getStatusLabel = (status) => {
  return APPOINTMENT_STATUS_LABELS[status] || status;
};

export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || "#6B7280";
};

export const generateTimeSlots = (startTime, endTime, interval = 30) => {
  const slots = [];
  let current = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);

  while (current < end) {
    const slotStart = current.toTimeString().slice(0, 5);
    current.setMinutes(current.getMinutes() + interval);
    const slotEnd = current.toTimeString().slice(0, 5);

    if (current <= end) {
      slots.push({
        start: slotStart,
        end: slotEnd,
        label: `${formatTime(slotStart)} - ${formatTime(slotEnd)}`,
      });
    }
  }

  return slots;
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const calculateDuration = (startTime, endTime) => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const durationMs = end - start;
  const durationMinutes = Math.floor(durationMs / (1000 * 60));

  if (durationMinutes < 60) {
    return `${durationMinutes} min`;
  } else {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
};

export const validateAppointmentTime = (date, time) => {
  const appointmentTime = new Date(`${date}T${time}`);
  const now = new Date();

  // Check if appointment is in the future
  if (appointmentTime <= now) {
    return { valid: false, message: "Appointment must be in the future" };
  }

  // Check if appointment is at least 1 hour from now
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
  if (appointmentTime < oneHourFromNow) {
    return {
      valid: false,
      message: "Appointments must be scheduled at least 1 hour in advance",
    };
  }

  return { valid: true };
};
