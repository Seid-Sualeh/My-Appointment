const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { protect } = require("../middleware/auth");
const roleAuth = require("../middleware/role");
const validate = require("../middleware/validation");
// All routes require authentication
router.use(protect);

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private (Customer)
router.post(
  "/",
  roleAuth(["customer"]),
  validate,
  appointmentController.createAppointment
);

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
router.get("/", protect, validate, appointmentController.getAllAppointments);

// @desc    Get user's appointments
// @route   GET /api/appointments/my-appointments
// @access  Private
router.get(
  "/my-appointments",
  protect,
  appointmentController.getUserAppointments
);

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
router.get("/:id", protect, validate, appointmentController.getAppointmentById);

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
router.put("/:id", protect, validate, appointmentController.updateAppointment);

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
router.delete(
  "/:id",
  protect,
  validate,
  appointmentController.cancelAppointment
);

// @desc    Get appointments by business
// @route   GET /api/appointments/business/:businessId
// @access  Private (Business owner)
router.get(
  "/business/:businessId",
  protect,
  validate,
  appointmentController.getBusinessAppointments
);

// @desc    Get appointments by date range
// @route   GET /api/appointments/date-range
// @access  Private
router.get(
  "/date-range",
  protect,
  validate,
  appointmentController.getAppointmentsByDateRange
);

// @desc    Get upcoming appointments
// @route   GET /api/appointments/upcoming
// @access  Private
router.get("/upcoming", protect, appointmentController.getUpcomingAppointments);

// @desc    Confirm appointment (Business owner only)
// @route   PATCH /api/appointments/:id/confirm
// @access  Private (Business owner)
router.patch(
  "/:id/confirm",
  protect,
  validate,
  appointmentController.confirmAppointment
);

// @desc    Reschedule appointment
// @route   PATCH /api/appointments/:id/reschedule
// @access  Private
router.patch(
  "/:id/reschedule",
  protect,
  validate,
  appointmentController.rescheduleAppointment
);

// @desc    Mark appointment as completed
// @route   PATCH /api/appointments/:id/complete
// @access  Private (Business owner)
router.patch(
  "/:id/complete",
  protect,
  validate,
  appointmentController.completeAppointment
);

// @desc    Get appointment statistics (Business owner)
// @route   GET /api/appointments/business/:businessId/stats
// @access  Private (Business owner)
router.get(
  "/business/:businessId/stats",
  protect,
  validate,
  appointmentController.getAppointmentStats
);

// @desc    Get customer's appointment history
// @route   GET /api/appointments/history
// @access  Private
router.get("/history", protect, appointmentController.getAppointmentHistory);

// @desc    Check time slot availability
// @route   GET /api/appointments/check-availability
// @access  Public
router.get(
  "/check-availability",
  appointmentController.checkTimeSlotAvailability
);

module.exports = router;
