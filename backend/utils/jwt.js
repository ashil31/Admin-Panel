const jwt = require("jsonwebtoken");

exports.generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      name: admin.name,
      picture: admin.picture, // ✅ include this
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};