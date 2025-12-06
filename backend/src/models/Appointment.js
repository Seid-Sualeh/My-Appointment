// const mongoose = require("mongoose");

// const appointmentSchema = new mongoose.Schema(
//   {
//     customer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: [true, "Customer is required"],
//     },
//     business: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Business",
//       required: [true, "Business is required"],
//     },
//     service: {
//       name: {
//         type: String,
//         required: [true, "Service name is required"],
//       },
//       description: String,
//       duration: {
//         type: Number,
//         required: [true, "Service duration is required"],
//       },
//       price: {
//         type: Number,
//         required: [true, "Service price is required"],
//       },
//       category: String,
//     },
//     timeSlot: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "TimeSlot",
//       required: [true, "Time slot is required"],
//     },
//     scheduledDate: {
//       type: Date,
//       required: [true, "Appointment date is required"],
//     },
//     startTime: {
//       type: String,
//       required: [true, "Start time is required"],
//     },
//     endTime: {
//       type: String,
//       required: [true, "End time is required"],
//     },
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "cancelled", "completed", "no-show"],
//       default: "pending",
//     },
//     priority: {
//       type: String,
//       enum: ["low", "normal", "high", "urgent"],
//       default: "normal",
//     },
//     notes: {
//       customer: String,
//       business: String,
//       internal: String,
//     },
//     reminders: {
//       sent24Hours: {
//         type: Boolean,
//         default: false,
//       },
//       sent1Hour: {
//         type: Boolean,
//         default: false,
//       },
//       sent15Minutes: {
//         type: Boolean,
//         default: false,
//       },
//     },
//     payment: {
//       amount: {
//         type: Number,
//         required: [true, "Payment amount is required"],
//       },
//       status: {
//         type: String,
//         enum: ["pending", "paid", "refunded", "failed"],
//         default: "pending",
//       },
//       method: {
//         type: String,
//         enum: ["cash", "card", "mobile_money", "bank_transfer"],
//       },
//       transactionId: String,
//       paidAt: Date,
//     },
//     location: {
//       type: {
//         type: String,
//         enum: ["business", "customer", "online"],
//         default: "business",
//       },
//       address: String,
//       coordinates: {
//         latitude: Number,
//         longitude: Number,
//       },
//       onlineMeeting: {
//         platform: String,
//         meetingId: String,
//         password: String,
//         link: String,
//       },
//     },
//     cancellation: {
//       reason: String,
//       cancelledBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//       cancelledAt: Date,
//       refundAmount: Number,
//     },
//     reschedule: {
//       originalDate: Date,
//       originalTimeSlot: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "TimeSlot",
//       },
//       reason: String,
//       rescheduledBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//       rescheduledAt: Date,
//     },
//     feedback: {
//       rating: {
//         type: Number,
//         min: 1,
//         max: 5,
//       },
//       comment: String,
//       submittedAt: Date,
//     },
//     metadata: {
//       source: {
//         type: String,
//         enum: ["web", "mobile", "phone", "walk-in"],
//         default: "web",
//       },
//       userAgent: String,
//       ipAddress: String,
//       referralSource: String,
//     },
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
// );

// // Indexes for better query performance
// appointmentSchema.index({ customer: 1, scheduledDate: 1 });
// appointmentSchema.index({ business: 1, scheduledDate: 1 });
// appointmentSchema.index({ status: 1 });
// appointmentSchema.index({ scheduledDate: 1 });
// appointmentSchema.index({ timeSlot: 1 });

// // Virtual for appointment duration
// appointmentSchema.virtual("duration").get(function () {
//   return this.service.duration;
// });

// // Virtual for total cost
// appointmentSchema.virtual("totalCost").get(function () {
//   return this.service.price;
// });

// // Method to check if appointment can be cancelled
// appointmentSchema.methods.canBeCancelled = function () {
//   const now = new Date();
//   const appointmentTime = new Date(this.scheduledDate);
//   const hoursDifference = (appointmentTime - now) / (1000 * 60 * 60);

//   return (
//     hoursDifference >= 24 && ["pending", "confirmed"].includes(this.status)
//   );
// };

// // Method to check if appointment can be rescheduled
// appointmentSchema.methods.canBeRescheduled = function () {
//   const now = new Date();
//   const appointmentTime = new Date(this.scheduledDate);
//   const hoursDifference = (appointmentTime - now) / (1000 * 60 * 60);

//   return (
//     hoursDifference >= 24 && ["pending", "confirmed"].includes(this.status)
//   );
// };

// // Method to send reminders
// appointmentSchema.methods.shouldSendReminder = function (hoursBefore) {
//   const now = new Date();
//   const appointmentTime = new Date(this.scheduledDate);
//   const hoursDifference = (appointmentTime - now) / (1000 * 60 * 60);

//   return hoursDifference <= hoursBefore && hoursDifference > hoursBefore - 1;
// };

// module.exports = mongoose.model("Appointment", appointmentSchema);











const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    serviceType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "paid"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    cancelledAt: Date,
    cancellationReason: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
appointmentSchema.index({ business: 1, date: 1 });
appointmentSchema.index({ customer: 1, date: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);