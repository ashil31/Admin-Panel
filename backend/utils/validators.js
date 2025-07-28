const { body } = require("express-validator");

exports.validateRegister = [
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
];

exports.validateLogin = [
  body("email").isEmail(),
  body("password").notEmpty(),
];

exports.validateRewardUpdate = [
  body("rewardSent").isIn(["YES", "NO"]),
];
