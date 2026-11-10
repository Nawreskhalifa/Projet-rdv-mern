import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { addAppointment } from '../redux/appointmentSlice';

export default function AppointmentForm({ services }) {
  const today = new Date().toISOString().slice(0, 10);
  const [service, setService] = useState('');
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('09:00');
  const [note, setNote] = useState('');
  const [feedback, setFeedback] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    setErrorMsg('');
    try {
      // Le token JWT est ajoute par l'intercepteur Axios
      const response = await axiosClient.post('/appointments', { service, date, time, note });
      dispatch(addAppointment(response.data));
      setNote('');
      setFeedback('Rendez-vous réservé.');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Réservation impossible.');
    }
  };

  return (
    <div className="card">
      <h2>Réserver un rendez-vous</h2>
      <p className="muted">Connecté en tant que <strong>{user.name}</strong></p>
      {feedback && <div className="alert success">{feedback}</div>}
      {errorMsg && <div className="alert error">{errorMsg}</div>}
      <form onSubmit={handleSubmit}>
        <label>Service
          <select value={service} onChange={(e) => setService(e.target.value)} required>
            <option value="">Choisir un service</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>{s.name} - {s.duration} min - {s.price} DT</option>
            ))}
          </select>
        </label>
        <div className="row">
          <label>Date
            <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} required />
          </label>
          <label>Heure
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </label>
        </div>
        <label>Remarque (facultatif)
          <textarea rows="2" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <button className="btn">Réserver</button>
      </form>
    </div>
  );
}
