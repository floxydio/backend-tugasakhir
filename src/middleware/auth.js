const jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
  // Get the token from the request header
  const token = req.header("x-access-token");

  // Check if the token exists
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, "dev_token");

    // Add the decoded user object to the request object
    req.user = decoded.user;

    // Move to the next middleware or route handler
    next();
  } catch (err) {
    // Handle token verification errors
    res.status(401).json({ message: "Invalid token." });
  }
}

module.exports = authMiddleware;
