# Clinique Salma - Gestion de rendez-vous (MERN + JWT)

Projet MERN - École Polytechnique de Sousse (Dr. A. GUEDDES).
Les visiteurs consultent le planning (lecture seule). Les utilisateurs connectés réservent et annulent leurs rendez-vous.

## Architecture
- `server/` : Express, Mongoose, bcrypt, JWT (`models/`, `routes/`, `middleware/`, `server.js`)
- `client/` : React 18 + Vite, Redux Toolkit, Axios (intercepteur JWT)

## Modèles Mongoose
- **User** (name, email, password haché, role)
- **Service** (name, duration, price)
- **Appointment** (client -> ref User, service -> ref Service, date, time, note) : relations 1→N, affichées avec `.populate()`

## API
| Méthode | Route | Accès |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | Public |
| GET | /api/services, /api/appointments | Public |
| POST | /api/appointments | Connecté (JWT) |
| DELETE | /api/appointments/:id | Propriétaire ou Admin |
| POST / DELETE | /api/services | Admin |

## Lancer en local
```bash
# Terminal 1
cd server && npm install
cp .env.example .env      # puis renseigner MONGODB_URI et JWT_SECRET
npm run seed              # services + comptes de démo
npm run dev

# Terminal 2
cd client && npm install
cp .env.example .env
npm run dev               # http://localhost:5173
```
Comptes de démo : `admin@clinique.tn / admin123` et `aya@clinique.tn / 123456`.

## Déploiement
1. **MongoDB Atlas** : cluster gratuit M0, utilisateur de base de données, Network Access `0.0.0.0/0`, copier l'URI (ajouter `/rdv` avant le `?`).
2. **Render** (Web Service, Root Directory `server`) : Build `npm install`, Start `npm start`. Variables : `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (URL Vercel, sans `/` final). Lancer `npm run seed` une fois en local avec l'URI Atlas pour remplir la base.
3. **Vercel** (Root Directory `client`, preset Vite) : variable `VITE_API_URL=https://VOTRE-API.onrender.com/api`.
4. Renseigner l'URL Vercel dans `CLIENT_URL` sur Render, puis redéployer l'API.

Le plan gratuit de Render s'endort après inactivité : la première requête peut prendre environ 50 secondes.
