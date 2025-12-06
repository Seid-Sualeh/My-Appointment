// const { body, param, query } = require("express-validator");

// // Custom validation rules
// const validateBusinessHours = (startTime, endTime) => {
//   const start = new Date(`2000-01-01T${startTime}:00`);
//   const end = new Date(`2000-01-01T${endTime}:00`);

//   if (end <= start) {
//     return false;
//   }

//   const hoursDiff = (end - start) / (1000 * 60 * 60);
//   return hoursDiff >= 1 && hoursDiff <= 12; // Between 1 and 12 hours
// };

// const validateAppointmentTime = (date, time) => {
//   const appointmentDateTime = new Date(`${date}T${time}:00`);
//   const now = new Date();

//   // Must be in the future (at least 1 hour from now)
//   const minTime = new Date(now.getTime() + 60 * 60 * 1000);

//   return appointmentDateTime > minTime;
// };

// const validateTimeSlotDuration = (
//   startTime,
//   endTime,
//   minDuration = 15,
//   maxDuration = 480
// ) => {
//   const start = new Date(`2000-01-01T${startTime}:00`);
//   const end = new Date(`2000-01-01T${endTime}:00`);

//   const durationMinutes = (end - start) / (1000 * 60);

//   return durationMinutes >= minDuration && durationMinutes <= maxDuration;
// };

// const validatePhoneNumber = (phone) => {
//   // Remove all non-digit characters
//   const cleaned = phone.replace(/\D/g, "");

//   // Check if it's a valid phone number (7-15 digits)
//   if (cleaned.length < 7 || cleaned.length > 15) {
//     return false;
//   }

//   // Check if it starts with valid country code or local format
//   const validPatterns = [
//     /^(\+?\d{1,3})?[\s\-\.]?(\(?\d{3}\)?)[\s\-\.]?\d{3}[\s\-\.]?\d{4}$/, // US/Canada
//     /^(\+?\d{1,3})?[\s\-\.]?\d{2,4}[\s\-\.]?\d{3,4}[\s\-\.]?\d{3,4}$/, // International
//   ];

//   return validPatterns.some((pattern) => pattern.test(phone));
// };

// const validatePasswordStrength = (password) => {
//   // At least 8 characters
//   if (password.length < 8) {
//     return {
//       valid: false,
//       message: "Password must be at least 8 characters long",
//     };
//   }

//   // At least one uppercase letter
//   if (!/[A-Z]/.test(password)) {
//     return {
//       valid: false,
//       message: "Password must contain at least one uppercase letter",
//     };
//   }

//   // At least one lowercase letter
//   if (!/[a-z]/.test(password)) {
//     return {
//       valid: false,
//       message: "Password must contain at least one lowercase letter",
//     };
//   }

//   // At least one number
//   if (!/\d/.test(password)) {
//     return {
//       valid: false,
//       message: "Password must contain at least one number",
//     };
//   }

//   // At least one special character
//   if (!/[@$!%*?&]/.test(password)) {
//     return {
//       valid: false,
//       message: "Password must contain at least one special character (@$!%*?&)",
//     };
//   }

//   // No spaces
//   if (/\s/.test(password)) {
//     return { valid: false, message: "Password cannot contain spaces" };
//   }

//   return { valid: true, message: "Password is strong enough" };
// };

// const validateBusinessCategory = (category) => {
//   const validCategories = [
//     "Health & Beauty",
//     "Fitness & Wellness",
//     "Professional Services",
//     "Automotive",
//     "Home Services",
//     "Education & Training",
//     "Entertainment",
//     "Food & Dining",
//     "Retail",
//     "Real Estate",
//     "Legal Services",
//     "Financial Services",
//     "Other",
//   ];

//   return validCategories.includes(category);
// };

// const validateDateRange = (startDate, endDate) => {
//   if (!startDate || !endDate) return true;

//   const start = new Date(startDate);
//   const end = new Date(endDate);
//   const now = new Date();

//   // Start date cannot be in the past
//   if (start < now) {
//     return false;
//   }

//   // End date must be after start date
//   if (end <= start) {
//     return false;
//   }

//   // Date range cannot be more than 1 year
//   const maxRange = 365 * 24 * 60 * 60 * 1000; // 365 days in milliseconds
//   if (end - start > maxRange) {
//     return false;
//   }

