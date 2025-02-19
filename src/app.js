const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
// app.use("/api/users", require("./routes/userRoutes"));

// Home route
app.get("/", (req, res) => {
  res.send("🚀 Express Server is Running!");
});

module.exports = app;