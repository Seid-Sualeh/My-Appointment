// // const nodemailer = require("nodemailer");
// // const crypto = require("crypto");

// // // Create reusable transporter object using SMTP transport
// // const createTransporter = () => {
// //   return nodemailer.createTransporter({
// //     host: process.env.EMAIL_HOST || "smtp.gmail.com",
// //     port: process.env.EMAIL_PORT || 587,
// //     secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
// //     auth: {
// //       user: process.env.EMAIL_USER,
// //       pass: process.env.EMAIL_PASS,
// //     },
// //   });
// // };

// // // Send registration email
// // const sendRegistrationEmail = async (user, verificationToken) => {
// //   try {
// //     const transporter = createTransporter();

// //     const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

// //     const mailOptions = {
// //       from: `"Appointment System" <${process.env.EMAIL_USER}>`,
// //       to: user.email,
// //       subject: "Welcome to Appointment Management System - Verify Your Email",
// //       html: `
// //         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
// //           <h2 style="color: #333;">Welcome to Appointment Management System!</h2>
// //           <p>Hi ${user.name},</p>
// //           <p>Thank you for registering with our appointment management system. To complete your registration, please verify your email address by clicking the link below:</p>
// //           <div style="text-align: center; margin: 30px 0;">
// //             <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
// //           </div>
// //           <p>If the button doesn't work, copy and paste this link into your browser:</p>
// //           <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
// //           <p>This verification link will expire in 24 hours.</p>
// //           <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
// //           <p style="color: #666; font-size: 12px;">If you didn't create this account, please ignore this email.</p>
// //         </div>
// //       `,
// //     };

// //     await transporter.sendMail(mailOptions);
// //     console.log(`Registration email sent to ${user.email}`);
// //   } catch (error) {
// //     console.error("Error sending registration email:", error);
// //     throw new Error("Failed to send registration email");
// //   }
// // };

// // // Send appointment confirmation email
// // const sendAppointmentConfirmationEmail = async (
// //   appointment,
// //   business,
// //   customer
// // ) => {
// //   try {
// //     const transporter = createTransporter();

// //     const mailOptions = {
// //       from: `"Appointment System" <${process.env.EMAIL_USER}>`,
// //       to: customer.email,
// //       subject: "Appointment Confirmation",
// //       html: `
// //         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
// //           <h2 style="color: #28a745;">Appointment Confirmed!</h2>
// //           <p>Hi ${customer.name},</p>
// //           <p>Your appointment has been confirmed. Here are the details:</p>

// //           <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
// //             <h3 style="margin-top: 0; color: #333;">Appointment Details</h3>
// //             <p><strong>Business:</strong> ${business.name}</p>
// //             <p><strong>Date:</strong> ${new Date(
// //               appointment.date
// //             ).toLocaleDateString()}</p>
// //             <p><strong>Time:</strong> ${appointment.timeSlot.startTime} - ${
// //         appointment.timeSlot.endTime
// //       }</p>
// //             <p><strong>Address:</strong> ${business.address}</p>
// //             <p><strong>Phone:</strong> ${business.phone}</p>
// //             ${
// //               appointment.notes
// //                 ? `<p><strong>Notes:</strong> ${appointment.notes}</p>`
// //                 : ""
// //             }
// //           </div>

// //           <p>Please arrive 10 minutes early for your appointment.</p>

// //           <div style="text-align: center; margin: 30px 0;">
// //             <a href="${process.env.FRONTEND_URL}/appointments/${
// //         appointment._id
// //       }" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View Appointment</a>
// //           </div>

// //           <p>If you need to cancel or reschedule, please do so at least 2 hours in advance.</p>

// //           <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
// //           <p style="color: #666; font-size: 12px;">Thank you for using our service!</p>
// //         </div>
// //       `,
// //     };

// //     await transporter.sendMail(mailOptions);
// //     console.log(`Appointment confirmation email sent to ${customer.email}`);
// //   } catch (error) {
// //     console.error("Error sending appointment confirmation email:", error);
// //     throw new Error("Failed to send appointment confirmation email");
// //   }
// // };

// // // Send appointment reminder email
// // const sendAppointmentReminderEmail = async (
// //   appointment,
// //   business,
// //   customer
// // ) => {
// //   try {
// //     const transporter = createTransporter();

