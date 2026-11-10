import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axiosClient from './api/axiosClient';
import Navbar from './components/Navbar';
import AuthCard from './components/AuthCard';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';

export default function App() {
  const { user } = useSelector((state) => state.auth);
  const [services, setServices] = useState([]);

  // Les services sont charges une fois, puis passes aux composants enfants (props)
  useEffect(() => {
    axiosClient.get('/services').then((res) => setServices(res.data)).catch(() => {});
  }, []);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="container layout">
        <aside>
          {/* Rendu conditionnel : visiteur -> connexion, connecte -> formulaire */}
          {user ? <AppointmentForm services={services} /> : <AuthCard />}
        </aside>
        <section>
          <AppointmentList services={services} />
        </section>
      </main>
      <footer className="footer">École Polytechnique de Sousse - Projet MERN 2025-2026</footer>
    </div>
  );
}
