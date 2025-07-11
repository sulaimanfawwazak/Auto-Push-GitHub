import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config({ path: './.env' });

export async function sendEmail({ subject, text }) {
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
    text,
  };

  await transporter.sendMail(mailOptions);
}