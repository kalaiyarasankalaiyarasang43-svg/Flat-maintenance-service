const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });
  
  const tokenParts = token.split(' ');
  const tokenString = tokenParts.length === 2 ? tokenParts[1] : token;

  jwt.verify(tokenString, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    req.user = decoded;
    next();
  });
};

const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Requires role: ' + roles.join(', ') });
    }
    next();
  };
};

module.exports = { verifyToken, verifyRole };
