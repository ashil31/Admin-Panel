const express = require("express");
const router = express.Router();
const passport = require("passport");

const controller = require("../controllers/adminController");
const auth = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");

const {
  validateLogin,
  validateRegister,
  validateRewardUpdate,
} = require("../utils/validators");

// @route   POST /api/admin/register
// @desc    Register admin via email/password
router.post("/register", validate(validateRegister), controller.register);

// @route   POST /api/admin/login
// @desc    Login admin via email/password
router.post("/login", validate(validateLogin), controller.login);

// @route   GET /api/admin/auth/google
// @desc    Initiate Google OAuth
router.get('/auth/google',
  passport.authenticate('google', { scope: ['openid','profile','email'] })
);


// @route   GET /api/admin/auth/google/callback
// @desc    Google OAuth callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  controller.googleCallback
);

// @route   GET /api/admin/users
// @desc    Get all registered users (protected)
router.get("/users", auth, controller.getUsers);
router.get("/users/rewarded", auth, controller.getRewardedUsers);

router.get("/users/count", auth, controller.totalUser);
router.get("/users/monthly-users", controller.getMonthlyUserStats);

// @route   PATCH /api/admin/users/:id/reward
// @desc    Update reward status (protected)
router.patch("/users/:id/reward", auth, validate(validateRewardUpdate), controller.updateRewardStatus);

module.exports = router;
