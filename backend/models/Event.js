const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: String,
  price: Number,
  image: String,

  startDate: Date,
  endDate: Date,

  address: String,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },

  isFeatured: {
    type: Boolean,
    default: false
  },
  going: [
  {
    type: require("mongoose").Schema.Types.ObjectId,
    ref: "User"
  }
 ],
  interested: [
  {
    type: require("mongoose").Schema.Types.ObjectId,
    ref: "User"
  }
 ],
}, { timestamps: true });

// IMPORTANT: GEO INDEX
eventSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Event", eventSchema);