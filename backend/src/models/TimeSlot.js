// const mongoose = require("mongoose");

// const timeSlotSchema = new mongoose.Schema(
//   {
//     business: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Business",
//       required: [true, "Business is required"],
//     },
//     date: {
//       type: Date,
//       required: [true, "Date is required"],
//     },
//     startTime: {
//       type: String,
//       required: [true, "Start time is required"],
//       match: [
//         /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
//         "Time must be in HH:MM format",
//       ],
//     },
//     endTime: {
//       type: String,
//       required: [true, "End time is required"],
//       match: [
//         /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
//         "Time must be in HH:MM format",
//       ],
//     },
//     duration: {
//       type: Number,
//       required: [true, "Duration is required"],
//       min: [15, "Minimum duration is 15 minutes"],
//     },
//     service: {
//       name: {
//         type: String,
//         required: [true, "Service name is required"],
//       },
//       category: String,
//       price: {
//         type: Number,
//         required: [true, "Service price is required"],
//       },
//     },
//     staff: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     status: {
//       type: String,
//       enum: ["available", "booked", "blocked", "break", "maintenance"],
//       default: "available",
//     },
//     appointment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Appointment",
//     },
//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     maxBookings: {
//       type: Number,
//       default: 1,
//       min: 1,
//     },
//     currentBookings: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//     isRecurring: {
//       type: Boolean,
//       default: false,
//     },
//     recurrencePattern: {
//       type: {
//         type: String,
//         enum: ["daily", "weekly", "monthly"],
//       },
//       interval: {
//         type: Number,
//         default: 1,
//       },
//       daysOfWeek: [
//         {
//           type: Number,
//           min: 0,
//           max: 6,
//         },
//       ],
//       endDate: Date,
//       maxOccurrences: Number,
//     },
//     blockedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     blockReason: String,
//     blockExpires: Date,
//     specialPricing: {
//       isActive: {
//         type: Boolean,
//         default: false,
//       },
//       price: Number,
//       reason: String,
//       validFrom: Date,
//       validUntil: Date,
//     },
//     metadata: {
//       source: {
//         type: String,
//         enum: ["manual", "automatic", "bulk_import"],
//         default: "manual",
//       },
//       notes: String,
//       tags: [String],
//     },
//     timezone: {
//       type: String,
//       default: "Africa/Nairobi",
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// // Compound indexes for better query performance
// timeSlotSchema.index({ business: 1, date: 1, startTime: 1 });
// timeSlotSchema.index({ business: 1, date: 1 });
// timeSlotSchema.index({ date: 1, status: 1 });
// timeSlotSchema.index({ appointment: 1 });
// timeSlotSchema.index({ customer: 1 });
// timeSlotSchema.index({ staff: 1, date: 1 });

// // Virtual for formatted time range
// timeSlotSchema.virtual("timeRange").get(function () {
//   return `${this.startTime} - ${this.endTime}`;
// });

// // Virtual for duration in hours
// timeSlotSchema.virtual("durationHours").get(function () {
//   return this.duration / 60;
// });

// // Virtual for available capacity
// timeSlotSchema.virtual("availableCapacity").get(function () {
//   return this.maxBookings - this.currentBookings;
// });

// // Virtual for is fully booked
// timeSlotSchema.virtual("isFullyBooked").get(function () {
//   return this.currentBookings >= this.maxBookings;
// });

// // Virtual for is available for booking
// timeSlotSchema.virtual("isAvailableForBooking").get(function () {
//   return (
//     this.status === "available" &&
//     !this.isFullyBooked &&
//     new Date() < new Date(this.date)
//   );
// });

// // Pre-save middleware to calculate end time if not provided
// timeSlotSchema.pre("save", function (next) {
//   if (!this.endTime && this.startTime && this.duration) {
//     const [hours, minutes] = this.startTime.split(":").map(Number);
//     const startMinutes = hours * 60 + minutes;
//     const endMinutes = startMinutes + this.duration;
//     const endHours = Math.floor(endMinutes / 60);
//     const endMins = endMinutes % 60;
//     this.endTime = `${endHours.toString().padStart(2, "0")}:${endMins
//       .toString()
//       .padStart(2, "0")}`;
//   }
//   next();
// });

// // Method to check if time slot can be booked
// timeSlotSchema.methods.canBeBooked = function () {
//   const now = new Date();
//   const slotDateTime = new Date(this.date);
//   const [hours, minutes] = this.startTime.split(":").map(Number);
//   slotDateTime.setHours(hours, minutes, 0, 0);

//   return (
//     this.status === "available" && !this.isFullyBooked && slotDateTime > now
//   );
// };

// // Method to book the time slot
// timeSlotSchema.methods.book = function (customerId, appointmentId) {
//   if (!this.canBeBooked()) {
//     throw new Error("Time slot cannot be booked");
//   }

//   this.currentBookings += 1;
//   this.customer = customerId;
//   this.appointment = appointmentId;

//   if (this.currentBookings >= this.maxBookings) {
//     this.status = "booked";
//   }

//   return this.save();
// };

// // Method to cancel booking
// timeSlotSchema.methods.cancelBooking = function () {
//   if (this.currentBookings > 0) {
//     this.currentBookings -= 1;
//   }

//   this.customer = undefined;
//   this.appointment = undefined;

//   if (this.currentBookings < this.maxBookings && this.status === "booked") {
//     this.status = "available";
//   }

//   return this.save();
// };

// // Method to block time slot
// timeSlotSchema.methods.block = function (userId, reason, expiresInHours = 24) {
//   this.status = "blocked";
//   this.blockedBy = userId;
//   this.blockReason = reason;
//   this.blockExpires = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

//   return this.save();
// };

// // Method to unblock time slot
// timeSlotSchema.methods.unblock = function () {
//   if (this.status === "blocked") {
//     this.status = "available";
//     this.blockedBy = undefined;
//     this.blockReason = undefined;
//     this.blockExpires = undefined;
//   }

//   return this.save();
// };

// // Static method to find available slots for a date range
// timeSlotSchema.statics.findAvailableSlots = function (
//   businessId,
//   startDate,
//   endDate,
//   serviceName
// ) {
//   const query = {
//     business: businessId,
//     status: "available",
//     date: {
//       $gte: new Date(startDate),
//       $lte: new Date(endDate),
//     },
//   };

//   if (serviceName) {
//     query["service.name"] = new RegExp(serviceName, "i");
//   }

//   return this.find(query).sort({ date: 1, startTime: 1 });
// };

// // Static method to check slot conflicts
// timeSlotSchema.statics.checkConflicts = function (
//   businessId,
//   date,
//   startTime,
//   endTime,
//   excludeSlotId
// ) {
//   const query = {
//     business: businessId,
//     date: new Date(date),
//     $or: [
//       {
//         startTime: { $lt: endTime },
//         endTime: { $gt: startTime },
//       },
//     ],
//   };

//   if (excludeSlotId) {
//     query._id = { $ne: excludeSlotId };
//   }

//   return this.find(query);
// };


// module.exports = mongoose.model("TimeSlot", timeSlotSchema);








const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    maxAppointments: {
      type: Number,
      default: 1,
    },
    currentAppointments: {
      type: Number,
      default: 0,
    },
    serviceTypes: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for unique time slots per business
timeSlotSchema.index(
  { business: 1, date: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

module.exports = mongoose.model("TimeSlot", timeSlotSchema);
