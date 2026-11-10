import axios from 'axios';

// Instance Axios : URL locale par defaut, URL Render en production (variable Vercel)
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Intercepteur JWT : ajoute "Bearer <token>" a chaque requete si un token existe
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
