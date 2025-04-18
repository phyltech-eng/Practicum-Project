const nodemailer = require('nodemailer');
const { logger } = require('../Utils/logger');

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to, subject, body) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: body
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent to ${to}: ${subject}`);
      return result;
    } catch (error) {
      logger.error('Email sending failed', error);
      throw error;
    }
  }

  async sendClubInvitation(user, club) {
    const invitationEmail = `
      <h1>Club Invitation</h1>
      <p>You've been invited to join ${club.name}</p>
      <a href="${process.env.FRONTEND_URL}/clubs/${club._id}/join">Accept Invitation</a>
    `;

    await this.sendEmail(
      user.email, 
      `Invitation to ${club.name}`, 
      invitationEmail
    );
  }

  async sendEventReminder(user, event) {
    const reminderEmail = `
      <h1>Event Reminder</h1>
      <p>Upcoming event: ${event.title}</p>
      <p>Date: ${event.date}</p>
      <a href="${process.env.FRONTEND_URL}/events/${event._id}">View Event Details</a>
    `;

    await this.sendEmail(
      user.email, 
      `Reminder: ${event.title}`, 
      reminderEmail
    );
  }
}

module.exports = new NotificationService();
