const User = require("../models/User");
const Appointment = require("../models/Appointment");
const TimeSlot = require("../models/TimeSlot");

// Search for businesses
exports.searchBusinesses = async (req, res) => {
  try {
    const { search } = req.query;

    let query = { role: "business" };

    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { businessDescription: { $regex: search, $options: "i" } },
      ];
    }

    const businesses = await User.find(query)
      .select("name email phone businessName businessDescription")
      .limit(20);

    res.json({
      success: true,
      businesses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get business details
exports.getBusinessDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await User.findById(id).select(
      "name email phone businessName businessDescription"
    );

    if (!business || business.role !== "business") {
      return res.status(404).json({ message: "Business not found" });
    }

    // Get available time slots for next 7 days
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const timeSlots = await TimeSlot.find({
      business: id,
      date: { $gte: startDate, $lte: endDate },
      isAvailable: true,
    }).sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      business: {
        ...business.toObject(),
        availableTimeSlots: timeSlots,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get available time slots for a business
exports.getAvailableTimeSlots = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const queryDate = new Date(date);
    const timeSlots = await TimeSlot.find({
      business: businessId,
      date: queryDate,
      isAvailable: true,
    }).sort({ startTime: 1 });

    res.json({
      success: true,
      timeSlots,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if customer owns this appointment
    if (appointment.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if appointment can be cancelled (at least 2 hours before)
    const appointmentTime = new Date(appointment.date);
    const appointmentDateTime = new Date(
      `${appointment.date.toISOString().split("T")[0]}T${appointment.startTime}`
    );

    const now = new Date();
    const hoursBefore = (appointmentDateTime - now) / (1000 * 60 * 60);

    if (hoursBefore < 2) {
      return res.status(400).json({
        message:
          "Appointments can only be cancelled at least 2 hours before the scheduled time",
      });
    }

    appointment.status = "cancelled";
    appointment.cancellationReason = reason;
    appointment.cancelledAt = new Date();

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
      timeSlot.isAvailable =
        timeSlot.currentAppointments < timeSlot.maxAppointments;
      await timeSlot.save();
    }

    await appointment.save();

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
