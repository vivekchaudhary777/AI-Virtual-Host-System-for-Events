const express = require("express");
const Ticket = require("../models/Ticket");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/buy", protect, async (req, res) => {
  try {
    const { eventId, price } = req.body;

    const ticket = await Ticket.create({
      event: eventId,
      user: req.user._id,
      price
    });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;