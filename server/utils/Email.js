const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  //host: 'smtp.cdac.in', 
  host: 'smtp.gmail.com', 
  port: 587, // Change to 587 for TLS
  secure: false, // TLS requires secure to be false
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // Keep this for now, but consider removing in production
  }
});

// Add a connection test function
const testConnection = async () => {
  try {
    await transporter.verify();
    console.log('SMTP connection successful');
  } catch (error) {
    console.error('SMTP connection failed:', error);
  }
};

const sendWelcomeEmail = async (email, username) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Your App!',
      text: `Hello ${username},\n\nWelcome to Your App! We're excited to have you on board.\n\nBest regards,\nYour App Team`,
      html: `<p>Hello ${username},</p><p>Welcome to Your App! We're excited to have you on board.</p><p>Best regards,<br>Your App Team</p>`
    });
    console.log('Welcome email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      response: error.response,
      responseCode: error.responseCode,
      command: error.command
    });
    throw error;
  }
};

// Export the test function along with sendWelcomeEmail
module.exports = { sendWelcomeEmail, testConnection };