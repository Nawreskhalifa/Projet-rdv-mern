const express = require('express');
const Service = require('../models/Service');
const { protect, adminOnly } = require('../middleware/protect');

const router = express.Router();

// GET /api/services : public
router.get('/', async (req, res) => {
  const services = await Service.find().sort('name');
  res.status(200).json(services);
});

// POST /api/services : connecte + Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, duration, price } = req.body;
    if (!name || !duration || price === undefined) {
      return res.status(400).json({ message: 'Nom, duree et prix obligatoires.' });
    }
    const service = await Service.create({ name, duration, price });
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: 'Donnees invalides.' });
  }
});

// DELETE /api/services/:id : connecte + Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service introuvable.' });
    res.status(200).json({ message: 'Service supprime.', id: service._id });
  } catch (err) {
    res.status(400).json({ message: 'Identifiant invalide.' });
  }
});

module.exports = router;
