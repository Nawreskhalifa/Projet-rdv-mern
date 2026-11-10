// Remplit la base avec des services + 2 comptes de demo : npm run seed
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('./models/User');
const Service = require('./models/Service');
const Appointment = require('./models/Appointment');
Nawres12/*
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([User.deleteMany(), Service.deleteMany(), Appointment.deleteMany()]);

  await User.create([
    { name: 'Administrateur', email: 'admin@clinique.tn', password: await bcrypt.hash('admin123', 10), role: 'Admin' },
    { name: 'Aya Ben Amor', email: 'aya@clinique.tn', password: await bcrypt.hash('123456', 10) }
  ]);
  await Service.create([
    { name: 'Consultation generale', duration: 30, price: 40 },
    { name: 'Soin dentaire', duration: 45, price: 80 },
    { name: 'Coupe et brushing', duration: 40, price: 35 },
    { name: 'Soin du visage', duration: 60, price: 60 }
  ]);
  console.log('Base initialisee. Admin : admin@clinique.tn / admin123 | Client : aya@clinique.tn / 123456');
  await mongoose.disconnect();
})();
