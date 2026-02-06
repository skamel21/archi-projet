# Architecture Decision Records (ADR)

## ADR-001 : JWT pour l'authentification

**Statut :** Accepté

**Contexte :** Nous devons choisir entre JWT (JSON Web Tokens) et les sessions côté serveur pour l'authentification.

**Décision :** Nous utilisons JWT avec des tokens stockés côté client (localStorage).

**Justification :**
- **Stateless** : le serveur n'a pas besoin de stocker les sessions, ce qui simplifie le scaling
- **Découplage** : le frontend et le backend peuvent être déployés indépendamment
- **Simplicité** : pas besoin de session store (Redis, etc.)
- **Standard** : format largement adopté et bien documenté

**Compromis :**
- Les tokens ne peuvent pas être révoqués côté serveur sans blacklist
- Le token est stocké dans localStorage (vulnérable au XSS)
- Pour un projet de production, on préférerait httpOnly cookies avec refresh tokens

---

## ADR-002 : SQLite pour le développement, MySQL pour la production

**Statut :** Accepté

**Contexte :** L'application doit fonctionner en développement local et en production Docker.

**Décision :** Trois implémentations de persistance :
- `InMemoryRepository` pour les tests
- `SqliteRepository` pour le développement local
- `MysqlRepository` pour Docker/production

**Justification :**
- **SQLite** : zéro configuration en local, fichier unique, rapide pour le développement
- **MySQL** : robuste, performant, adapté à la production
- **InMemory** : tests rapides sans I/O, isolation totale entre les tests

**Compromis :**
- Trois implémentations à maintenir
- Risque de divergence de comportement entre les implémentations
- Mitigé par l'interface commune (port) et les tests d'intégration

---

## ADR-003 : TypeScript strict

**Statut :** Accepté

**Contexte :** Le projet original est en JavaScript. La migration vers TypeScript est requise.

**Décision :** TypeScript avec `strict: true` dans le backend et le frontend.

**Justification :**
- Détection des erreurs à la compilation
- Meilleure documentation du code via les types
- Autocomplétion et refactoring plus sûrs
- Interfaces pour les ports de l'architecture hexagonale

**Compromis :**
- Courbe d'apprentissage pour les développeurs JS
- Temps de compilation supplémentaire
- Certains types de bibliothèques tierces peuvent être incomplets

---

## ADR-004 : Monorepo avec dossiers séparés

**Statut :** Accepté

**Contexte :** Le projet contenait tout dans un seul dossier. Nous devons séparer frontend et backend.

**Décision :** Structure monorepo avec `frontend/` et `backend/` comme dossiers racine.

**Justification :**
- **Simplicité** : un seul repository Git à gérer
- **Cohérence** : les versions frontend/backend évoluent ensemble
- **Docker Compose** : facilité d'orchestration depuis la racine
- **Pas de workspace npm** : chaque package est indépendant (install séparé)

**Compromis :**
- Pas de partage de types entre frontend et backend (dupliqués)
- Pas de workspace npm (pourrait être ajouté si nécessaire)

---

## ADR-005 : Zod pour la validation

**Statut :** Accepté

**Contexte :** Besoin de valider les entrées utilisateur côté backend.

**Décision :** Utilisation de Zod pour la validation des schémas.

**Justification :**
- Validation et typage TypeScript en une seule déclaration
- Messages d'erreur clairs et personnalisables
- Léger et sans dépendances
- API intuitive et composable

---

## ADR-006 : bcrypt pour le hachage des mots de passe

**Statut :** Accepté

**Contexte :** Les mots de passe doivent être stockés de manière sécurisée.

**Décision :** Utilisation de bcrypt avec 10 rounds de salt.

**Justification :**
- Algorithme éprouvé et recommandé pour le hachage de mots de passe
- Résistant aux attaques par force brute (facteur de coût ajustable)
- Largement utilisé dans l'industrie

**Compromis :**
- Plus lent que argon2id (mais suffisant pour ce projet)
- Dépendance native (compilation nécessaire)

---

## ADR-007 : Vite pour le build frontend

**Statut :** Accepté

**Contexte :** Le frontend original n'avait pas de build tool (Babel runtime).

**Décision :** Utilisation de Vite comme outil de build et serveur de développement.

**Justification :**
- Hot Module Replacement (HMR) ultra-rapide
- Support TypeScript natif
- Configuration minimale
- Build optimisé avec Rollup
- Proxy API intégré pour le développement

---

## ADR-008 : Playwright pour les tests E2E

**Statut :** Accepté

**Contexte :** Besoin de tests end-to-end pour valider les parcours utilisateur.

**Décision :** Utilisation de Playwright pour les tests E2E du frontend.

**Justification :**
- Support multi-navigateurs (Chromium, Firefox, WebKit)
- API moderne et stable
- Attente automatique des éléments
- Traces et screenshots pour le debugging
- Meilleur support que Cypress pour les tests cross-origin

---

## ADR-009 : Architecture hexagonale (Ports & Adapters)

**Statut :** Accepté

**Contexte :** L'application monolithique mélangeait logique métier et accès aux données.

**Décision :** Adoption de l'architecture hexagonale avec 4 couches : Domain, Application, Infrastructure, Interface.

**Justification :**
- **Testabilité** : le domaine est testable sans base de données
- **Flexibilité** : changement de base de données transparent
- **Maintenabilité** : séparation claire des responsabilités
- **Découplage** : les règles métier ne dépendent pas du framework

**Compromis :**
- Plus de fichiers et de couches d'abstraction
- Complexité accrue pour une application simple
- Nécessite une discipline dans le respect des dépendances entre couches
