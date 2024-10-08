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

const sendVerificationEmail = async (email, username, token) => {
    const verificationLink = `${process.env.CLIENT_URL}/verify/${token}`;
    try {
      const info = await transporter.sendMail({
        from: `"Mern-Auth" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email',
        text: `Hello ${username},\n\nPlease verify your email by clicking on the following link: ${process.env.CLIENT_URL}/verify/${token}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nMern-Auth Team`,
        html: `<p>Hello ${username},</p><p>Please verify your email by clicking on the following link: <a href="${process.env.CLIENT_URL}/verify/${token}">Verify Email</a></p><p>If you did not request this, please ignore this email.</p><p>Best regards,<br>Mern-Auth Team</p>`
      });
      console.log('Verification email sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  };

const sendWelcomeEmail = async (email, username) => {
  try {
    const info = await transporter.sendMail({
      from: `"Mern-Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Mern-Auth!',
      text: `Hello ${username},\n\nWelcome to Mern-Auth! We're excited to have you on board.\n\nBest regards,\nMern-Auth Team`,
      html: `<p>Hello ${username},</p><p>Welcome to Mern-Auth! We're excited to have you on board.</p><p>Best regards,<br>Mern-Auth Team</p>`
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
module.exports = { sendWelcomeEmail, sendVerificationEmail, testConnection };