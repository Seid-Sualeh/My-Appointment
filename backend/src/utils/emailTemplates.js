const emailTemplates = {
  // Password Reset Email
  getPasswordResetEmail: (resetUrl, user) => ({
    subject: "Reset Your Password - Appointment Management System",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <p>You recently requested to reset your password for your Appointment Management System account. Click the button below to reset it.</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <div class="warning">
              <p><strong>⚠️ This link will expire in 10 minutes</strong></p>
              <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
            
            <p>Alternatively, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            
            <p>If you're having trouble with the button above, copy and paste the URL into your web browser.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Appointment Management System. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Email Verification Email
  getVerificationEmail: (verificationUrl, user) => ({
    subject: "Verify Your Email - Appointment Management System",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #4facfe; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .welcome { font-size: 18px; color: #333; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Appointment Management System!</h1>
          </div>
          <div class="content">
            <p class="welcome">Hello ${user.name},</p>
            <p>Thank you for signing up! Please verify your email address to activate your account and start using our services.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>Alternatively, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4facfe;">${verificationUrl}</p>
            
            <p><strong>Why verify your email?</strong></p>
            <ul>
              <li>Secure your account</li>
              <li>Receive important notifications</li>
              <li>Reset your password if needed</li>
              <li>Get appointment reminders</li>
            </ul>
            
            <p>If you did not create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Appointment Management System. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Password Changed Confirmation
  getPasswordChangedEmail: (user) => ({
    subject: "Password Changed Successfully - Appointment Management System",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #5eff8d 0%, #1cc659 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .info-box { background: #e8f5e9; border: 1px solid #c8e6c9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Updated Successfully</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <p>Your password has been changed successfully.</p>
            
            <div class="info-box">
              <p><strong>Date:</strong> ${new Date().toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleTimeString(
                "en-US"
              )}</p>
            </div>
            
            <p><strong>Security Tips:</strong></p>
            <ul>
              <li>Use a strong, unique password</li>
              <li>Never share your password with anyone</li>
              <li>Enable two-factor authentication if available</li>
              <li>Log out from shared computers</li>
            </ul>
            
            <div class="info-box">
              <p><strong>⚠️ Important:</strong> If you did not make this change, please contact our support team immediately.</p>
            </div>
            
            <p>Thank you for helping us keep your account secure.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Appointment Management System. All rights reserved.</p>
            <p>This is an automated security notification.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Resend Verification Email
  getResendVerificationEmail: (verificationUrl, user) => ({
    subject: "Verify Your Email - Action Required",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #f093fb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .reminder { background: #fef3c7; border: 1px solid #fde68a; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Complete Your Registration</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <p>We noticed that you haven't verified your email address yet. To access all features of our Appointment Management System, please verify your email.</p>
            
            <div class="reminder">
              <p><strong>🔒 Account Access:</strong> Some features may be limited until you verify your email address.</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Now</a>
            </div>
            
            <p>Alternatively, copy and paste this link:</p>
            <p style="word-break: break-all; color: #f093fb;">${verificationUrl}</p>
            
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't request this email, you can safely ignore it.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Appointment Management System. All rights reserved.</p>
            <p>This email was sent in response to a request from your account.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

module.exports = emailTemplates;
