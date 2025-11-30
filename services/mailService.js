import nodemailer from 'nodemailer';
import 'dotenv/config';

const config = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const transporter = nodemailer.createTransport(config);

const emailOptions = {
  from: 'maxikrud0071@ukr.net',
  to: 'maxikrud0071@gmail.com',
  subject: 'Nodemailer test',
  text: 'Привіт. Ми тестуємо надсилання листів!',
};

// Test email sending
// transporter
//   .sendMail(emailOptions)
//   .then(info => console.log(info))
//   .catch(err => console.error(err));
