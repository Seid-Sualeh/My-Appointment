// // Date and time utilities
// const formatDate = (date) => {
//   return new Date(date).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// };

// const formatTime = (time) => {
//   return new Date(`2000-01-01T${time}:00`).toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

// const formatDateTime = (date, time) => {
//   const dateTime = new Date(`${formatDate(date)} ${time}`);
//   return dateTime.toLocaleString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

// const isSameDay = (date1, date2) => {
//   const d1 = new Date(date1);
//   const d2 = new Date(date2);
//   return (
//     d1.getFullYear() === d2.getFullYear() &&
//     d1.getMonth() === d2.getMonth() &&
//     d1.getDate() === d2.getDate()
//   );
// };

// const isToday = (date) => {
//   return isSameDay(date, new Date());
// };

// const isTomorrow = (date) => {
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   return isSameDay(date, tomorrow);
// };

// const isPastDate = (date) => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const checkDate = new Date(date);
//   checkDate.setHours(0, 0, 0, 0);
//   return checkDate < today;
// };

// const addDays = (date, days) => {
//   const result = new Date(date);
//   result.setDate(result.getDate() + days);
//   return result;
// };

// const getWeekDays = () => {
//   return [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
// };

// const getDayName = (dayOfWeek) => {
//   const days = getWeekDays();
//   return days[dayOfWeek] || "Unknown";
// };

// // String utilities
// const slugify = (text) => {
//   return text
//     .toString()
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^\w\-]+/g, "")
//     .replace(/\-\-+/g, "-")
//     .replace(/^-+/, "")
//     .replace(/-+$/, "");
// };

// const capitalize = (str) => {
//   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// };

// const truncate = (str, length = 100, suffix = "...") => {
//   if (str.length <= length) return str;
//   return str.substring(0, length).trim() + suffix;
// };

// const generateRandomString = (length = 8) => {
//   const chars =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let result = "";
//   for (let i = 0; i < length; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return result;
// };

// // Validation utilities
// const isValidEmail = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// const isValidPhone = (phone) => {
//   const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
//   return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
// };

// const isValidURL = (url) => {
//   try {
//     new URL(url);
//     return true;
//   } catch {
//     return false;
//   }
// };

// const sanitizeHtml = (html) => {
//   return html
//     .replace(/</g, "<")
//     .replace(/>/g, ">")
//     .replace(/"/g, '"')
//     .replace(/'/g, "&#x27;")
//     .replace(/\//g, "&#x2F;");
// };

// // Array utilities
// const chunk = (array, size) => {
//   const chunks = [];
//   for (let i = 0; i < array.length; i += size) {
//     chunks.push(array.slice(i, i + size));
//   }
//   return chunks;
// };

// const unique = (array) => {
//   return [...new Set(array)];
// };

// const sortBy = (array, key, direction = "asc") => {
//   return array.sort((a, b) => {
//     const aVal = a[key];
//     const bVal = b[key];

//     if (direction === "asc") {
//       return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
//     } else {
//       return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
//     }
//   });
// };

// // Object utilities
// const pick = (obj, keys) => {
//   const result = {};
//   keys.forEach((key) => {
//     if (obj.hasOwnProperty(key)) {
//       result[key] = obj[key];
//     }
//   });
//   return result;
// };

// const omit = (obj, keys) => {
//   const result = { ...obj };
//   keys.forEach((key) => {
//     delete result[key];
//   });
//   return result;
// };

// const isEmpty = (obj) => {
//   if (obj == null) return true;
//   if (Array.isArray(obj) || typeof obj === "string") return obj.length === 0;
//   if (typeof obj === "object") return Object.keys(obj).length === 0;
//   return false;
// };

// // Business logic utilities
// const calculateBusinessHours = (startTime, endTime) => {
//   const start = new Date(`2000-01-01T${startTime}:00`);
//   const end = new Date(`2000-01-01T${endTime}:00`);
//   return (end - start) / (1000 * 60 * 60); // Return hours
// };

// const isWithinBusinessHours = (time, startTime, endTime) => {
//   const checkTime = new Date(`2000-01-01T${time}:00`);
//   const start = new Date(`2000-01-01T${startTime}:00`);
//   const end = new Date(`2000-01-01T${endTime}:00`);

//   return checkTime >= start && checkTime <= end;
// };

