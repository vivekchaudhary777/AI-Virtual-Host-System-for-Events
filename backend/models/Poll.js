const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
  eventId: mongoose.Schema.Types.ObjectId,
  question: String,
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 }
    }
  ]
});

module.exports = mongoose.model("Poll", PollSchema);