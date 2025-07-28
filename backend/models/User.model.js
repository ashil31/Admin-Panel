const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    pumpSerialNumber: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "bank"],
      required: true,
    },
    upiId: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    ifsc: {
      type: String,
    },
    beneficiaryName: {
      type: String,
    },
    used: {
      type: Boolean,
      default: false,
    },
    qrSerialNumber: {
      type: String,
      required: true,
    },
    rewardSent: {
      type: String,
      enum: ["YES", "NO"],
      default: "NO"
    }
  },{
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
