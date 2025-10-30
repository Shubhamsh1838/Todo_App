const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.useRealEmails = process.env.NODE_ENV === 'production';
    
    if (this.useRealEmails) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SENDGRID_API_KEY,
        },
      });
      console.log('SendGrid email service configured');
    } else {
      console.log('Using console email logging for development');
    }
  }

  async sendEmail(to, subject, text, html = null) {
    try {
      if (!to || !subject || !text) {
        console.error('Missing required email parameters');
        return false;
      }

      if (this.useRealEmails && this.transporter) {
        const mailOptions = {
          from: process.env.EMAIL_FROM || 'noreply@todoapp.com',
          to,
          subject,
          text,
          html: html || text,
          headers: {
            'Priority': 'High',
            'X-Priority': '1',
          }
        };

        const result = await this.transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}, Message ID: ${result.messageId}`);
        return true;
      } else {
        console.log('\n=== EMAIL REMINDER (DEMO) ===');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${text}`);
        console.log('=============================\n');
        return true;
      }
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendReminderEmail(user, task) {
    const dueDate = new Date(task.dueDate).toLocaleString();
    
    const subject = `Reminder: Task "${task.title}" is due soon`;
    const text = `
Hello ${user.name},

This is a reminder that your task "${task.title}" is due at ${dueDate}.

${task.description ? `Description: ${task.description}` : ''}

Please complete your task on time.

Best regards,
Todo App Team
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .task-title { font-size: 18px; font-weight: bold; color: #4F46E5; }
        .due-date { color: #DC2626; font-weight: bold; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Task Reminder</h1>
        </div>
        <div class="content">
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>This is a reminder that your task "<span class="task-title">${task.title}</span>" is due on <span class="due-date">${dueDate}</span>.</p>
            ${task.description ? `<p><strong>Description:</strong> ${task.description}</p>` : ''}
            <p>Please complete your task on time.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br><strong>Todo App Team</strong></p>
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
    `;

    return await this.sendEmail(user.email, subject, text, html);
  }
}

module.exports = new EmailService();
