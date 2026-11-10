const mongoose = require('mongoose');

// Entite 3 : Rendez-vous. Relations 1 -> N avec "ref" :
//   un Service a plusieurs Rendez-vous, un User (client) a plusieurs Rendez-vous
const appointmentSchema = new mongoose.Schema({
  client:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: String, required: true }, // format AAAA-MM-JJ
  time: { type: String, required: true }, // format HH:MM
  note: { type: String, trim: true, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
