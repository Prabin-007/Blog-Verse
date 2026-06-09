const JWT = require("jsonwebtoken");

const createTokenForUser = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  return JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const validateToken = (token) => {
  return JWT.verify(token, process.env.JWT_SECRET);
};

module.exports = { createTokenForUser, validateToken };
