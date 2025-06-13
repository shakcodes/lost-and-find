// middleware/auth.js
import jwt from 'jsonwebtoken';

export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header (Bearer <token>)
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};