const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  date: { type: Date, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, default: 0 },
  totalTickets: { type: Number, default: 100 },
  ticketsSold: { type: Number, default: 0 },
  category: { type: String, default: 'General' },
  location: { type: String, default: 'Virtual' },
  imageUrl: { type: String, default: '' },
  hiddenInfo: { type: String, default: '' },
  hiddenPhotos: [{ type: String }],
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
