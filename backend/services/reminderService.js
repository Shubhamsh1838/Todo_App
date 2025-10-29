const cron = require('node-cron');
const Task = require('../models/Task');
const emailService = require('./emailService');

class ReminderService {
  constructor() {
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      console.log('Reminder service already running');
      return;
    }

    const schedule = process.env.NODE_ENV === 'production' ? '* * * * *' : '*/5 * * * *';
    
    cron.schedule(schedule, async () => {
      try {
        await this.checkDueTasks();
      } catch (error) {
        console.error('Error in reminder service:', error);
      }
    });

    this.isRunning = true;
    console.log(`Reminder service started - checking for due tasks (${schedule})`);
  }

  async checkDueTasks() {
    const now = new Date();
    const reminderWindow = new Date(now.getTime() + 30 * 60 * 1000);

    try {
      const tasks = await Task.find({
        dueDate: {
          $lte: reminderWindow,
          $gt: now
        },
        completed: false,
        reminderSent: false
      }).populate('user');

      if (tasks.length > 0) {
        console.log(`Found ${tasks.length} tasks due soon`);
      }

      const results = await Promise.allSettled(
        tasks.map(task => this.processTaskReminder(task))
      );

      const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      if (successful > 0 || failed > 0) {
        console.log(`Reminder processing: ${successful} successful, ${failed} failed`);
      }

    } catch (error) {
      console.error('Error finding due tasks:', error);
    }
  }

  async processTaskReminder(task) {
    try {
      console.log(`Processing reminder for task: "${task.title}"`);
      
      const emailSent = await emailService.sendReminderEmail(task.user, task);
      
      if (emailSent) {
        task.reminderSent = true;
        await task.save();
        console.log(`Reminder sent and marked for task: "${task.title}"`);
        return true;
      } else {
        console.log(`Failed to send email for task: "${task.title}"`);
        return false;
      }
    } catch (error) {
      console.error(`Failed to process reminder for task "${task.title}":`, error);
      return false;
    }
  }

  stop() {
    this.isRunning = false;
    console.log('Reminder service stopped');
  }
}

module.exports = new ReminderService();
