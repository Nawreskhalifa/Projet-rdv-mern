const jwt = require('jsonwebtoken');

// Middleware sentinelle : controle le header  Authorization: Bearer <token>
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acces refuse : token JWT manquant.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, name, email, role }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Acces refuse : token invalide ou expire.' });
  }
};

// Reserve une route aux administrateurs (a utiliser APRES protect)
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Action reservee a l administrateur.' });
  }
  next();
};

module.exports = { protect, adminOnly };