// //     const mailOptions = {
// //       from: `"Appointment System" <${process.env.EMAIL_USER}>`,
// //       to: customer.email,
// //       subject: "Appointment Reminder - Tomorrow",
// //       html: `
// //         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
// //           <h2 style="color: #ffc107;">Appointment Reminder</h2>
// //           <p>Hi ${customer.name},</p>
// //           <p>This is a friendly reminder about your upcoming appointment tomorrow:</p>

// //           <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
// //             <h3 style="margin-top: 0; color: #333;">Appointment Details</h3>
// //             <p><strong>Business:</strong> ${business.name}</p>
// //             <p><strong>Date:</strong> ${new Date(
// //               appointment.date
// //             ).toLocaleDateString()}</p>
// //             <p><strong>Time:</strong> ${appointment.timeSlot.startTime} - ${
// //         appointment.timeSlot.endTime
// //       }</p>
// //             <p><strong>Address:</strong> ${business.address}</p>
// //             <p><strong>Phone:</strong> ${business.phone}</p>
// //           </div>

// //           <p>Please arrive 10 minutes early for your appointment.</p>

// //           <div style="text-align: center; margin: 30px 0;">
// //             <a href="${process.env.FRONTEND_URL}/appointments/${
// //         appointment._id
// //       }" style="background-color: #ffc107; color: #212529; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">View Appointment Details</a>
// //           </div>

// //           <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
// //           <p style="color: #666; font-size: 12px;">If you can't make it, please cancel at least 2 hours in advance.</p>
// //         </div>
// //       `,
// //     };

// //     await transporter.sendMail(mailOptions);
// //     console.log(`Appointment reminder email sent to ${customer.email}`);
// //   } catch (error) {
// //     console.error("Error sending appointment reminder email:", error);
// //     throw new Error("Failed to send appointment reminder email");
// //   }
// // };

// // // Send appointment cancellation email
// // const sendAppointmentCancellationEmail = async (
// //   appointment,
// //   business,
// //   customer
// // ) => {
// //   try {
// //     const transporter = createTransporter();

// //     const mailOptions = {
// //       from: `"Appointment System" <${process.env.EMAIL_USER}>`,
// //       to: customer.email,
// //       subject: "Appointment Cancelled",
// //       html: `
// //         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
// //           <h2 style="color: #dc3545;">Appointment Cancelled</h2>
// //           <p>Hi ${customer.name},</p>
// //           <p>Your appointment has been cancelled. Here are the details:</p>

// //           <div style="background-color: #f8d7da; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
// //             <h3 style="margin-top: 0; color: #333;">Cancelled Appointment</h3>
// //             <p><strong>Business:</strong> ${business.name}</p>
// //             <p><strong>Date:</strong> ${new Date(
// //               appointment.date
// //             ).toLocaleDateString()}</p>
// //             <p><strong>Time:</strong> ${appointment.timeSlot.startTime} - ${
// //         appointment.timeSlot.endTime
// //       }</p>
// //             <p><strong>Cancelled:</strong> ${new Date().toLocaleDateString()}</p>
// //           </div>

// //           <p>We're sorry for any inconvenience. You can book a new appointment at any time.</p>

// //           <div style="text-align: center; margin: 30px 0;">
// //             <a href="${
// //               process.env.FRONTEND_URL
// //             }/businesses" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Book New Appointment</a>
// //           </div>

// //           <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
// //           <p style="color: #666; font-size: 12px;">Thank you for your understanding.</p>
// //         </div>
// //       `,
// //     };

// //     await transporter.sendMail(mailOptions);
// //     console.log(`Appointment cancellation email sent to ${customer.email}`);
// //   } catch (error) {
// //     console.error("Error sending appointment cancellation email:", error);
// //     throw new Error("Failed to send appointment cancellation email");
// //   }
// // };

// // // Send password reset email
// // const sendPasswordResetEmail = async (user, resetToken) => {
// //   try {
// //     const transporter = createTransporter();

// //     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

