const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const Event = require("../models/Event"); 
const auth = require("../middleware/auth");

router.post("/", auth, eventController.createEvent);
router.get("/", eventController.getEvents);

router.get("/nearby", eventController.getNearbyEvents);

router.get("/my-events", auth, eventController.getMyEvents);

router.post("/:id/rsvp", async (req, res) => {
  const { type } = req.body;

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (type === "going") event.going += 1;
    if (type === "interested") event.interested += 1;

    await event.save();

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;