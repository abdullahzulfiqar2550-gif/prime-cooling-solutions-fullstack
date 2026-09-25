import nodemailer from 'nodemailer';
import { config } from '../config.js';
import { Booking, Contact } from '../types/index.js';

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpPort === 465,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPassword,
  },
});

export const sendEmail = async (to: string, subject: string, body: string): Promise<void> => {
  if (!config.smtpHost || !config.smtpUser) {
    console.log(`[Email stub] To: ${to} | Subject: ${subject} | Body: ${body}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: `"${config.smtpFromName}" <${config.smtpFromEmail}>`,
      to,
      subject,
      html: body,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendBookingConfirmation = async (booking: Booking): Promise<void> => {
  const subject = `Booking Confirmation - ${booking.booking_id}`;
  const body = `<p>Dear ${booking.customer_name},</p><p>Your booking (${booking.booking_id}) has been received successfully.</p>`;
  await sendEmail(config.adminEmail, subject, body);
};

export const sendBookingStatusUpdate = async (booking: Booking, oldStatus: string, newStatus: string): Promise<void> => {
  const subject = `Booking Status Update - ${booking.booking_id}`;
  const body = `<p>Your booking status has changed from ${oldStatus} to ${newStatus}.</p>`;
  await sendEmail(config.adminEmail, subject, body);
};

export const sendNewContactNotification = async (contact: Contact): Promise<void> => {
  const subject = `New Contact Form Submission - ${contact.name}`;
  const body = `<p>Name: ${contact.name}</p><p>Email: ${contact.email}</p><p>Message: ${contact.message}</p>`;
  await sendEmail(config.adminEmail, subject, body);
};
