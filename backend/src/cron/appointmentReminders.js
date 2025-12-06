const cron = require("node-cron");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Business = require("../models/Business");
const { sendAppointmentReminderEmail } = require("../utils/emailService");
const { formatDate, formatTime, addDays } = require("../utils/helpers");

// Run every day at 9:00 AM to send next day reminders
const scheduleDailyReminders = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("Running daily appointment reminder job...");
    await sendNextDayReminders();
  });
};

// Run every hour to send urgent reminders (appointments within 2 hours)
const scheduleHourlyReminders = () => {
  cron.schedule("0 * * * *", async () => {
    console.log("Running hourly urgent reminder job...");
    await sendUrgentReminders();
  });
};

// Send reminders for appointments happening tomorrow
const sendNextDayReminders = async () => {
  try {
    // Get tomorrow's date
    const tomorrow = addDays(new Date(), 1);
    const tomorrowStart = new Date(tomorrow);
    tomorrowStart.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    // Find appointments for tomorrow
    const appointments = await Appointment.find({
      date: {
        $gte: tomorrowStart,
        $lte: tomorrowEnd,
      },
      status: { $in: ["confirmed", "pending"] },
    })
      .populate("customer", "name email phone preferences")
      .populate("business", "name address phone")
      .populate("timeSlot", "startTime endTime");

    console.log(`Found ${appointments.length} appointments for tomorrow`);

    for (const appointment of appointments) {
      // Check if customer wants email notifications
      if (
        appointment.customer.preferences &&
        appointment.customer.preferences.emailNotifications !== false
      ) {
        try {
          await sendAppointmentReminderEmail(
            appointment,
            appointment.business,
            appointment.customer
          );

          // Update appointment to mark reminder as sent
          appointment.reminders = appointment.reminders || {};
          appointment.reminders.nextDayReminderSent = true;
          await appointment.save();

          console.log(
            `Reminder sent for appointment ${appointment._id} to ${appointment.customer.email}`
          );
        } catch (error) {
          console.error(
            `Failed to send reminder for appointment ${appointment._id}:`,
            error
          );
        }
      }
    }
  } catch (error) {
    console.error("Error in sendNextDayReminders:", error);
  }
};

// Send urgent reminders for appointments within 2 hours
const sendUrgentReminders = async () => {
  try {
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    // Find appointments within the next 2 hours
    const appointments = await Appointment.find({
      date: {
        $gte: now,
        $lte: twoHoursLater,
      },
      status: { $in: ["confirmed", "pending"] },
      "reminders.urgentReminderSent": { $ne: true },
    })
      .populate("customer", "name email phone preferences")
      .populate("business", "name address phone")
      .populate("timeSlot", "startTime endTime");

    console.log(
      `Found ${appointments.length} urgent appointments for next 2 hours`
    );

    for (const appointment of appointments) {
      // Check if customer wants email notifications
      if (
        appointment.customer.preferences &&
        appointment.customer.preferences.emailNotifications !== false
      ) {
        try {
          // Create urgent reminder with special formatting
          const urgentAppointment = {
            ...appointment.toObject(),
            urgentReminder: true,
            timeUntilAppointment: calculateTimeUntilAppointment(appointment),
          };

          await sendAppointmentReminderEmail(
            urgentAppointment,
            appointment.business,
            appointment.customer
          );

          // Update appointment to mark urgent reminder as sent
          appointment.reminders = appointment.reminders || {};
          appointment.reminders.urgentReminderSent = true;
          await appointment.save();

          console.log(
            `Urgent reminder sent for appointment ${appointment._id} to ${appointment.customer.email}`
          );
        } catch (error) {
          console.error(
            `Failed to send urgent reminder for appointment ${appointment._id}:`,
            error
          );
        }
      }
    }
  } catch (error) {
    console.error("Error in sendUrgentReminders:", error);
  }
};

