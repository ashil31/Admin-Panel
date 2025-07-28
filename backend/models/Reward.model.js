const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  qrCode: { type: mongoose.Schema.Types.ObjectId, ref: "QrCode" },
  amount: Number,
  rewardSent: {
    type: String,
    enum: ["YES", "NO"],
    default: "NO"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Reward", rewardSchema);