//   return true;
// };

// const validateCoordinates = (latitude, longitude) => {
//   if (latitude < -90 || latitude > 90) {
//     return { valid: false, message: "Latitude must be between -90 and 90" };
//   }

//   if (longitude < -180 || longitude > 180) {
//     return { valid: false, message: "Longitude must be between -180 and 180" };
//   }

//   return { valid: true, message: "Coordinates are valid" };
// };

// const validateFileSize = (file, maxSizeInMB = 5) => {
//   const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
//   return file.size <= maxSizeInBytes;
// };

// const validateImageFile = (file) => {
//   const allowedMimeTypes = [
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "image/gif",
//     "image/webp",
//   ];
//   return allowedMimeTypes.includes(file.mimetype);
// };

// // Custom validation middleware generators
// const createCustomValidator = (validationFn, errorMessage) => {
//   return body("").custom((value, { req }) => {
//     if (!validationFn(value, req.body)) {
//       throw new Error(errorMessage);
//     }
//     return true;
//   });
// };

// // Express-validator custom rules
// const customValidators = {
//   isValidBusinessHours: () => {
//     return body("startTime").custom((value, { req }) => {
//       if (!req.body.startTime || !req.body.endTime) {
//         return true; // Let other validations handle missing fields
//       }

//       if (!validateBusinessHours(req.body.startTime, req.body.endTime)) {
//         throw new Error(
//           "Business hours must be valid (end time after start time, and between 1-12 hours)"
//         );
//       }

//       return true;
//     });
//   },

//   isValidAppointmentTime: () => {
//     return body("date").custom((value, { req }) => {
//       if (!req.body.date || !req.body.timeSlot?.startTime) {
//         return true; // Let other validations handle missing fields
//       }

//       const timeSlot = req.body.timeSlot;
//       if (!validateAppointmentTime(req.body.date, timeSlot.startTime)) {
//         throw new Error(
//           "Appointment must be scheduled at least 1 hour in the future"
//         );
//       }

//       return true;
//     });
//   },

//   isValidPhoneNumber: () => {
//     return body("phone").custom((value) => {
//       if (!value) return true; // Optional field

//       if (!validatePhoneNumber(value)) {
//         throw new Error("Please provide a valid phone number");
//       }

//       return true;
//     });
//   },

//   isStrongPassword: () => {
//     return body("password").custom((value) => {
//       if (!value) return true; // Let other validations handle missing field

//       const result = validatePasswordStrength(value);
//       if (!result.valid) {
//         throw new Error(result.message);
//       }

//       return true;
//     });
//   },

//   isValidBusinessCategory: () => {
//     return body("category").custom((value) => {
//       if (!value) return true; // Optional field

//       if (!validateBusinessCategory(value)) {
//         throw new Error("Please select a valid business category");
//       }

//       return true;
//     });
//   },

//   isValidDateRange: () => {
//     return body("startDate").custom((value, { req }) => {
//       if (!req.body.startDate || !req.body.endDate) {
//         return true; // Let other validations handle missing fields
//       }

//       if (!validateDateRange(req.body.startDate, req.body.endDate)) {
//         throw new Error(
//           "Invalid date range. End date must be after start date, and range cannot exceed 1 year"
//         );
//       }

//       return true;
//     });
//   },

//   isValidCoordinates: () => {
//     return body("latitude").custom((value, { req }) => {
//       if (!value && !req.body.longitude) {
//         return true; // Both coordinates are optional
//       }

//       if (value === undefined || req.body.longitude === undefined) {
//         return true; // Both should be provided together
//       }

//       const result = validateCoordinates(value, req.body.longitude);
//       if (!result.valid) {
//         throw new Error(result.message);
//       }

//       return true;
//     });
//   },
// };

// // Schema validators for common data structures
// const validationSchemas = {
//   userRegistration: [
//     body("name")
//       .trim()
//       .isLength({ min: 2, max: 50 })
//       .withMessage("Name must be between 2 and 50 characters"),
//     body("email")
//       .isEmail()
//       .normalizeEmail()
//       .withMessage("Please provide a valid email"),
//     body("password").custom((value) => {
//       if (!value) {
//         throw new Error("Password is required");
//       }
//       const result = validatePasswordStrength(value);
//       if (!result.valid) {
//         throw new Error(result.message);
//       }
//       return true;
//     }),
//     body("role")
//       .optional()
//       .isIn(["customer", "business"])
//       .withMessage("Role must be either customer or business"),
//     customValidators.isValidPhoneNumber(),
//   ],