// //     const mailOptions = {
// //       from: `"Appointment System" <${process.env.EMAIL_USER}>`,
// //       to: user.email,
// //       subject: "Password Reset Request",
// //       html: `
// //         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
// //           <h2 style="color: #333;">Password Reset Request</h2>
// //           <p>Hi ${user.name},</p>
// //           <p>You requested a password reset for your account. Click the link below to reset your password:</p>

// //           <div style="text-align: center; margin: 30px 0;">
// //             <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
// //           </div>

// //           <p>If the button doesn't work, copy and paste this link into your browser:</p>
// //           <p style="word-break: break-all; color: #666;">${resetUrl}</p>

// //           <p>This link will expire in 1 hour.</p>

// //           <p>If you didn't request this password reset, please ignore this email.</p>

// //           <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
// //           <p style="color: #666; font-size: 12px;">For security reasons, never share this link with anyone.</p>
// //         </div>
// //       `,
// //     };

// //     await transporter.sendMail(mailOptions);
// //     console.log(`Password reset email sent to ${user.email}`);
// //   } catch (error) {
// //     console.error("Error sending password reset email:", error);
// //     throw new Error("Failed to send password reset email");
// //   }
// // };

// // // Generate email verification token
// // const generateVerificationToken = () => {
// //   return crypto.randomBytes(32).toString("hex");
// // };

// // // Generate password reset token
// // const generatePasswordResetToken = () => {
// //   return crypto.randomBytes(32).toString("hex");
// // };

// // module.exports = {
// //   sendRegistrationEmail,
// //   sendAppointmentConfirmationEmail,
// //   sendAppointmentReminderEmail,
// //   sendAppointmentCancellationEmail,
// //   sendPasswordResetEmail,
// //   generateVerificationToken,
// //   generatePasswordResetToken,
// // };

// const nodemailer = require("nodemailer");

// // Create transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: process.env.EMAIL_PORT === "465",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Verify transporter
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("Email transporter error:", error);
//   } else {
//     console.log("Email transporter is ready");
//   }
// });

// // Send email function
// const sendEmail = async (to, subject, html, text = "") => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Appointment System" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//       html,
//     });

//     console.log("Email sent:", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }
// };

// // Send appointment confirmation
// const sendAppointmentConfirmation = async (appointment, customer, business) => {
//   const appointmentDate = new Date(appointment.date).toLocaleDateString(
//     "en-US",
//     {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     }
//   );

//   const subject = "Appointment Confirmation";
//   const html = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #4F46E5;">Appointment Confirmed!</h2>
//       <p>Dear ${customer.name},</p>
//       <p>Your appointment has been successfully confirmed.</p>

//       <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
//         <h3 style="color: #374151; margin-top: 0;">Appointment Details:</h3>
//         <p><strong>Business:</strong> ${
//           business.businessName || business.name
//         }</p>
//         <p><strong>Date:</strong> ${appointmentDate}</p>
//         <p><strong>Time:</strong> ${appointment.startTime} - ${
//     appointment.endTime
//   }</p>
//         <p><strong>Service:</strong> ${appointment.serviceType}</p>
//         ${
//           appointment.notes
//             ? `<p><strong>Notes:</strong> ${appointment.notes}</p>`
//             : ""
//         }
//       </div>

//       <p>Please arrive 5-10 minutes before your scheduled time.</p>
//       <p>If you need to reschedule or cancel, please do so at least 2 hours in advance.</p>

//       <p>Best regards,<br>The Appointment System Team</p>
//     </div>
//   `;

//   return sendEmail(customer.email, subject, html);
// };

// // Send appointment reminder
// const sendAppointmentReminder = async (appointment, customer, business) => {
//   const appointmentDate = new Date(appointment.date).toLocaleDateString(
//     "en-US",
//     {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     }
//   );

//   const subject = "Appointment Reminder";
//   const html = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #4F46E5;">Appointment Reminder</h2>
//       <p>Dear ${customer.name},</p>
//       <p>This is a friendly reminder about your upcoming appointment.</p>

//       <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
//         <h3 style="color: #92400E; margin-top: 0;">Appointment Details:</h3>
//         <p><strong>Business:</strong> ${
//           business.businessName || business.name
//         }</p>
//         <p><strong>Date:</strong> ${appointmentDate}</p>
//         <p><strong>Time:</strong> ${appointment.startTime} - ${
//     appointment.endTime
//   }</p>
//         <p><strong>Service:</strong> ${appointment.serviceType}</p>
//       </div>

