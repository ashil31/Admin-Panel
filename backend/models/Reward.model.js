const mongoose = require("mongoose");
const rewardSchema = require("../../../Reward_Project/backend/models/Reward.model").schema;
module.exports = mongoose.models.Reward || mongoose.model("Reward", rewardSchema);
