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

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});