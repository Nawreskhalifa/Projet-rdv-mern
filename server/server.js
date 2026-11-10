const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globaux : CORS (autorise le front Vercel) + lecture du JSON
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// Routes
app.get('/', (req, res) => res.json({ message: 'API Rendez-vous en ligne' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/appointments', require('./routes/appointments'));

// Connexion a MongoDB Atlas, puis demarrage du serveur
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('Variables MONGODB_URI et JWT_SECRET obligatoires (fichier .env).');
  process.exit(1);
}
const uri = process.env.MONGODB_URI.trim(); // enlève espaces et retours à la ligne cachés
try {
  const u = new URL(uri);
  console.log('Utilisateur :', u.username, '| Hote :', u.hostname, '| Longueur mot de passe :', u.password.length);
} catch (e) {
  console.log('URI illisible : verifiez le format');
}
mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connecte');
    app.listen(PORT, () => console.log(`API en ecoute sur http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Connexion MongoDB impossible :', err.message);
    process.exit(1);
  });
