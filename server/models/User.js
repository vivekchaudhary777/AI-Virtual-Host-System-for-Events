// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  purchasedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  interests: [{ type: String }],
  skills: [{ type: String }],
  // Add additional fields as needed for your application
});

const User = mongoose.model('User', userSchema);

module.exports = User;
