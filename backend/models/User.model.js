const mongoose = require("mongoose");
const userSchema = require("../../../Reward_Project/backend/models/User.model").schema;
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
