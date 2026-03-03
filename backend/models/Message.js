const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  },
  sender: String,
  text: String
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);