//       <p>Please remember to arrive on time. If you need to reschedule or cancel, please do so as soon as possible.</p>

//       <p>Best regards,<br>The Appointment System Team</p>
//     </div>
//   `;

//   return sendEmail(customer.email, subject, html);
// };

// // Send appointment cancellation
// const sendAppointmentCancellation = async (appointment, customer, business) => {
//   const subject = "Appointment Cancellation";
//   const html = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #DC2626;">Appointment Cancelled</h2>
//       <p>Dear ${customer.name},</p>
//       <p>Your appointment has been cancelled.</p>

//       <div style="background-color: #FEE2E2; padding: 20px; border-radius: 8px; margin: 20px 0;">
//         <h3 style="color: #991B1B; margin-top: 0;">Cancelled Appointment:</h3>
//         <p><strong>Business:</strong> ${
//           business.businessName || business.name
//         }</p>
//         <p><strong>Date:</strong> ${new Date(
//           appointment.date
//         ).toLocaleDateString()}</p>
//         <p><strong>Time:</strong> ${appointment.startTime} - ${
//     appointment.endTime
//   }</p>
//         <p><strong>Service:</strong> ${appointment.serviceType}</p>
//         ${
//           appointment.cancellationReason
//             ? `<p><strong>Reason:</strong> ${appointment.cancellationReason}</p>`
//             : ""
//         }
//       </div>

//       <p>We hope to see you again soon!</p>
//       <p>Best regards,<br>The Appointment System Team</p>
//     </div>
//   `;

//   return sendEmail(customer.email, subject, html);
// };

// module.exports = {
//   sendEmail,
//   sendAppointmentConfirmation,
//   sendAppointmentReminder,
//   sendAppointmentCancellation,
// };

const nodemailer = require("nodemailer");
const emailTemplates = require("./emailTemplates");

// Check if email configuration is available
const isEmailConfigured = () => {
  return !!(
    process.env.EMAIL_HOST &&
    process.env.EMAIL_PORT &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS
  );
};

// Create transporter only if email is configured
let transporter = null;

if (isEmailConfigured()) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === "465",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify transporter
  transporter.verify((error, success) => {
    if (error) {
      console.error("Email transporter error:", error);
      console.warn(
        "Email service is not available. Registration and login will work, but verification emails won't be sent."
      );
    } else {
      console.log("Email transporter is ready");
    }
  });
} else {
  console.warn("Email configuration not found. Email service disabled.");
  console.warn(
    "Registration and login will work, but verification emails won't be sent."
  );
  console.warn(
    "To enable email, set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS environment variables."
  );
}

// Generic send email function
const sendEmail = async (to, subject, html, text = "") => {
  // If email is not configured, log and return without error
  if (!isEmailConfigured() || !transporter) {
    console.warn(
      `Email not configured. Would send email to ${to} with subject: ${subject}`
    );
    console.warn(
      "In development, you can verify emails manually or configure email settings."
    );
    return { messageId: "email-not-configured", accepted: [to] };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Appointment System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw error - allow registration/login to proceed even if email fails
    console.warn("Email sending failed, but registration/login will continue.");
    return { messageId: "email-send-failed", accepted: [to] };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const emailContent = emailTemplates.getPasswordResetEmail(resetUrl, user);

  return sendEmail(user.email, emailContent.subject, emailContent.html);
};

// Send email verification email
const sendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
  const emailContent = emailTemplates.getVerificationEmail(
    verificationUrl,
    user
  );

  return sendEmail(user.email, emailContent.subject, emailContent.html);
};

// Send password changed confirmation
const sendPasswordChangedEmail = async (user) => {
  const emailContent = emailTemplates.getPasswordChangedEmail(user);

  return sendEmail(user.email, emailContent.subject, emailContent.html);
};

// Resend verification email
const sendResendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
  const emailContent = emailTemplates.getResendVerificationEmail(
    verificationUrl,
    user
  );

  return sendEmail(user.email, emailContent.subject, emailContent.html);
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendPasswordChangedEmail,
  sendResendVerificationEmail,
};