// Calculate time until appointment
const calculateTimeUntilAppointment = (appointment) => {
  const now = new Date();
  const appointmentDateTime = new Date(
    `${formatDate(appointment.date)} ${appointment.timeSlot.startTime}`
  );
  const diffMs = appointmentDateTime - now;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  } else {
    return `${diffMinutes}m`;
  }
};

// Send weekly summary emails (Sundays at 10:00 AM)
const scheduleWeeklySummary = () => {
  cron.schedule("0 10 * * 0", async () => {
    console.log("Running weekly summary job...");
    await sendWeeklySummary();
  });
};

// Send weekly summary of appointments
const sendWeeklySummary = async () => {
  try {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Get all customers who had appointments this week
    const customersWithAppointments = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: weekStart, $lte: weekEnd },
        },
      },
      {
        $group: {
          _id: "$customer",
          appointmentCount: { $sum: 1 },
          confirmedAppointments: {
            $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
          },
          cancelledAppointments: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

    for (const customerStats of customersWithAppointments) {
      try {
        const customer = await User.findById(customerStats._id);
        if (!customer) continue;

        // Check if customer wants weekly summary
        if (
          customer.preferences &&
          customer.preferences.weeklySummary !== false
        ) {
          await sendWeeklySummaryEmail(
            customer,
            customerStats,
            weekStart,
            weekEnd
          );
          console.log(`Weekly summary sent to ${customer.email}`);
        }
      } catch (error) {
        console.error(
          `Failed to send weekly summary to customer ${customerStats._id}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error in sendWeeklySummary:", error);
  }
};

// Send individual weekly summary email
const sendWeeklySummaryEmail = async (customer, stats, weekStart, weekEnd) => {
  try {
    const transporter = require("nodemailer").createTransporter({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const weekStartStr = weekStart.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const weekEndStr = weekEnd.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const mailOptions = {
      from: `"Appointment System" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: `Your Weekly Appointment Summary`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Your Weekly Appointment Summary</h2>
          <p>Hi ${customer.name},</p>
          <p>Here's your appointment summary for the week of ${weekStartStr} - ${weekEndStr}:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">This Week's Activity</h3>
            <p><strong>Total Appointments:</strong> ${stats.appointmentCount}</p>
            <p><strong>Confirmed:</strong> ${stats.confirmedAppointments}</p>
            <p><strong>Cancelled:</strong> ${stats.cancelledAppointments}</p>
          </div>
          
          <p>Thank you for using our appointment management system!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View Dashboard</a>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">To unsubscribe from weekly summaries, update your preferences in your profile.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending weekly summary email:", error);
    throw error;
  }
};

// Cleanup old reminder records (run monthly)
const scheduleMonthlyCleanup = () => {
  cron.schedule("0 2 1 * *", async () => {
    console.log("Running monthly cleanup job...");
    await cleanupOldReminderRecords();
  });
};

// Clean up old reminder records to keep database clean
const cleanupOldReminderRecords = async () => {
  try {
    const thirtyDaysAgo = addDays(new Date(), -30);

    // Remove reminder flags from appointments older than 30 days
    const result = await Appointment.updateMany(
      {
        date: { $lt: thirtyDaysAgo },
        "reminders.nextDayReminderSent": true,
      },
      {
        $unset: {
          "reminders.nextDayReminderSent": "",
          "reminders.urgentReminderSent": "",
        },
      }
    );

    console.log(
      `Cleaned up reminder records: ${result.modifiedCount} appointments processed`
    );
  } catch (error) {
    console.error("Error in cleanupOldReminderRecords:", error);
  }
};

// Initialize all cron jobs
const initializeCronJobs = () => {
  console.log("Initializing cron jobs for appointment reminders...");

  scheduleDailyReminders();
  scheduleHourlyReminders();
  scheduleWeeklySummary();
  scheduleMonthlyCleanup();

  console.log("All cron jobs scheduled successfully");
};

module.exports = {
  initializeCronJobs,
  sendNextDayReminders,
  sendUrgentReminders,
  scheduleDailyReminders,
  scheduleHourlyReminders,
  scheduleWeeklySummary,
  scheduleMonthlyCleanup,
};
