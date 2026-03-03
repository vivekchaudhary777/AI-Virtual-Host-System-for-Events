const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  action: {
    type: String,
    enum: ["view", "chat", "poll", "ticket"]
  }
}, { timestamps: true });

module.exports = mongoose.model("Analytics", AnalyticsSchema);