import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { removeAppointment } from '../redux/appointmentSlice';

export default function AppointmentCard({ appointment }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { _id, client, service, date, time, note } = appointment;

  // Le bouton n'apparait que pour le proprietaire du rendez-vous ou l'Admin
  const canDelete = user && (user.role === 'Admin' || user.id === client?._id);

  const handleDelete = async () => {
    if (!window.confirm('Annuler ce rendez-vous ?')) return;
    try {
      await axiosClient.delete(`/appointments/${_id}`);
      dispatch(removeAppointment(_id));
    } catch (err) {
      alert(err.response?.data?.message || 'Annulation impossible.');
    }
  };

  return (
    <article className="slot">
      <div className="slot-time">
        <strong>{time}</strong>
        <span>{new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
      </div>
      <div className="slot-body">
        <h3>{service?.name}</h3>
        <p className="muted">{service?.duration} min - {service?.price} DT - Patient : {client?.name}</p>
        {note && <p className="note">{note}</p>}
      </div>
      {canDelete && <button className="btn btn-danger" onClick={handleDelete}>Annuler</button>}
    </article>
  );
}
