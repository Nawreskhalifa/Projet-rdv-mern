const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Fabrique le token JWT (valable 24h) a partir des infos publiques de l'utilisateur
const makeAuthResponse = (user) => {
  const userInfo = { id: user._id, name: user.name, email: user.email, role: user.role };
  const token = jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: '24h' });
  return { user: userInfo, token };
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nom, email et mot de passe obligatoires.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Mot de passe : 6 caracteres minimum.' });
    }
    if (await User.findOne({ email: email.trim().toLowerCase() })) {
      return res.status(409).json({ message: 'Cet email est deja utilise.' });
    }

    const hashed = await bcrypt.hash(password, 10); // 10 = nombre de tours de salage
    const user = await User.create({ name, email, password: hashed }); // role = Client
    res.status(201).json(makeAuthResponse(user));
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').trim().toLowerCase() });
    // Meme message si l'email ou le mot de passe est faux (on ne revele rien)
    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }
    res.status(200).json(makeAuthResponse(user));
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
