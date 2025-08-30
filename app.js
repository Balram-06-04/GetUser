require("dotenv").config();  // Load env vars from .env (only needed for local dev)

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const User = require("./userModel");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Set the timeout to 5 seconds
  socketTimeoutMS: 45000 // Increase the timeout to 45 seconds for network operations
})
.then(() => console.log('MongoDB Atlas connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Serve HTML form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route to add user
app.post("/submit", async (req, res) => {
  try {
    const { name, age, city } = req.body;
    const newUser = new User({ name, age, city });
    await newUser.save();
    res.status(200).send("✅ User saved successfully!");
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).send("Error saving user: " + error.message);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
