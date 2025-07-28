const express = require("express");
const passport = require("passport");
const session = require("express-session");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();
require("./config/passport");

const app = express();

const cors = require("cors");
const allowedOrigins = [
  'https://admin-panel-1-gjrv.onrender.com', // your live frontend
  'http://localhost:5173', // local dev frontend
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }, // 👈 Your frontend origin, not '*'
    credentials: true, // 🔥 THIS IS REQUIRED for cookies to work
  })
);


app.use(express.json());
app.use(passport.initialize());

app.use("/api/admin", adminRoutes);

module.exports = app;
