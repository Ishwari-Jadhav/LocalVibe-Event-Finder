const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// TOGGLE FAVORITE
router.post("/favorite/:eventId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const eventId = req.params.eventId;

    const isFav = user.favorites.some(
      (id) => id.toString() === eventId
    );

    if (isFav) {
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== eventId
      );
    } else {
      user.favorites.push(eventId);
    }

    await user.save();
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET FAVORITES
router.get("/favorites", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;