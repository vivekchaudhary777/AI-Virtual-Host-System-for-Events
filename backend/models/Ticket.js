const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  price: Number,
  paymentStatus: { type: String, default: "completed" }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", TicketSchema);