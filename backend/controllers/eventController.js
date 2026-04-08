const Event = require("../models/Event");

// CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      createdBy: req.user.id 
    });

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL EVENTS
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY EVENTS
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FIND NEARBY EVENTS (MAIN FEATURE)
exports.getNearbyEvents = async (req, res) => {
  try {
    const { lng, lat, category, price, search } = req.query;

   let query = {
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: 50000
      }
    }
  };

    // CATEGORY FILTER
    if (category) {
      query.category = category;
    }

    // SEARCH FILTER
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    // PRICE FILTER
    if (price === "free") {
      query.price = 0;
    }

    if (price === "paid") {
      query.price = { $gt: 0 };
    }

    const events = await Event.find(query);

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};