const Admin = require("../models/Admin.model");
const User = require("../models/User.model");
const Reward = require("../models/Reward.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const { emitNewUser, emitRewardUpdate } = require("../socket/socketHandler");

exports.register = async (req, res) => {
  const { email, password, name } = req.body;
  const exists = await Admin.findOne({ email });
  if (exists) return res.status(400).json({ message: "Admin already exists" });

  const hash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ email, password: hash, name });
  const token = generateToken(admin);
  res.json({ token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = generateToken(admin);
  res.json({ token });
};

// Google callback
exports.googleCallback = async (req, res) => {
  try {
    console.log("Google callback successful, user:", req.user);
    const token = generateToken(req.user);
    console.log("Generated JWT token:", token);
    res.redirect(`https://admin-panel-1-gjrv.onrender.com/oauth-callback?token=${token}`);
  } catch (error) {
    console.error("Error generating token or redirecting:", error);
    res.redirect("/register");
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const query = { rewardSent: { $ne: "YES" } };

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ users, totalPages });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.getRewardedUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const rewards = await Reward.find({ rewardSent: "YES" })
      .populate("user") // gets full user object
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(await Reward.countDocuments({ rewardSent: "YES" }) / limit);

    res.status(200).json({ rewards, totalPages });
  } catch (err) {
    console.error("Error fetching rewarded users:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.totalUser = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to get user count" });
  }
};

// controllers/stats.controller.ts or similar
exports.getMonthlyUserStats = async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

    // Convert result to full 12 months
    const monthlyCounts = Array(12).fill(0);
    data.forEach((item) => {
      monthlyCounts[item._id - 1] = item.count;
    });

    res.status(200).json({ monthlyUserCounts: monthlyCounts });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err });
  }
};


// Update reward status
// backend/controllers/adminController.js


exports.updateRewardStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { rewardSent, amount } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { rewardSent },
      { new: true }
    );

    // Save reward in Reward model
    const reward = new Reward({
      user: id,
      amount,
      rewardSent,
    });
    await reward.save();

    emitRewardUpdate(user);

    res.status(200).json({
      message: "Reward status updated",
      user,
      reward,
    });
  } catch (err) {
    console.error("Update reward error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.submitUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    // ✅ Emit event to frontend
    emitNewUser(user);

    res.status(201).json({
      message: "User submitted successfully",
      user,
    });
  } catch (err) {
    console.error("Error submitting user:", err);
    res.status(500).json({ error: "Server error" });
  }
};