const express = require("express");
const Event = require("../models/Event");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// GET EVENTS (Logged in users only)
router.get("/", protect, async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// CREATE EVENT (Admin only)
router.post("/", protect, adminOnly, async (req, res) => {
  const event = await Event.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.json(event);
});

// DELETE EVENT (Admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

const Analytics = require("../models/Analytics");

router.get("/:id", protect, async (req, res) => {
  const event = await Event.findById(req.params.id);

  await Analytics.create({
    eventId: event._id,
    userId: req.user._id,
    action: "view"
  });

  res.json(event);
});

module.exports = router;