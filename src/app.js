const express = require("express");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth.routes");

dotenv.config();

const app = express();

app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

module.exports = app;