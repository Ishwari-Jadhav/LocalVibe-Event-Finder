const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

const eventRoutes = require("./routes/eventRoutes");

app.use("/api/events", eventRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("LocalVibe API running 🚀");
});

console.log("MONGO_URI:", process.env.MONGO_URI);

// MongoDB Connection
const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected ✅");

  } catch (err) {
    console.error("MongoDB Error ❌:", err);
  }
};

startServer();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});