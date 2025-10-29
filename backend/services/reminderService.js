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

    console.log(`[${now.toISOString()}] Checking tasks due before: ${reminderWindow.toISOString()}`);

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
      } else {
        console.log('No tasks due for reminders at this time');
      }

      for (const task of tasks) {
        console.log(`Processing reminder for task: "${task.title}" for user: ${task.user.email}, due: ${task.dueDate}`);
        
        const emailSent = await emailService.sendReminderEmail(task.user, task);
        
        if (emailSent) {
          task.reminderSent = true;
          await task.save();
          console.log(`SUCCESS: Reminder sent for task: "${task.title}" to ${task.user.email}`);
        } else {
          console.log(`FAILED: Could not send email for task: "${task.title}"`);
        }
      }

      if (tasks.length > 0) {
        console.log(`Finished processing ${tasks.length} tasks`);
      }
    } catch (error) {
      console.error('Error finding due tasks:', error);
    }
  }

  stop() {
    this.isRunning = false;
    console.log('Reminder service stopped');
  }
}

module.exports = new ReminderService();
