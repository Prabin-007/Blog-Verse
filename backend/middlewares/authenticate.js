const { validateToken } = require("../services/tokenService");

// Attaches req.user if token is valid — used globally
const attachUser = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return next();
  try {
    req.user = validateToken(token);
  } catch (_) {
    // invalid/expired token — just ignore, req.user stays undefined
  }
  return next();
};

// Hard guard — call this on routes that require login
const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Login required" });
  return next();
};

// Hard guard — call this on routes that require ADMIN role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN")
    return res.status(403).json({ error: "Admins only" });
  return next();
};

module.exports = { attachUser, requireAuth, requireAdmin };
