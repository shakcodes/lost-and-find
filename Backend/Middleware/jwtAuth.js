import jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next) => {
  // Check both cookies and Authorization header
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return res.status(401).json({ 
      message: 'Invalid or expired token',
      ...(process.env.NODE_ENV === 'development' && { debug: error.message })
    });
  }
};

export default jwtAuth;