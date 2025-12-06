const cron = require("node-cron");
const { sendAppointmentReminders } = require("../cron/appointmentReminders");

// Schedule the cron job to run every day at 9 AM
cron.schedule("0 9 * * *", () => {
  console.log("Running appointment reminder cron job...");
  sendAppointmentReminders();
});

console.log("Cron job scheduled for appointment reminders at 9 AM daily.");
