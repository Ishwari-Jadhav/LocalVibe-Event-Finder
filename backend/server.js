const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/auth");

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("LocalVibe API running 🚀");
});

// ✅ CLEAN CONNECTION
const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected ✅");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("MongoDB Error ❌:", err);
  }
};

startServer();