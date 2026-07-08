const User = require("../models/User");

const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      profileImageURL: req.file ? req.file.path : null,
    });

    return res.status(201).json({
      message: "Account created",
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  const token = await User.matchPasswordAndGenerateToken(email, password);
  return res
    .cookie("token", token, { httpOnly: true ,sameSite:"none",secure: true,})
    .json({ message: "Signed in successfully" });
};

const logout = (req, res) => {
    res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  }).json({ message: "Logged out" });
};

const me = (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  return res.json({ user: req.user });
};

module.exports = { signup, signin, logout, me };
