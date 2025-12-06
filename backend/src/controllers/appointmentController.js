const Appointment = require("../models/Appointment");
const TimeSlot = require("../models/TimeSlot");
const User = require("../models/User");

// Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const { businessId, date, startTime, endTime, serviceType, notes } =
      req.body;
    const customerId = req.user.id;

    // Check if business exists
    const business = await User.findById(businessId);
    if (!business || business.role !== "business") {
      return res.status(404).json({ message: "Business not found" });
    }

    // Check if time slot is available
    let timeSlot = await TimeSlot.findOne({
      business: businessId,
      date,
      startTime,
      endTime,
      isAvailable: true,
    });

    // If no time slot exists, create one automatically
    if (!timeSlot) {
      timeSlot = await TimeSlot.create({
        business: businessId,
        date,
        startTime,
        endTime,
        isAvailable: true,
        maxAppointments: 1, // Default to 1 appointment per time slot
        currentAppointments: 0,
        serviceTypes: serviceType ? [serviceType] : [],
      });
    }

    // Check if time slot is fully booked
    if (timeSlot.currentAppointments >= timeSlot.maxAppointments) {
      return res.status(400).json({ message: "Time slot is fully booked" });
    }

    // Create appointment
    const appointment = await Appointment.create({
      customer: customerId,
      business: businessId,
      date,
      startTime,
      endTime,
      serviceType,
      notes,
      status: "pending",
    });

    // Update time slot availability
    timeSlot.currentAppointments += 1;
    if (timeSlot.currentAppointments >= timeSlot.maxAppointments) {
      timeSlot.isAvailable = false;
    }
    await timeSlot.save();

    res.status(201).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user appointments
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, upcoming } = req.query;

    let query = {};

    if (req.user.role === "customer") {
      query.customer = userId;
    } else if (req.user.role === "business") {
      query.business = userId;
    }

    if (status) {
      query.status = status;
    }

    if (upcoming === "true") {
      query.date = { $gte: new Date() };
    }

    const appointments = await Appointment.find(query)
      .populate("customer", "name email phone")
      .populate("business", "name businessName email phone")
      .sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check permissions
    if (
      req.user.role === "customer" &&
      appointment.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (
      req.user.role === "business" &&
      appointment.business.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    appointment.status = status;

    if (status === "cancelled") {
      appointment.cancelledAt = new Date();
      appointment.cancellationReason = cancellationReason;

      // Free up the time slot
      const timeSlot = await TimeSlot.findOne({
        business: appointment.business,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
      });

      if (timeSlot) {
        timeSlot.currentAppointments = Math.max(
          0,
          timeSlot.currentAppointments - 1
        );
        timeSlot.isAvailable = true;
        await timeSlot.save();
      }
    }

    await appointment.save();

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, businessId, customerId } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (businessId) {
      query.business = businessId;
    }

    if (customerId) {
      query.customer = customerId;
    }

    const appointments = await Appointment.find(query)
      .populate("customer", "name email phone")
      .populate("business", "name businessName email phone")
      .sort({ date: 1, startTime: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      appointments,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("customer", "name email phone")
      .populate("business", "name businessName email phone");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check permissions
    if (
      req.user.role === "customer" &&
      appointment.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (
      req.user.role === "business" &&
      appointment.business.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, serviceType, notes } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check permissions
    if (
      req.user.role === "customer" &&
      appointment.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (
      req.user.role === "business" &&
      appointment.business.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if the new time slot is available
    if (date || startTime || endTime) {
      const newDate = date || appointment.date;
      const newStartTime = startTime || appointment.startTime;
      const newEndTime = endTime || appointment.endTime;

      const timeSlot = await TimeSlot.findOne({
        business: appointment.business,
        date: newDate,
        startTime: newStartTime,
        endTime: newEndTime,
        isAvailable: true,
      });

      if (!timeSlot) {
        return res.status(400).json({ message: "Time slot not available" });
      }

      if (timeSlot.currentAppointments >= timeSlot.maxAppointments) {
        return res.status(400).json({ message: "Time slot is fully booked" });
      }
    }

    // Update appointment
    appointment.date = date || appointment.date;
    appointment.startTime = startTime || appointment.startTime;
    appointment.endTime = endTime || appointment.endTime;
    appointment.serviceType = serviceType || appointment.serviceType;
    appointment.notes = notes || appointment.notes;

    await appointment.save();

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check permissions
    if (
      req.user.role === "customer" &&
      appointment.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (
      req.user.role === "business" &&
      appointment.business.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Only allow cancellation if appointment is pending
    if (appointment.status !== "pending") {
      return res.status(400).json({ message: "Appointment cannot be cancelled" });
    }

    appointment.status = "cancelled";
    appointment.cancelledAt = new Date();
    appointment.cancellationReason = cancellationReason;

    // Free up the time slot
    const timeSlot = await TimeSlot.findOne({
      business: appointment.business,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
    });

    if (timeSlot) {
      timeSlot.currentAppointments = Math.max(0, timeSlot.currentAppointments - 1);
      timeSlot.isAvailable = true;
      await timeSlot.save();
    }

    await appointment.save();

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get business appointments
exports.getBusinessAppointments = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { status, date, page = 1, limit = 10 } = req.query;

    // Check if the requesting user is the business owner
    if (req.user.role === "business" && req.user.id !== businessId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let query = { business: businessId };

    if (status) {
      query.status = status;
    }

    if (date) {
      query.date = new Date(date);
    }

    const appointments = await Appointment.find(query)
      .populate("customer", "name email phone")
      .sort({ date: 1, startTime: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      appointments,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get appointments by date range
exports.getAppointmentsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, businessId } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (businessId) {
      query.business = businessId;
    }

    const appointments = await Appointment.find(query)
      .populate("customer", "name email phone")
      .populate("business", "name businessName email phone")
      .sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get upcoming appointments
exports.getUpcomingAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    let query = {
      $or: [
        { customer: userId },
        { business: userId }
      ],
      date: { $gte: now },
      status: { $in: ["pending", "confirmed"] }
    };

    const appointments = await Appointment.find(query)
      .populate("customer", "name email phone")
      .populate("business", "name businessName email phone")
      .sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Confirm appointment
exports.confirmAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if user is the business owner
    if (appointment.business.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Only allow confirmation if appointment is pending
    if (appointment.status !== "pending") {
      return res.status(400).json({ message: "Appointment cannot be confirmed" });
    }

    appointment.status = "confirmed";
    await appointment.save();

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reschedule appointment
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check permissions
    if (
      req.user.role === "customer" &&
      appointment.customer.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (
      req.user.role === "business" &&
      appointment.business.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if the new time slot is available
    const timeSlot = await TimeSlot.findOne({
      business: appointment.business,
      date,
      startTime,
      endTime,
      isAvailable: true,
    });

    if (!timeSlot) {
      return res.status(400).json({ message: "Time slot not available" });
    }

    if (timeSlot.currentAppointments >= timeSlot.maxAppointments) {
      return res.status(400).json({ message: "Time slot is fully booked" });
    }

    // Update appointment
    appointment.date = date;
    appointment.startTime = startTime;
    appointment.endTime = endTime;

    await appointment.save();

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Complete appointment
exports.completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if user is the business owner
    if (appointment.business.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Only allow completion if appointment is confirmed
    if (appointment.status !== "confirmed") {
      return res.status(400).json({ message: "Appointment cannot be completed" });
    }

    appointment.status = "completed";
    appointment.completedAt = new Date();
    await appointment.save();

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get appointment statistics
exports.getAppointmentStats = async (req, res) => {
  try {
    const { businessId } = req.params;

    // Check if the requesting user is the business owner
    if (req.user.role === "business" && req.user.id !== businessId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const stats = {
      total: await Appointment.countDocuments({ business: businessId }),
      pending: await Appointment.countDocuments({
        business: businessId,
        status: "pending",
      }),
      confirmed: await Appointment.countDocuments({
        business: businessId,
        status: "confirmed",
      }),
      completed: await Appointment.countDocuments({
        business: businessId,
        status: "completed",
      }),
      cancelled: await Appointment.countDocuments({
        business: businessId,
        status: "cancelled",
      }),
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get appointment history
exports.getAppointmentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    let query = {
      $or: [
        { customer: userId },
        { business: userId }
      ],
      date: { $lt: now },
    };

    const appointments = await Appointment.find(query)
      .populate("customer", "name email phone")
      .populate("business", "name businessName email phone")
      .sort({ date: -1, startTime: -1 });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Check time slot availability
exports.checkTimeSlotAvailability = async (req, res) => {
  try {
    const { businessId, date, startTime, endTime } = req.query;

    const timeSlot = await TimeSlot.findOne({
      business: businessId,
      date,
      startTime,
      endTime,
      isAvailable: true,
    });

    const isAvailable = !!timeSlot &&
      timeSlot.currentAppointments < timeSlot.maxAppointments;

    res.json({
      success: true,
      isAvailable,
      timeSlot: timeSlot || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
