export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  PAID: "paid",
};

export const APPOINTMENT_STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
  paid: "Paid",
};

export const USER_ROLES = {
  CUSTOMER: "customer",
  BUSINESS: "business",
  ADMIN: "admin",
};

export const USER_ROLE_LABELS = {
  customer: "Customer",
  business: "Business",
  admin: "Administrator",
};

export const TIME_SLOT_INTERVAL = 30; // minutes

export const BUSINESS_HOURS = {
  START: "08:00",
  END: "20:00",
};

export const APPOINTMENT_TYPES = [
  "Consultation",
  "Repair",
  "Maintenance",
  "Check-up",
  "Installation",
  "Training",
  "Support",
  "Other",
];

export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const COLORS = {
  primary: "#4F46E5",
  secondary: "#10B981",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  light: "#F3F4F6",
  dark: "#1F2937",
};

export const STATUS_COLORS = {
  pending: "#F59E0B",
  confirmed: "#10B981",
  cancelled: "#EF4444",
  completed: "#3B82F6",
  paid: "#8B5CF6",
};
