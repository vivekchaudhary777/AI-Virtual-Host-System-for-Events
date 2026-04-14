const mongoose = require('mongoose');

const hostScriptSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  agenda: [{
    elapsedTime: { type: Number, required: true }, // in seconds from start
    message: { type: String, required: true },
    action: { type: String, enum: ['none', 'wave', 'greet', 'point', 'shout'], default: 'none' },
    isTriggered: { type: Boolean, default: false }
  }]
});

const HostScript = mongoose.model('HostScript', hostScriptSchema);

module.exports = HostScript;
