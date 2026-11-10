import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { setAppointments, setLoading, setError } from '../redux/appointmentSlice';
import AppointmentCard from './AppointmentCard';

export default function AppointmentList({ services }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.appointments);
  const [serviceFilter, setServiceFilter] = useState('');

  const charger = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosClient.get('/appointments', {
        params: serviceFilter ? { service: serviceFilter } : {}
      });
      dispatch(setAppointments(response.data));
    } catch (err) {
      dispatch(setError('Le serveur est injoignable. Réessayez dans un instant.'));
    }
  };

  // Recharge a l'ouverture et a chaque changement du filtre
  useEffect(() => { charger(); }, [serviceFilter]);

  return (
    <div>
      <div className="list-head">
        <h2>Planning des rendez-vous</h2>
        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} aria-label="Filtrer par service">
          <option value="">Tous les services</option>
          {services.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>

      {error && <div className="alert error">{error} <button className="link" onClick={charger}>Réessayer</button></div>}
      {loading && <p className="muted">Chargement du planning...</p>}
      {!loading && !error && items.length === 0 && (
        <p className="empty">Aucun rendez-vous pour le moment. Connectez-vous pour réserver le premier créneau.</p>
      )}
      <div className="grid">
        {items.map((a) => <AppointmentCard key={a._id} appointment={a} />)}
      </div>
    </div>
  );
}
