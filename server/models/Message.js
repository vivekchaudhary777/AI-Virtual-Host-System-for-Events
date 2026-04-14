const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // Can be ObjectId or 'ai_host'
  receiver: { type: String, required: true }, // Can be ObjectId or 'all_attendees'
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  content: { type: String, required: true },
  isAnnouncement: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
