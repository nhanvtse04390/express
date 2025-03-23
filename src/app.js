const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"], allowedHeaders: ["Content-Type", "Authorization"] }));
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

// Routes
app.use("/api/users", require("./routes/user"));
app.use("/api/login", require("./routes/login"));
app.use("/api/register", require("./routes/register"));
app.use("/api/product", require("./routes/product"))

// Home route
app.get("/", (req, res) => {
  console.log('process.env.MONGO_URI',process.env.MONGO_URI)
  res.send("🚀 Express Server is Running!");
});

module.exports = app;