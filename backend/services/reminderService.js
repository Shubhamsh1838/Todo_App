const cron = require('node-cron');
const Task = require('../models/Task');
const emailService = require('./emailService');

class ReminderService {
  start() {
    cron.schedule('* * * * *', async () => {
      try {
        await this.checkDueTasks();
      } catch (error) {
        console.error('Error in reminder service:', error);
      }
    });

    console.log('Reminder service started - checking for due tasks every minute');
  }

  async checkDueTasks() {
    const now = new Date();
    const reminderTime = new Date(now.getTime() + 30 * 60 * 1000);

    try {
      const tasks = await Task.find({
        dueDate: {
          $lte: reminderTime,
          $gt: now
        },
        completed: false,
        reminderSent: false
      }).populate('user');

      if (tasks.length > 0) {
        console.log(`Found ${tasks.length} tasks due soon`);
      }

      for (const task of tasks) {
        try {
          console.log(`Processing reminder for task: "${task.title}"`);
          const emailSent = await emailService.sendReminderEmail(task.user, task);
          
          if (emailSent) {
            task.reminderSent = true;
            await task.save();
            console.log(`Reminder sent and marked for task: "${task.title}"`);
          }
        } catch (error) {
          console.error(`Failed to process reminder for task "${task.title}":`, error);
        }
      }
    } catch (error) {
      console.error('Error finding due tasks:', error);
    }
  }
}

module.exports = new ReminderService();
