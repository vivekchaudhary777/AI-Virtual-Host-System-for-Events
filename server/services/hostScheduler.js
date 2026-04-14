const cron = require('node-cron');
const HostScript = require('../models/HostScript');
const Message = require('../models/Message');

const initHostScheduler = (io) => {
  // Check every 10 seconds for scheduled events
  cron.schedule('*/10 * * * * *', async () => {
    try {
      // Find all unsent agenda items
      const scripts = await HostScript.find({}).populate('eventId');
      
      for (const script of scripts) {
        const eventId = script.eventId._id;
        const eventStartTime = script.eventId.date; 
        const currentTime = new Date();
        const elapsedSeconds = Math.floor((currentTime - eventStartTime) / 1000);

        for (const step of script.agenda) {
          if (!step.isTriggered && elapsedSeconds >= step.elapsedTime) {
            // Trigger announcement
            const announcement = new Message({
              sender: 'ai_host',
              receiver: 'all_attendees', // Special flag or emit to event room
              eventId,
              content: step.message,
              isAnnouncement: true // New flag
            });
            await announcement.save();

            // Emit to event-wide room
            io.to(`event_${eventId}`).emit('host-speak', {
              message: step.message,
              action: step.action
            });

            // Mark as triggered
            step.isTriggered = true;
          }
        }
        await script.save();
      }
    } catch (error) {
      console.error('Host Scheduler Error:', error.message);
    }
  });
};

module.exports = { initHostScheduler };
