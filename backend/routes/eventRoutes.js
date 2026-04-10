const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const Event = require("../models/Event"); 
const auth = require("../middleware/auth");

router.post("/", auth, eventController.createEvent);
router.get("/", eventController.getEvents);

router.get("/nearby", eventController.getNearbyEvents);

router.get("/my-events", auth, eventController.getMyEvents);

router.post("/:id/rsvp", auth, async (req, res) => {
  const { type } = req.body;
  const userId = req.user.id;

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Ensure arrays exist
    if (!event.going) event.going = [];
    if (!event.interested) event.interested = [];

    // GOING
    if (type === "going") {
      if (event.going.includes(userId)) {
        event.going = event.going.filter(
          (id) => id.toString() !== userId
        );
      } else {
        event.going.push(userId);

        // remove from interested if exists
        event.interested = event.interested.filter(
          (id) => id.toString() !== userId
        );
      }
    }

    // INTERESTED
    if (type === "interested") {
      if (event.interested.includes(userId)) {
        event.interested = event.interested.filter(
          (id) => id.toString() !== userId
        );
      } else {
        event.interested.push(userId);

        // remove from going if exists
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