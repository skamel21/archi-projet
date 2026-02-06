# Todo App - Architecture Logicielle

Application Todo List refactorisée avec séparation frontend/backend, architecture hexagonale, authentification et conformité RGPD.

## Prérequis

- **Node.js** 20.x ou supérieur
- **npm** 9.x ou supérieur
- **Docker** et **Docker Compose** (pour le lancement avec MySQL)

## Structure du projet

```
project-root/
├── frontend/           # React + Vite + TypeScript
│   ├── src/
│   ├── tests/          # Tests E2E (Playwright)
│   ├── Dockerfile
│   └── package.json
├── backend/            # Express + TypeScript
│   ├── src/
│   │   ├── domain/         # Logique métier pure
│   │   ├── application/    # Use-cases
│   │   ├── infrastructure/ # Implémentations (DB, auth)
│   │   └── interface/      # API REST (routes, controllers)
│   ├── tests/          # Tests unitaires et d'intégration
│   ├── Dockerfile
│   └── package.json
├── docs/
│   ├── ARCHITECTURE.md # Architecture et schémas
│   ├── DECISIONS.md    # Architecture Decision Records
│   └── RGPD.md         # Conformité RGPD
├── docker-compose.yml
└── README.md
```

## Installation locale

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Lancement en développement

### Backend (SQLite)

```bash
cd backend
npm run dev
```

Le backend démarre sur http://localhost:3001 avec une base SQLite locale.

### Frontend

```bash
cd frontend
npm run dev
```

Le frontend démarre sur http://localhost:5173 avec un proxy vers le backend.

## Lancement avec Docker Compose

```bash
docker compose up
```

Cette commande lance :
- **Frontend** sur le port 5173
- **Backend** sur le port 3001 (avec MySQL)
- **MySQL** sur le port 3306

## Tests

### Backend (Jest - tests unitaires et d'intégration)

```bash
cd backend
npm test
```

Les tests backend utilisent un repository **InMemory** (aucune dépendance SQLite/MySQL).

### Frontend (Playwright - tests E2E)

```bash
cd frontend
npx playwright install
npm test
```

### Scénarios E2E couverts

1. **Parcours complet** : Register → Login → Create → Update → Delete → Logout
2. **Isolation utilisateurs** : User A crée des todos, User B ne les voit pas
3. **Suppression de compte** : Suppression → Login impossible

## Linting et formatage

```bash
# Backend
cd backend
npm run lint
npm run format

# Frontend
cd frontend
npm run lint
npm run format
```

## API REST

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Inscription |
| POST | `/auth/login` | Connexion |
| GET | `/auth/me` | Profil utilisateur (auth requise) |

### Todos (authentification requise)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/todos` | Liste des todos de l'utilisateur |
| POST | `/todos` | Créer un todo |
| PATCH | `/todos/:id` | Modifier un todo |
| DELETE | `/todos/:id` | Supprimer un todo |

### RGPD (authentification requise)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/me/export` | Exporter toutes les données (JSON) |
| DELETE | `/me` | Supprimer le compte et les données |

## Documentation

- [Architecture](docs/ARCHITECTURE.md) - Schémas et explication des couches
- [Décisions](docs/DECISIONS.md) - Architecture Decision Records
- [RGPD](docs/RGPD.md) - Conformité et procédures

## Stack technique

### Backend
- Express + TypeScript
- Architecture hexagonale (Ports & Adapters)
- JWT pour l'authentification
- bcrypt pour le hachage des mots de passe
- Zod pour la validation
- Jest pour les tests
- SQLite (dev) / MySQL (prod) / InMemory (tests)

### Frontend
- React 18 + TypeScript
- Vite (build + HMR)
- Bootstrap 5 + FontAwesome
- React Router pour la navigation
- Playwright pour les tests E2E

### DevOps
- Docker + Docker Compose
- ESLint + Prettier
- dependency-cruiser (règles architecturales)
