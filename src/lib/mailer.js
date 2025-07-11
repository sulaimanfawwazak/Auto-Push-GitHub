import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config({ path: './.env' });

/**
 * Send an email with plain text and/or HTML content
 * @param {Object} param0 
 * @param {string} param0.subject - Email subject
 * @param {string} [param0.text] - Plain text body (fallback)
 * @param {string} [param0.html] - HTML body (optional)
 */

export async function sendEmail({ subject, text, html }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: process.env.RECEIVER_EMAIL,
    subject,
    text: text || '', // fallback if HTML doesn't render
    html: html || '', // optional
  };

  await transporter.sendMail(mailOptions);
}