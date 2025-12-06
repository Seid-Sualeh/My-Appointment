// const express = require("express");
// const router = express.Router();
// const businessController = require("../controllers/businessController");
// const { protect } = require("../middleware/auth");
// const { authorize, authorizeBusinessOwner } = require("../middleware/role");
// const {
//   validateBusinessCreation,
//   validateObjectId,
//   validatePagination,
//   validateSearch,
// } = require("../middleware/validation");

// // @desc    Get all businesses
// // @route   GET /api/business
// // @access  Public
// router.get("/", validatePagination, businessController.getAllBusinesses);

// // @desc    Search businesses
// // @route   GET /api/business/search
// // @access  Public
// router.get("/search", validateSearch, businessController.getAllBusinesses);

// // @desc    Get businesses by category
// // @route   GET /api/business/category/:category
// // @access  Public
// router.get("/category/:category", businessController.getBusinessesByCategory);

// // @desc    Get single business
// // @route   GET /api/business/:id
// // @access  Public
// router.get("/:id", validateObjectId("id"), businessController.getBusiness);

// // @desc    Create new business
// // @route   POST /api/business
// // @access  Private (Business users)
// router.post(
//   "/",
//   protect,
//   authorize("business"),
//   validateBusinessCreation,
//   businessController.createBusiness
// );

// // @desc    Update business
// // @route   PUT /api/business/:id
// // @access  Private (Business owner only)
// router.put(
//   "/:id",
//   protect,
//   validateObjectId("id"),
//   validateBusinessCreation,
//   authorizeBusinessOwner,
//   businessController.updateBusiness
// );

// // @desc    Delete business
// // @route   DELETE /api/business/:id
// // @access  Private (Business owner only)
// router.delete(
//   "/:id",
//   protect,
//   validateObjectId("id"),
//   authorizeBusinessOwner,
//   businessController.deleteBusiness
// );

// // @desc    Get user's businesses
// // @route   GET /api/business/my-businesses
// // @access  Private (Business users)
// router.get(
//   "/my-businesses",
//   protect,
//   authorize("business"),
//   businessController.getUserBusinesses
// );

// // @desc    Get business appointments
// // @route   GET /api/business/:id/appointments
// // @access  Private (Business owner)
// router.get(
//   "/:id/appointments",
//   protect,
//   validateObjectId("id"),
//   authorizeBusinessOwner,
//   businessController.getBusinessAppointments
// );

// // @desc    Get business time slots
// // @route   GET /api/business/:id/time-slots
// // @access  Public
// router.get(
//   "/:id/time-slots",
//   validateObjectId("id"),
//   businessController.getBusinessTimeSlots
// );

// // @desc    Create time slot for business
// // @route   POST /api/business/:id/time-slots
// // @access  Private (Business owner)
// router.post(
//   "/:id/time-slots",
//   protect,
//   validateObjectId("id"),
//   authorizeBusinessOwner,
//   businessController.createTimeSlot
// );

// // @desc    Get business dashboard stats
// // @route   GET /api/business/:id/dashboard
// // @access  Private (Business owner)
// router.get(
//   "/:id/dashboard",
//   protect,
//   validateObjectId("id"),
//   authorizeBusinessOwner,
//   businessController.getBusinessDashboard
// );

// // @desc    Update business hours
// // @route   PUT /api/business/:id/hours
// // @access  Private (Business owner)
// router.put(
//   "/:id/hours",
//   protect,
//   validateObjectId("id"),
//   authorizeBusinessOwner,
//   businessController.updateBusinessHours
// );

// // @desc    Get business reviews
// // @route   GET /api/business/:id/reviews
// // @access  Public
// router.get(
//   "/:id/reviews",
//   validateObjectId("id"),
//   businessController.getBusinessReviews
// );

// // @desc    Toggle business status (active/inactive)
// // @route   PATCH /api/business/:id/toggle-status
// // @access  Private (Business owner)
// router.patch(
//   "/:id/toggle-status",
//   protect,
//   validateObjectId("id"),
//   authorizeBusinessOwner,
//   businessController.toggleBusinessStatus
// );

// // @desc    Get nearby businesses
// // @route   GET /api/business/nearby/:latitude/:longitude
// // @access  Public
// router.get(
//   "/nearby/:latitude/:longitude",
//   businessController.getNearbyBusinesses
// );

// // @desc    Get popular businesses
// // @route   GET /api/business/popular
// // @access  Public
// router.get("/popular", businessController.getPopularBusinesses);

// // @desc    Export business data
// // @route   GET /api/business/:id/export
// // @access  Private (Business owner)
// router.get(
//   "/:id/export",
//   protect,
//   validateObjectId("id"),
//   authorizeBusinessOwner,
//   businessController.exportBusinessData
// );

// module.exports = router;







const express = require("express");
const router = express.Router();
const businessController = require("../controllers/businessController");
const { protect } = require("../middleware/auth");
const roleAuth = require("../middleware/role");
const validate = require("../middleware/validation");
const { body } = require("express-validator");

// All routes require authentication and business role
router.use(protect, roleAuth(["business"]));

// Time slot validation
const timeSlotValidation = [
  body("date").isISO8601().withMessage("Valid date is required"),
  body("startTime")
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Valid start time is required"),
  body("endTime")
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Valid end time is required"),
  body("maxAppointments")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max appointments must be at least 1"),
  body("serviceTypes")
    .optional()
    .isArray()
    .withMessage("Service types must be an array"),
];

// Time slot routes
router.get("/time-slots/:businessId", businessController.getTimeSlots);
router.get("/time-slots", businessController.getTimeSlots);
router.post(
  "/time-slots",
  timeSlotValidation,
  validate,
  businessController.createTimeSlot
);
router.put("/time-slots/:id", businessController.updateTimeSlot);
router.delete("/time-slots/:id", businessController.deleteTimeSlot);

// Appointment routes
router.get("/appointments", businessController.getBusinessAppointments);

// Dashboard routes
router.get("/dashboard/stats", businessController.getDashboardStats);

module.exports = router;