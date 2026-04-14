const mongoose = require('mongoose');
const HostScript = require('./models/HostScript');
require('dotenv').config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Replace with an ACTUAL eventId from your database
    const eventId = process.argv[2];
    if (!eventId) {
      console.error("Please provide an eventId: node server/seedHost.js <eventId>");
      process.exit(1);
    }

    const sampleAgenda = [
      { elapsedTime: 10, message: "Welcome everyone! I'm your virtual host. Excited to have you here!", action: 'greet' },
      { elapsedTime: 60, message: "We're just getting started. Feel free to ask me anything about the schedule!", action: 'point' },
      { elapsedTime: 300, message: "Midway through! Hope you're enjoying the sessions.", action: 'wave' }
    ];

    await HostScript.findOneAndUpdate(
      { eventId },
      { eventId, agenda: sampleAgenda },
      { upsert: true, new: true }
    );

    console.log("Sample Host Agenda seeded for event:", eventId);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
