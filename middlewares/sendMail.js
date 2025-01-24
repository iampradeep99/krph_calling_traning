const nodemailer = require('nodemailer');

class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "csctrainingservices@gmail.com",
        pass: "uvqpwgjksktmjrng"
      }
    });
  }

  async sendMail(to, subject, text, html) {
    try {
      const mailOptions = {
        from: 'csctrainingservices@gmail.com',
        to: to,
        subject: subject,
        text: text,
        html: html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Email sending failed');
    }
  }
}

module.exports = Mailer;
