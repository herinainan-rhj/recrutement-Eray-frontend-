# E RAY — Recrutement (frontend)

Application React + Vite : site public de recrutement et backoffice RH.

## Démarrage

```bash
npm install
npm run dev
```

L'API Laravel est attendue sur `http://127.0.0.1:8000/api`. Pour changer
d'adresse, copiez `.env.example` en `.env` et modifiez `VITE_API_URL`.

## Pages

| Site public | Chemin |
|---|---|
| Accueil | `/` |
| Offres d'emploi, détail d'une offre | `/jobs`, `/jobs/:id` |
| Entreprise, À propos, Contact | `/entreprise`, `/a-propos`, `/contact` |
| Test de recrutement | `/test?candidate_id=…` |

| Backoffice | Chemin |
|---|---|
| Tableau de bord | `/admin/dashboard` |
| Offres, Candidats, Tests QCM | `/admin/jobs`, `/admin/candidates`, `/admin/tests` |
| Emails, Paramètres | `/admin/emails`, `/admin/settings` |

## Routes API utilisées

Toutes les routes sont déclarées dans `src/services/api.js`.

| Route | Usage |
|---|---|
| `GET /jobs` | liste des offres |
| `POST /admin/jobs` | création d'une offre |
| `PUT /admin/jobs/{id}`, `DELETE /admin/jobs/{id}` | modification / suppression d'une offre |
| `GET /candidates`, `POST /candidates` | liste des candidatures / dépôt d'une candidature |
| `PATCH /candidates/{id}` | changement d'étape (`etat_candidature`) |
| `GET /candidates/{id}/cv` | téléchargement du CV |
| `POST /questions/import`, `GET /questions/random`, `POST /questions/submit` | tests QCM |
| `POST /contact` | formulaire de contact |

## Configuration

- `src/config/site.js` : coordonnées affichées sur le site public.
- `src/styles/theme.css` : couleurs et composants communs.
- Les paramètres et modèles d'emails du backoffice sont enregistrés dans le
  navigateur (localStorage).
