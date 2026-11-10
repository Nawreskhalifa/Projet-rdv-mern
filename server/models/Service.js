const mongoose = require('mongoose');

// Entite 2 : Service propose (consultation, coupe, soin...)
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  duration: { type: Number, required: true }, // en minutes
  price: { type: Number, required: true }     // en DT
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
