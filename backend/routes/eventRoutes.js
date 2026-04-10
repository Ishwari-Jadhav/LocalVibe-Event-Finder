const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const auth = require("../middleware/auth");

// CREATE EVENT
router.post("/", auth, async (req, res) => {
  try {
    const newEvent = new Event({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price || 0,
      address: req.body.address,
      image: req.body.image,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      isFeatured: req.body.isFeatured || false,

      location: {
        type: "Point",
        coordinates: [
          req.body.lng, // longitude
          req.body.lat  // latitude
        ]
      },

      createdBy: req.user.id
    });

    await newEvent.save();
    res.json(newEvent);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET NEARBY EVENTS (WITH FILTERS)
router.get("/nearby", async (req, res) => {
  try {
    const { lng, lat, category, price, search } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (price === "free") filter.price = 0;
    if (price === "paid") filter.price = { $gt: 0 };

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const events = await Event.find(filter);

    res.json(events);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// MY EVENTS
router.get("/my-events", auth, async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// RSVP (FIXED VERSION)
router.post("/:id/rsvp", auth, async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // GOING
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

    // INTERESTED
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