const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const Analytics = require("../models/Analytics");

const router = express.Router();

router.get("/", protect, adminOnly, async (req, res) => {
  const stats = await Analytics.aggregate([
    {
      $group: {
        _id: "$action",
        count: { $sum: 1 }
      }
    }
  ]);

  res.json(stats);
});

module.exports = router;