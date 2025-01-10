const AppError = require('../utils/AppError');
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// user = { userName, email, uid }
const createJWT = (user) => {
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1d" });
  return token;
};

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.loginToken;
    if (!token) throw new AppError(`token missing`, 400);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        next(new AppError(`invalid or expired token`, 400));
    }
};

module.exports = { createJWT, authenticateJWT };