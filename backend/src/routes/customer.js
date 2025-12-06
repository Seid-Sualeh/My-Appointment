// const express = require("express");
// const router = express.Router();
// const customerController = require("../controllers/customerController");
// const { protect } = require("../middleware/auth");
// const {
//   validateObjectId,
//   validatePagination,
//   validateSearch,
// } = require("../middleware/validation");

// // @desc    Get customer profile
// // @route   GET /api/customer/profile
// // @access  Private (Customer)
// router.get("/profile", protect, customerController.getCustomerProfile);

// // @desc    Update customer profile
// // @route   PUT /api/customer/profile
// // @access  Private (Customer)
// router.put("/profile", protect, customerController.updateCustomerProfile);

// // @desc    Get customer appointments
// // @route   GET /api/customer/appointments
// // @access  Private (Customer)
// router.get(
//   "/appointments",
//   protect,
//   customerController.getCustomerAppointments
// );

// // @desc    Get customer's upcoming appointments
// // @route   GET /api/customer/appointments/upcoming
// // @access  Private (Customer)
// router.get(
//   "/appointments/upcoming",
//   protect,
//   customerController.getUpcomingAppointments
// );

// // @desc    Get customer's appointment history
// // @route   GET /api/customer/appointments/history
// // @access  Private (Customer)
// router.get(
//   "/appointments/history",
//   protect,
//   validatePagination,
//   customerController.getAppointmentHistory
// );

// // @desc    Cancel appointment
// // @route   DELETE /api/customer/appointments/:appointmentId
// // @access  Private (Customer)
// router.delete(
//   "/appointments/:appointmentId",
//   protect,
//   customerController.cancelAppointment
// );

// // @desc    Search businesses
// // @route   GET /api/customer/search-businesses
// // @access  Private (Customer)
// router.get(
//   "/search-businesses",
//   validateSearch,
//   customerController.searchBusinesses
// );

// // @desc    Get customer dashboard data
// // @route   GET /api/customer/dashboard
// // @access  Private (Customer)
// router.get("/dashboard", protect, customerController.getCustomerDashboard);

// // @desc    Get customer's favorite businesses
// // @route   GET /api/customer/favorites
// // @access  Private (Customer)
// router.get("/favorites", protect, customerController.getFavoriteBusinesses);

// // @desc    Add business to favorites
// // @route   POST /api/customer/favorites/:businessId
// // @access  Private (Customer)
// router.post(
//   "/favorites/:businessId",
//   protect,
//   validateObjectId("businessId"),
//   customerController.addToFavorites
// );

// // @desc    Remove business from favorites
// // @route   DELETE /api/customer/favorites/:businessId
// // @access  Private (Customer)
// router.delete(
//   "/favorites/:businessId",
//   protect,
//   validateObjectId("businessId"),
//   customerController.removeFromFavorites
// );

// // @desc    Get customer's notifications
// // @route   GET /api/customer/notifications
// // @access  Private (Customer)
// router.get("/notifications", protect, customerController.getNotifications);

// // @desc    Mark notification as read
// // @route   PATCH /api/customer/notifications/:id/read
// // @access  Private (Customer)
// router.patch(
//   "/notifications/:id/read",
//   protect,
//   validateObjectId("id"),
//   customerController.markNotificationRead
// );

// // @desc    Get customer's booking preferences
// // @route   GET /api/customer/preferences
// // @access  Private (Customer)
// router.get("/preferences", protect, customerController.getPreferences);

// // @desc    Update customer's booking preferences
// // @route   PUT /api/customer/preferences
// // @access  Private (Customer)
// router.put("/preferences", protect, customerController.updatePreferences);

// // @desc    Get recommended businesses
// // @route   GET /api/customer/recommendations
// // @access  Private (Customer)
// router.get("/recommendations", protect, customerController.getRecommendations);

// // @desc    Rate and review a business
// // @route   POST /api/customer/reviews/:businessId
// // @access  Private (Customer)
// router.post(
//   "/reviews/:businessId",
//   protect,
//   validateObjectId("businessId"),
//   customerController.createReview
// );

// // @desc    Get customer's review history
// // @route   GET /api/customer/reviews
// // @access  Private (Customer)
// router.get("/reviews", protect, customerController.getReviewHistory);

// // @desc    Export customer's appointment data
// // @route   GET /api/customer/export-appointments
// // @access  Private (Customer)
// router.get(
//   "/export-appointments",
//   protect,
//   customerController.exportAppointmentData
// );

// module.exports = router;







const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { protect } = require("../middleware/auth");
const roleAuth = require("../middleware/role");

// All routes require authentication and customer role
router.use(protect, roleAuth(["customer"]));

// Business search and details
router.get("/businesses/search", customerController.searchBusinesses);
router.get("/businesses/:id", customerController.getBusinessDetails);
router.get(
  "/businesses/:businessId/time-slots",
  customerController.getAvailableTimeSlots
);

// Appointment management
router.post("/appointments/:id/cancel", customerController.cancelAppointment);

module.exports = router;