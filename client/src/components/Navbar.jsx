import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const count = useSelector((state) => state.appointments.items.length);
  const dispatch = useDispatch();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <div>
          <h1 className="brand">Clinique Salma</h1>
          <p className="brand-sub">{count} rendez-vous planifiés</p>
        </div>
        {user ? (
          <div className="user-box">
            <span><strong>{user.name}</strong> ({user.role})</span>
            <button className="btn btn-light" onClick={() => dispatch(logout())}>Se déconnecter</button>
          </div>
        ) : (
          <span className="visitor">Mode visiteur : lecture seule</span>
        )}
      </div>
    </header>
  );
}
