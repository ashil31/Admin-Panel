const express = require("express");
const passport = require("passport");
const session = require("express-session");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();
require("./config/passport");

const app = express();

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // 👈 Your frontend origin, not '*'
    credentials: true, // 🔥 THIS IS REQUIRED for cookies to work
  })
);


app.use(express.json());
app.use(passport.initialize());

app.use("/api/admin", adminRoutes);

module.exports = app;
