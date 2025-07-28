const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String, // optional for Google users
  name: String,
  role: {
    type: String,
    enum: ["admin"],
    default: "admin",
  },
  picture: String,
});

module.exports = mongoose.model("Admin", adminSchema);