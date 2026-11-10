import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { loginSuccess } from '../redux/authSlice';

export default function AuthCard() {
  const [mode, setMode] = useState('login'); // 'login' ou 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const isLogin = mode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const url = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin ? { email, password } : { name, email, password };
      const response = await axiosClient.post(url, body);
      dispatch(loginSuccess(response.data)); // Redux + localStorage
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Serveur injoignable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>{isLogin ? 'Connectez-vous pour réserver' : 'Créer un compte'}</h2>
      <p className="muted">Vous pouvez consulter le planning sans compte. Réserver ou annuler demande une connexion.</p>
      {errorMsg && <div className="alert error">{errorMsg}</div>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <label>Nom complet
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        )}
        <label>Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>Mot de passe
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
        </label>
        <button className="btn" disabled={loading}>
          {loading ? 'Veuillez patienter...' : isLogin ? 'Se connecter' : 'Créer mon compte'}
        </button>
      </form>
      <button className="link" onClick={() => { setMode(isLogin ? 'register' : 'login'); setErrorMsg(''); }}>
        {isLogin ? "Pas de compte ? S'inscrire" : 'Déjà inscrit ? Se connecter'}
      </button>
    </div>
  );
}
