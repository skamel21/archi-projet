# Conformité RGPD

## 1. Données personnelles stockées

### Données utilisateur
| Donnée | Type | Finalité | Base légale |
|--------|------|----------|-------------|
| Email | string | Identification / Connexion | Exécution du contrat |
| Mot de passe (haché) | string | Authentification | Exécution du contrat |
| Date de création | datetime | Gestion du compte | Intérêt légitime |
| Date de mise à jour | datetime | Gestion du compte | Intérêt légitime |

### Données de l'application (Todos)
| Donnée | Type | Finalité | Base légale |
|--------|------|----------|-------------|
| Nom de la tâche | string | Fonctionnalité principale | Exécution du contrat |
| Statut (complété) | boolean | Fonctionnalité principale | Exécution du contrat |
| Identifiant utilisateur | string | Isolation des données | Exécution du contrat |
| Dates de création/modification | datetime | Traçabilité | Intérêt légitime |

### Données NON collectées
- Pas de cookies de tracking
- Pas de données de navigation
- Pas de données de géolocalisation
- Pas de données transmises à des tiers

## 2. Droits de l'utilisateur

Conformément au RGPD (articles 15 à 21), l'utilisateur dispose des droits suivants :

### Droit d'accès (Article 15)
L'utilisateur peut consulter toutes ses données via la page "Mon profil".

### Droit de rectification (Article 16)
L'utilisateur peut modifier ses todos (nom, statut) à tout moment.

### Droit à l'effacement (Article 17)
L'utilisateur peut supprimer son compte et toutes ses données associées via le bouton "Supprimer mon compte" sur la page profil.

### Droit à la portabilité (Article 20)
L'utilisateur peut exporter l'intégralité de ses données au format JSON via le bouton "Exporter mes données" sur la page profil.

### Droit d'opposition (Article 21)
L'utilisateur peut supprimer son compte à tout moment, ce qui entraîne la suppression de toutes ses données.

## 3. Procédure d'export des données

### Côté utilisateur
1. Se connecter à l'application
2. Aller sur la page "Mon profil"
3. Cliquer sur "Exporter mes données"
4. Un fichier JSON est téléchargé automatiquement

### Côté technique
- **Endpoint** : `GET /me/export`
- **Authentification** : Bearer token JWT requis
- **Format** : JSON
- **Contenu** :
  ```json
  {
    "exportDate": "2026-01-15T10:30:00.000Z",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "todos": [
      {
        "id": "uuid",
        "name": "Ma tâche",
        "completed": false,
        "createdAt": "2026-01-10T00:00:00.000Z",
        "updatedAt": "2026-01-10T00:00:00.000Z"
      }
    ]
  }
  ```

## 4. Procédure de suppression / anonymisation

### Côté utilisateur
1. Se connecter à l'application
2. Aller sur la page "Mon profil"
3. Cliquer sur "Supprimer mon compte"
4. Confirmer la suppression
5. Redirection vers la page de connexion

### Côté technique
- **Endpoint** : `DELETE /me`
- **Authentification** : Bearer token JWT requis
- **Actions effectuées** :
  1. Suppression de tous les todos associés à l'utilisateur
  2. Suppression du compte utilisateur
  3. Log de l'opération : `[RGPD] User {userId} and all associated data deleted at {timestamp}`

### Irréversibilité
La suppression est **définitive et irréversible**. Aucune récupération n'est possible après confirmation.

## 5. Durée de conservation

| Donnée | Durée de conservation |
|--------|----------------------|
| Compte utilisateur | Jusqu'à suppression par l'utilisateur |
| Todos | Jusqu'à suppression individuelle ou suppression du compte |
| Logs de suppression | Conservation pour audit de conformité |

## 6. Mesures de sécurité

### Authentification
- Mots de passe hachés avec **bcrypt** (10 rounds de salt)
- Authentification par **JWT** avec expiration configurable
- Validation stricte des entrées avec **Zod**

### Transmission
- CORS configuré pour limiter les origines autorisées
- Headers de sécurité standard

### Stockage
- Aucun secret en dur dans le code source
- Variables d'environnement pour la configuration sensible
- Fichiers `.env.example` fournis (sans valeurs réelles)

### Isolation des données
- Chaque utilisateur ne peut accéder qu'à ses propres todos
- Vérification de l'appartenance à chaque opération (userId)
- Tests automatisés vérifiant l'isolation entre utilisateurs

## 7. Privacy Notice (Mention d'information)

> **Information sur le traitement de vos données personnelles**
>
> Cette application collecte et traite les données suivantes : adresse email et tâches (todos) que vous créez.
>
> Ces données sont traitées dans le cadre de l'exécution du service de gestion de tâches que vous utilisez.
>
> Vous disposez des droits d'accès, de rectification, d'effacement, de portabilité et d'opposition sur vos données.
>
> Pour exercer ces droits, rendez-vous sur la page "Mon profil" de l'application.
>
> Vos données sont conservées jusqu'à la suppression de votre compte.
>
> Aucune donnée n'est transmise à des tiers.
