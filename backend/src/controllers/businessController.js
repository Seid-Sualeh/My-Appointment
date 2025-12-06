const TimeSlot = require("../models/TimeSlot");
const Appointment = require("../models/Appointment");

// Get business time slots
exports.getTimeSlots = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { startDate, endDate } = req.query;

    // If no businessId in params, use the authenticated user's business ID
    const businessIdToUse = businessId || req.user.id;

    let query = { business: businessIdToUse };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const timeSlots = await TimeSlot.find(query).sort({
      date: 1,
      startTime: 1,
    });

    res.json({
      success: true,
      timeSlots,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create time slot
exports.createTimeSlot = async (req, res) => {
  try {
    const { date, startTime, endTime, maxAppointments, serviceTypes } =
      req.body;
    const businessId = req.user.id;

    // Validate time
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    if (start >= end) {
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    }

    const timeSlot = await TimeSlot.create({
      business: businessId,
      date,
      startTime,
      endTime,
      maxAppointments: maxAppointments || 1,
      serviceTypes: serviceTypes || [],
      isAvailable: true,
    });

    res.status(201).json({
      success: true,
      timeSlot,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Time slot already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update time slot
exports.updateTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const timeSlot = await TimeSlot.findById(id);

    if (!timeSlot) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    // Check if business owns this time slot
    if (timeSlot.business.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Don't allow updating if there are appointments
    if (
      updates.maxAppointments &&
      updates.maxAppointments < timeSlot.currentAppointments
    ) {
      return res.status(400).json({
        message: "Max appointments cannot be less than current appointments",
      });
    }

    Object.assign(timeSlot, updates);
    await timeSlot.save();

    res.json({
      success: true,
      timeSlot,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete time slot
exports.deleteTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const timeSlot = await TimeSlot.findById(id);

    if (!timeSlot) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    // Check if business owns this time slot
    if (timeSlot.business.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if there are appointments
    if (timeSlot.currentAppointments > 0) {
      return res.status(400).json({
        message: "Cannot delete time slot with existing appointments",
      });
    }

    await timeSlot.deleteOne();

    res.json({
      success: true,
      message: "Time slot deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get business appointments
exports.getBusinessAppointments = async (req, res) => {
  try {
    const businessId = req.user.id;
    const { status, startDate, endDate } = req.query;

    let query = { business: businessId };

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const appointments = await Appointment.find(query)
      .populate("customer", "name email phone")
      .sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get business dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const businessId = req.user.id;
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      todaysAppointments,
      monthlyAppointments,
      recentAppointments,
    ] = await Promise.all([
      Appointment.countDocuments({ business: businessId }),
      Appointment.countDocuments({ business: businessId, status: "pending" }),
      Appointment.countDocuments({ business: businessId, status: "confirmed" }),
      Appointment.countDocuments({
        business: businessId,
        date: {
          $gte: new Date(today.setHours(0, 0, 0, 0)),
          $lt: new Date(today.setHours(23, 59, 59, 999)),
        },
        status: { $in: ["pending", "confirmed"] },
      }),
      Appointment.countDocuments({
        business: businessId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      }),
      Appointment.find({ business: businessId })
        .populate("customer", "name")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      success: true,
      stats: {
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        todaysAppointments,
        monthlyAppointments,
        recentAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
