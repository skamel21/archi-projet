# Architecture du projet

## Vue d'ensemble

L'application Todo List suit une **architecture hexagonale** (Ports & Adapters) avec une séparation stricte entre le frontend et le backend.

```
┌─────────────────────────────────────────────────────────┐
│                       Frontend                          │
│              React + Vite + TypeScript                   │
│                    (Port 5173)                           │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/REST (JSON)
┌───────────────────────┴─────────────────────────────────┐
│                       Backend                           │
│              Express + TypeScript                        │
│                    (Port 3001)                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │                 Interface Layer                     │ │
│  │         Routes, Controllers, DTOs                  │ │
│  │              Middleware (Auth)                      │ │
│  └────────────────────┬───────────────────────────────┘ │
│  ┌────────────────────┴───────────────────────────────┐ │
│  │               Application Layer                    │ │
│  │            Use-Cases, Validators                   │ │
│  └────────────────────┬───────────────────────────────┘ │
│  ┌────────────────────┴───────────────────────────────┐ │
│  │                 Domain Layer                       │ │
│  │        Entities, Value Objects, Ports              │ │
│  │          (AUCUNE dépendance technique)             │ │
│  └────────────────────┬───────────────────────────────┘ │
│  ┌────────────────────┴───────────────────────────────┐ │
│  │              Infrastructure Layer                  │ │
│  │    SQLite / MySQL / InMemory Repositories          │ │
│  │         Bcrypt, JWT, Configuration                 │ │
│  └────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────────┐
│                    Base de données                       │
│            MySQL (prod) / SQLite (dev)                   │
│                    (Port 3306)                           │
└─────────────────────────────────────────────────────────┘
```

## Couches de l'architecture

### Domain Layer (`backend/src/domain/`)

La couche domaine contient la logique métier pure. Elle ne dépend d'aucune librairie technique (pas d'Express, pas de DB, pas de JWT).

- **Entities** : `Todo`, `User` - objets métier avec leurs règles de validation
- **Ports** : Interfaces définissant les contrats (`TodoRepository`, `UserRepository`, `PasswordHasher`, `TokenService`)

### Application Layer (`backend/src/application/`)

Orchestration des cas d'utilisation. Cette couche coordonne les appels au domaine et aux ports.

- **Use-Cases** :
  - Auth : `RegisterUser`, `LoginUser`, `GetCurrentUser`
  - Todo : `CreateTodo`, `GetTodos`, `UpdateTodo`, `DeleteTodo`
  - User/RGPD : `ExportUserData`, `DeleteUser`
- **Validators** : Schémas de validation Zod

### Infrastructure Layer (`backend/src/infrastructure/`)

Implémentations concrètes des ports définis dans le domaine.

- **Persistence** :
  - `InMemoryTodoRepository` / `InMemoryUserRepository` - pour les tests
  - `SqliteTodoRepository` / `SqliteUserRepository` - développement local
  - `MysqlTodoRepository` / `MysqlUserRepository` - production (Docker)
- **Auth** : `BcryptPasswordHasher`, `JwtTokenService`
- **Config** : configuration centralisée via variables d'environnement

### Interface Layer (`backend/src/interface/`)

Point d'entrée HTTP de l'application.

- **Routes** : définition des endpoints REST
- **Controllers** : traitement des requêtes/réponses HTTP
- **Middleware** : authentification JWT
- **DTOs** : objets de transfert de données

## Flux de données

```
HTTP Request
    ↓
Routes (Express Router)
    ↓
Middleware (Auth JWT)
    ↓
Controller (validation, transformation DTO)
    ↓
Use-Case (logique applicative)
    ↓
Domain Entity (règles métier)
    ↓
Port (interface abstraite)
    ↓
Repository (implémentation concrète: SQLite/MySQL/InMemory)
    ↓
Database
```

## Injection de dépendances

L'injection se fait au démarrage de l'application dans `src/index.ts` :

```typescript
// Sélection automatique du repository selon l'environnement
if (process.env.NODE_ENV === 'test') → InMemoryRepository
if (process.env.DB_TYPE === 'mysql')  → MysqlRepository
default                               → SqliteRepository
```

## Frontend

```
frontend/src/
├── api/          # Client HTTP isolé (fetch wrapper)
├── components/   # Composants React réutilisables
├── context/      # AuthContext (gestion d'état global)
├── hooks/        # Custom hooks (useAuth)
├── pages/        # Pages (Login, Register, Todos, Profile)
├── styles/       # CSS global
└── types/        # Types TypeScript partagés
```

## Contraintes architecturales

1. **Le domaine ne dépend de rien** - vérifié par `dependency-cruiser` et tests automatisés
2. **Aucun `sqlite3` en test** - vérifié par test d'architecture automatisé
3. **Le frontend communique uniquement via l'API REST** - pas d'accès direct à la DB
4. **Les secrets sont dans des variables d'environnement** - jamais en dur dans le code