// const getTimeSlots = (startTime, endTime, duration = 30) => {
//   const slots = [];
//   const start = new Date(`2000-01-01T${startTime}:00`);
//   const end = new Date(`2000-01-01T${endTime}:00`);

//   let current = new Date(start);

//   while (current < end) {
//     const slotEnd = new Date(current.getTime() + duration * 60000);
//     if (slotEnd <= end) {
//       slots.push({
//         startTime: current.toTimeString().slice(0, 5),
//         endTime: slotEnd.toTimeString().slice(0, 5),
//         duration: duration,
//       });
//     }
//     current = slotEnd;
//   }

//   return slots;
// };

// // Pagination utilities
// const paginate = (array, page = 1, limit = 10) => {
//   const offset = (page - 1) * limit;
//   const total = array.length;
//   const totalPages = Math.ceil(total / limit);

//   return {
//     data: array.slice(offset, offset + limit),
//     pagination: {
//       currentPage: page,
//       totalPages,
//       totalItems: total,
//       itemsPerPage: limit,
//       hasNextPage: page < totalPages,
//       hasPrevPage: page > 1,
//     },
//   };
// };

// // Error handling utilities
// const createError = (status, message) => {
//   const error = new Error(message);
//   error.status = status;
//   return error;
// };

// const asyncHandler = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };

// // Response utilities
// const sendSuccessResponse = (
//   res,
//   data,
//   message = "Success",
//   statusCode = 200
// ) => {
//   res.status(statusCode).json({
//     success: true,
//     message,
//     data,
//   });
// };

// const sendErrorResponse = (res, error, statusCode = 500) => {
//   res.status(statusCode).json({
//     success: false,
//     error: error.message || "Internal server error",
//   });
// };

// // File utilities
// const getFileExtension = (filename) => {
//   return filename.split(".").pop().toLowerCase();
// };

// const isImageFile = (filename) => {
//   const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
//   return imageExtensions.includes(getFileExtension(filename));
// };

// const formatFileSize = (bytes) => {
//   if (bytes === 0) return "0 Bytes";

//   const k = 1024;
//   const sizes = ["Bytes", "KB", "MB", "GB"];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));

//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
// };

// module.exports = {
//   // Date and time utilities
//   formatDate,
//   formatTime,
//   formatDateTime,
//   isSameDay,
//   isToday,
//   isTomorrow,
//   isPastDate,
//   addDays,
//   getWeekDays,
//   getDayName,

//   // String utilities
//   slugify,
//   capitalize,
//   truncate,
//   generateRandomString,

//   // Validation utilities
//   isValidEmail,
//   isValidPhone,
//   isValidURL,
//   sanitizeHtml,

//   // Array utilities
//   chunk,
//   unique,
//   sortBy,

//   // Object utilities
//   pick,
//   omit,
//   isEmpty,

//   // Business logic utilities
//   calculateBusinessHours,
//   isWithinBusinessHours,
//   getTimeSlots,

//   // Pagination utilities
//   paginate,

//   // Error handling utilities
//   createError,
//   asyncHandler,

//   // Response utilities
//   sendSuccessResponse,
//   sendErrorResponse,

//   // File utilities
//   getFileExtension,
//   isImageFile,
//   formatFileSize,
// };















const formatDate = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

const formatTime = (time) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${suffix}`;
};

const generateTimeSlots = (startTime, endTime, interval = 30) => {
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

const isValidTimeSlot = (startTime, endTime) => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  return start < end;
};

const validateAppointmentTime = (appointmentTime) => {
  const now = new Date();
  const appointmentDate = new Date(appointmentTime);

  // Check if appointment is in the future
  if (appointmentDate <= now) {
    return { valid: false, message: "Appointment must be in the future" };
  }

  // Check if appointment is within business hours (8 AM - 8 PM)
  const hours = appointmentDate.getHours();
  if (hours < 8 || hours >= 20) {
    return {
      valid: false,
      message: "Appointments must be between 8 AM and 8 PM",
    };
  }

  // Check if appointment is at least 1 hour from now
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
  if (appointmentDate < oneHourFromNow) {
    return {
      valid: false,
      message: "Appointments must be scheduled at least 1 hour in advance",
    };
  }

  return { valid: true };
};

module.exports = {
  formatDate,
  formatTime,
  generateTimeSlots,
  isValidTimeSlot,
  validateAppointmentTime,
};