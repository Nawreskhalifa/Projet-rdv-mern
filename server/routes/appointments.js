const express = require('express');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const { protect } = require('../middleware/protect');

const router = express.Router();

// .populate() remplace les ObjectId par les vrais documents lies
const withRelations = (query) =>
  query.populate('client', 'name').populate('service', 'name duration price');

// GET /api/appointments : PUBLIC (lecture seule pour les visiteurs)
router.get('/', async (req, res) => {
  const filter = req.query.service ? { service: req.query.service } : {};
  const appointments = await withRelations(Appointment.find(filter).sort({ date: 1, time: 1 }));
  res.status(200).json(appointments);
});

// POST /api/appointments : PROTEGE (le client vient du token, pas du body)
router.post('/', protect, async (req, res) => {
  try {
    const { service, date, time, note } = req.body;
    if (!service || !date || !time) {
      return res.status(400).json({ message: 'Service, date et heure obligatoires.' });
    }
    if (date < new Date().toISOString().slice(0, 10)) {
      return res.status(400).json({ message: 'La date doit etre aujourd hui ou plus tard.' });
    }
    if (!(await Service.findById(service))) {
      return res.status(404).json({ message: 'Service introuvable.' });
    }
    // Creneau deja pris pour ce service ?
    if (await Appointment.findOne({ service, date, time })) {
      return res.status(409).json({ message: 'Ce creneau est deja reserve. Choisissez une autre heure.' });
    }

    const created = await Appointment.create({ client: req.user.id, service, date, time, note });
    const appointment = await withRelations(Appointment.findById(created._id));
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: 'Donnees invalides.' });
  }
});

// DELETE /api/appointments/:id : PROTEGE (proprietaire ou Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Rendez-vous introuvable.' });

    const isOwner = appointment.client.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Vous ne pouvez annuler que vos rendez-vous.' });
    }
    await appointment.deleteOne();
    res.status(200).json({ message: 'Rendez-vous annule.', id: appointment._id });
  } catch (err) {
    res.status(400).json({ message: 'Identifiant invalide.' });
  }
});

module.exports = router;
