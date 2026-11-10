const mongoose = require('mongoose');

// Entite 1 : Utilisateur (le mot de passe est stocke HACHE, jamais en clair)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Client', 'Admin'], default: 'Client' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
