const jwt = require("jsonwebtoken");
const { pool } = require("../config/mysqldatabase");

const checkAPIKey = (req, res, next) => {
  const { APIKey } = req.query;
  if (APIKey) {
    if (APIKey === "ABC123") {
      next();
    } else {
      return res.status(400).json({ message: "Invalid API Key" });
    }
  } else {
    return res.status(400).json({ message: "Missing API Key" });
  }
};

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json("Token not provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.data;
    next();
  } catch (err) {
    res.status(401).json("Invalid or expired token");
  }
};

module.exports = { checkAPIKey, verifyToken };
