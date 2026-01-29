import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error);
    return false;
  }
};

export const sendAppointmentConfirmation = async (email, appointmentData) => {
  const html = `
    <h2>Appointment Confirmed</h2>
    <p>Your appointment has been confirmed</p>
    <p><strong>Date:</strong> ${appointmentData.date}</p>
    <p><strong>Time:</strong> ${appointmentData.time}</p>
    <p><strong>Doctor:</strong> ${appointmentData.doctorName}</p>
  `;

  return sendEmail(email, 'Appointment Confirmation', html);
};
