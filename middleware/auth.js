const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Extract token from Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token format is invalid.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded payload to req.user for downstream use
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid.' });
  }
};
