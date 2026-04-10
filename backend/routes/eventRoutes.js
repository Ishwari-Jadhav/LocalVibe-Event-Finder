const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const auth = require("../middleware/auth");

// RSVP (GOING / INTERESTED)
router.post("/:id/rsvp", auth, async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // -------- GOING --------
    if (type === "going") {
      if (event.going.includes(userId)) {
        event.going = event.going.filter(
          (id) => id.toString() !== userId
        );
      } else {
        event.going.push(userId);

        event.interested = event.interested.filter(
          (id) => id.toString() !== userId
        );
      }
    }

    // -------- INTERESTED --------
    if (type === "interested") {
      if (event.interested.includes(userId)) {
        event.interested = event.interested.filter(
          (id) => id.toString() !== userId
        );
      } else {
        event.interested.push(userId);

        event.going = event.going.filter(
          (id) => id.toString() !== userId
        );
      }
    }

    await event.save();

    res.json({
      going: event.going.length,
      interested: event.interested.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;