//   businessCreation: [
//     body("name")
//       .trim()
//       .isLength({ min: 2, max: 100 })
//       .withMessage("Business name must be between 2 and 100 characters"),
//     body("description")
//       .trim()
//       .isLength({ min: 10, max: 500 })
//       .withMessage("Description must be between 10 and 500 characters"),
//     body("address")
//       .trim()
//       .isLength({ min: 5, max: 200 })
//       .withMessage("Address must be between 5 and 200 characters"),
//     customValidators.isValidPhoneNumber(),
//     body("email")
//       .isEmail()
//       .normalizeEmail()
//       .withMessage("Please provide a valid email"),
//     body("website")
//       .optional()
//       .custom((value) => {
//         if (value && !validateUrl(value)) {
//           throw new Error("Please provide a valid website URL");
//         }
//         return true;
//       }),
//     customValidators.isValidBusinessCategory(),
//   ],

//   appointmentCreation: [
//     body("business")
//       .isMongoId()
//       .withMessage("Please provide a valid business ID"),
//     body("timeSlot")
//       .isMongoId()
//       .withMessage("Please provide a valid time slot ID"),
//     body("date")
//       .isISO8601()
//       .withMessage("Please provide a valid date")
//       .custom((value) => {
//         const appointmentDate = new Date(value);
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         if (appointmentDate < today) {
//           throw new Error("Appointment date cannot be in the past");
//         }
//         return true;
//       }),
//     customValidators.isValidAppointmentTime(),
//     body("notes")
//       .optional()
//       .trim()
//       .isLength({ max: 500 })
//       .withMessage("Notes cannot exceed 500 characters"),
//   ],

//   timeSlotCreation: [
//     body("startTime")
//       .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
//       .withMessage("Please provide a valid start time (HH:MM format)"),
//     body("endTime")
//       .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
//       .withMessage("Please provide a valid end time (HH:MM format)")
//       .custom((value, { req }) => {
//         if (!req.body.startTime || !value) {
//           return true; // Let other validations handle missing fields
//         }

//         if (!validateTimeSlotDuration(req.body.startTime, value)) {
//           throw new Error(
//             "Time slot duration must be between 15 minutes and 8 hours"
//           );
//         }

//         return true;
//       }),
//   ],
// };

// // Helper function to validate URLs
// const validateUrl = (url) => {
//   try {
//     new URL(url);
//     return true;
//   } catch {
//     return false;
//   }
// };

// module.exports = {
//   // Core validation functions
//   validateBusinessHours,
//   validateAppointmentTime,
//   validateTimeSlotDuration,
//   validatePhoneNumber,
//   validatePasswordStrength,
//   validateBusinessCategory,
//   validateDateRange,
//   validateCoordinates,
//   validateFileSize,
//   validateImageFile,

//   // Custom validators
//   customValidators,

//   // Validation schemas
//   validationSchemas,

//   // Helper functions
//   validateUrl,
//   createCustomValidator,
// };






const { body } = require("express-validator");

const appointmentValidators = [
  body("businessId")
    .notEmpty()
    .withMessage("Business ID is required")
    .isMongoId()
    .withMessage("Invalid business ID format"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid time format (HH:MM)"),

  body("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid time format (HH:MM)"),

  body("serviceType")
    .notEmpty()
    .withMessage("Service type is required")
    .isString()
    .withMessage("Service type must be a string")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Service type must be between 2 and 50 characters"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];

const timeSlotValidators = [
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid time format (HH:MM)"),

  body("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Invalid time format (HH:MM)"),

  body("maxAppointments")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Max appointments must be between 1 and 10"),

  body("serviceTypes")
    .optional()
    .isArray()
    .withMessage("Service types must be an array"),

  body("serviceTypes.*")
    .optional()
    .isString()
    .withMessage("Each service type must be a string")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage("Service type must be between 2 and 30 characters"),
];

module.exports = {
  appointmentValidators,
  timeSlotValidators,
};