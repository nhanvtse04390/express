const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

// Routes
// app.use("/api/users", require("./routes/userRoutes"));

// Home route
app.get("/", (req, res) => {
  res.send("🚀 Express Server is Running!");
});

module.exports = app;