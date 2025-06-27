const JWT = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "invalid token" });
    }
  } else {
    return res.status(401).json({ message: "no token provided" });
  }
}

function verifyToknAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "you have not any access at this user" });
    }
  });
}

function verifyToknAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
  if (req.user.isAdmin) {
        next();
    } else {
      return res.status(403).json({ message: "you cannot get users, just admin can" });
    }
  });
}

module.exports = {
  verifyToken,
  verifyToknAndAuthorization,
  verifyToknAndAdmin,
};
