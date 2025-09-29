# Application de Gestion des Salaires

Une application web de gestion des salaires multi-entreprises permettant de gérer les employés, générer des cycles de paie et des bulletins de salaire, suivre les paiements, et offrir un dashboard de suivi avec rôles utilisateurs (super-admin, admin, caissier).

## Contexte et objectifs

De nombreuses petites et moyennes entreprises gèrent encore leurs salaires de manière manuelle (Excel, papier), ce qui entraîne des erreurs, un manque de suivi et des difficultés à générer des justificatifs fiables.

L'objectif de ce projet est de développer une **application web de gestion des salaires multi-entreprises** permettant :
- de gérer les **employés** avec différents types de contrats (journalier, salaire fixe, honoraire),
- de générer des **cycles de paie (pay runs)** et des **bulletins de salaire (payslips)**,
- de suivre les **paiements partiels ou totaux** avec génération de **reçus PDF**,
- d'offrir un **dashboard de suivi** (cartes, courbes),
- de permettre la **gestion multi-entreprises** avec rôles utilisateurs (super-admin, admin, caissier).

## Périmètre du projet

### Inclus
- Gestion multi-entreprises
- Gestion des employés
- Gestion des cycles de paie (Pay Run)
- Gestion des bulletins de paie (Payslip)
- Gestion des paiements (versements partiels et totaux)
- Génération de documents PDF (reçus, factures, liste des paiements, bulletins)
- Dashboard (indicateurs clés, graphiques)
- Filtrage avancé des employés (statut, poste, type de contrat, actif/inactif)
- Rôles utilisateurs et permissions
- Activation/désactivation d'employés (vacataires)

### Hors périmètre (future évolution)
- Intégration bancaire automatisée
- Déclarations sociales et fiscales
- Gestion des congés et absences
- Intégration mobile (application native)

## Acteurs et rôles
- **Super-Administrateur** : gère toutes les entreprises, crée et supprime des comptes entreprise.
- **Administrateur (Entreprise)** : gère son entreprise, ses employés, lance les cycles de paie, approuve les bulletins.
- **Caissier** : enregistre les paiements, génère les reçus et listes, consulte les bulletins.
- **Employé (optionnel)** : peut recevoir ses bulletins par email ou espace personnel (phase 2).

## Fonctionnalités
### 4.1 Tableau de bord
- Affichage des KPI : masse salariale, montant payé, montant restant, nombre d'employés actifs.
- Graphique de l'évolution de la masse salariale (6 derniers mois).
- Liste des prochains paiements à effectuer.

### 4.2 Gestion des entreprises
- Créer, modifier, supprimer une entreprise.
- Paramètres : logo, adresse, devise, type de période (mensuelle/hebdo/journalière).
- Ajouter des utilisateurs (admin, caissier).

### 4.3 Gestion des employés
- Créer, modifier, supprimer un employé.
- Champs : nom complet, poste, type de contrat (journalier, fixe, honoraire), taux/salaire, coordonnées bancaires.
- Activer/désactiver un employé (vacataire en congé).
- Filtrer les employés par statut, poste, contrat, actif/inactif.

### 4.4 Cycles de paie (Pay Run)
- Créer un cycle (mensuel, hebdo, journalier).
- Générer automatiquement les bulletins (payslips).
- Pour les journaliers : saisir le nombre de jours travaillés.
- Statuts : brouillon, approuvé, clôturé.

### 4.5 Bulletins de paie (Payslip)
- Contenir : informations employé + entreprise, brut, déductions, net à payer.
- Être modifiable tant que le cycle est en brouillon.
- Être verrouillé après approbation du cycle.
- Export PDF individuel ou en lot.

### 4.6 Paiements
- Enregistrer un paiement total ou partiel.
- Modes : espèces, virement bancaire, Orange Money, Wave, etc.
- Génération automatique de **reçus PDF**.
- Statut du bulletin : payé, partiel, en attente.

### 4.7 Génération de documents
- **Reçu PDF** (après chaque paiement).
- **Bulletin de paie PDF** (par employé ou en lot).
- **Liste des paiements PDF** (par période).
- **Liste des emargements PDF** (par période).
- **Facture pro PDF** (optionnelle).

### 4.8 Sécurité & permissions
- Authentification (email/mot de passe).
- Rôles et autorisations strictes (RBAC).
- Super-admin : multi-entreprise.
- Admin : entreprise unique.
- Caissier : entreprise unique (paiements uniquement).

## Contraintes techniques
- **Backend** : Node.js.
- **Frontend** : React + Tailwind CSS.
- **Base de données** : MySQL.
- **PDF** : libre choix.
- **Sécurité** : Hashage des mots de passe.

## Planning (sprints agiles)
- **Sprint 0** : Setup projet, auth.
- **Sprint 1** : Gestion des employés (+ filtres, activation/désactivation).
- **Sprint 2** : Gestion des cycles de paie + bulletins.
- **Sprint 3** : Gestion des paiements + PDF reçus.
- **Sprint 4** : Dashboard KPI + graphiques.
- **Sprint 5** : Tests, documentation, déploiement MVP.

## Indicateurs de succès
- L'entreprise peut gérer **100+ employés sans erreur**.
- Génération des PDF **instantanée** (<2s par reçu).
- Recherche et filtres employés **<1s**.
- Dashboard en temps réel.
- Satisfaction utilisateur (admins/caissiers) ≥ 90%.

## Architecture

- **Backend**: API REST Node.js/Express avec authentification JWT, Prisma ORM et MySQL
- **Frontend**: Application React/Vite avec interface utilisateur
- **Base de données**: MySQL
- **Containerisation**: Docker et Docker Compose

Cette application fournit une solution complète pour la gestion des salaires.

## Prérequis

- Docker et Docker Compose installés

## Lancement de l'application

1. Clonez ou naviguez vers le répertoire du projet `projet-salaires`

2. Lancez les services avec Docker Compose :
   ```bash
   docker-compose up --build
   ```

3. Attendez que tous les services démarrent :
   - Base de données MySQL sur le port 3306
   - Backend API sur le port 3000
   - Frontend React sur le port 3001

4. Accédez à l'application :
   - Frontend : http://localhost:3001
   - Backend API : http://localhost:3000

## Utilisation

1. Ouvrez http://localhost:3001 dans votre navigateur
2. Utilisez le formulaire de connexion pour vous authentifier
3. Pour créer un compte, utilisez l'endpoint API `/auth/register` avec un outil comme Postman ou curl

### Extension du modèle

Ce modèle peut être étendu en ajoutant :
- Nouvelles routes API dans `backend/src/routes/`
- Nouveaux composants React dans `frontend/src/`
- Nouveaux modèles Prisma dans `backend/prisma/schema.prisma`
- Middleware d'authentification pour protéger les routes

## Documentation API complète

L'API utilise des tokens JWT pour l'authentification. Tous les endpoints (sauf login/register) nécessitent un header `Authorization: Bearer <token>`.

### Authentification

#### POST /auth/register
**Description**: Inscription d'un nouvel utilisateur. Pour SUPER_ADMIN, pas d'entreprise. Pour autres rôles, entrepriseId requis.

**Authentification**: Non requise

**Rôles autorisés**: Tous

**Corps de la requête**:
```json
{
  "email": "string",
  "password": "string",
  "role": "SUPER_ADMIN" | "ADMIN" | "CAISSIER" | "EMPLOYE",
  "entrepriseId": "string" // requis si role != SUPER_ADMIN
}
```

**Réponse de succès (201)**:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "string",
    "entrepriseId": "string" | null
  }
}
```

**Erreurs**: 400 (champs manquants), 400 (utilisateur existe)

#### POST /auth/login
**Description**: Connexion utilisateur

**Authentification**: Non requise

**Rôles autorisés**: Tous

**Corps de la requête**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Réponse de succès (200)**:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "role": "string",
    "entrepriseId": "string" | null
  }
}
```

**Erreurs**: 401 (credentials invalides)

#### GET /auth/me
**Description**: Récupérer les informations de l'utilisateur connecté

**Authentification**: Requise

**Rôles autorisés**: Tous

**Corps de la requête**: Aucun

**Réponse de succès (200)**:
```json
{
  "id": "string",
  "email": "string",
  "role": "string",
  "entrepriseId": "string" | null
}
```

**Erreurs**: 401 (non authentifié)

### Employés

#### GET /employees
**Description**: Lister tous les employés de l'entreprise

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN, CAISSIER

**Paramètres de requête**: Aucun

**Réponse de succès (200)**:
```json
[
  {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "poste": "string",
    "contract": "JOURNALIER" | "FIXE" | "HONORAIRE",
    "baseSalary": "number",
    "isActive": "boolean",
    "createdAt": "date",
    "updatedAt": "date",
    "entrepriseId": "string",
    "userId": "string" | null
  }
]
```

#### GET /employees/:id
**Description**: Récupérer un employé par ID

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN, CAISSIER

**Paramètres**: id (string)

**Réponse de succès (200)**: Objet employé (voir ci-dessus)

**Erreurs**: 404 (non trouvé)

#### POST /employees
**Description**: Créer un nouvel employé

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN

**Corps de la requête**:
```json
{
  "firstName": "string",
  "lastName": "string",
  "poste": "string",
  "contract": "JOURNALIER" | "FIXE" | "HONORAIRE",
  "baseSalary": "number"
}
```

**Réponse de succès (201)**: Objet employé créé

#### PUT /employees/:id
**Description**: Mettre à jour un employé

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN

**Paramètres**: id (string)

**Corps de la requête**: Champs à mettre à jour (même structure que création)

**Réponse de succès (200)**: Objet employé mis à jour

#### PATCH /employees/:id/activate
**Description**: Activer/désactiver un employé

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN

**Paramètres**: id (string)

**Corps de la requête**:
```json
{
  "isActive": "boolean"
}
```

**Réponse de succès (200)**: Objet employé mis à jour

#### POST /employees/filter
**Description**: Filtrer les employés

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN, CAISSIER

**Corps de la requête**:
```json
{
  "isActive": "boolean",
  "contract": "string",
  "poste": "string"
}
```

**Réponse de succès (200)**: Liste d'employés filtrés

### Entreprises

#### GET /entreprises
**Description**: Lister toutes les entreprises

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN

**Réponse de succès (200)**:
```json
[
  {
    "id": "string",
    "name": "string",
    "logo": "string" | null,
    "address": "string" | null,
    "currency": "string",
    "periodType": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

#### GET /entreprises/:id
**Description**: Récupérer une entreprise par ID

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN

**Paramètres**: id (string)

**Réponse de succès (200)**: Objet entreprise

#### POST /entreprises
**Description**: Créer une nouvelle entreprise

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN

**Corps de la requête**:
```json
{
  "name": "string",
  "logo": "string",
  "address": "string",
  "currency": "string",
  "periodType": "string"
}
```

**Réponse de succès (201)**: Objet entreprise créé

#### PUT /entreprises/:id
**Description**: Mettre à jour une entreprise

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN

**Paramètres**: id (string)

**Corps de la requête**: Champs à mettre à jour

**Réponse de succès (200)**: Objet entreprise mis à jour

#### DELETE /entreprises/:id
**Description**: Supprimer une entreprise

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN

**Paramètres**: id (string)

**Réponse de succès (204)**: Aucun contenu

### Cycles de paie (Payruns)

#### GET /payruns
**Description**: Lister tous les cycles de paie de l'entreprise

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN, CAISSIER

**Réponse de succès (200)**:
```json
[
  {
    "id": "string",
    "period": "string",
    "status": "BROUILLON" | "APPROUVE" | "CLOS",
    "createdAt": "date",
    "updatedAt": "date",
    "entrepriseId": "string"
  }
]
```

#### GET /payruns/:id
**Description**: Récupérer un cycle de paie par ID

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN, CAISSIER

**Paramètres**: id (string)

**Réponse de succès (200)**: Objet payrun

#### POST /payruns
**Description**: Créer un nouveau cycle de paie

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN

**Corps de la requête**:
```json
{
  "period": "string"
}
```

**Réponse de succès (201)**: Objet payrun créé

#### PUT /payruns/:id
**Description**: Mettre à jour le statut d'un cycle de paie

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN

**Paramètres**: id (string)

**Corps de la requête**:
```json
{
  "status": "BROUILLON" | "APPROUVE" | "CLOS"
}
```

**Réponse de succès (200)**: Objet payrun mis à jour

#### GET /payruns/:id/payslips
**Description**: Récupérer les bulletins de paie d'un cycle

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN, CAISSIER

**Paramètres**: id (string)

**Réponse de succès (200)**: Liste de payslips

### Bulletins de paie (Payslips)

#### GET /payslips
**Description**: Lister les bulletins de paie de l'entreprise

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN, CAISSIER

**Réponse de succès (200)**:
```json
[
  {
    "id": "string",
    "grossSalary": "number",
    "deductions": "number",
    "netSalary": "number",
    "status": "EN_ATTENTE" | "PARTIEL" | "PAYE",
    "createdAt": "date",
    "updatedAt": "date",
    "employeeId": "string",
    "cycleId": "string"
  }
]
```

#### GET /payslips/:id
**Description**: Récupérer un bulletin de paie par ID

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN, CAISSIER

**Paramètres**: id (string)

**Réponse de succès (200)**:
```json
{
  "id": "string",
  "grossSalary": "number",
  "deductions": "number",
  "netSalary": "number",
  "status": "EN_ATTENTE" | "PARTIEL" | "PAYE",
  "createdAt": "date",
  "updatedAt": "date",
  "employeeId": "string",
  "cycleId": "string",
  "employee": { ... },
  "cycle": { ... },
  "payments": [ ... ]
}
```

#### PUT /payslips/:id
**Description**: Mettre à jour un bulletin de paie

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN

**Paramètres**: id (string)

**Corps de la requête**:
```json
{
  "grossSalary": "number",
  "deductions": "number",
  "netSalary": "number"
}
```

**Réponse de succès (200)**: Objet payslip mis à jour

#### GET /payslips/:id/payments
**Description**: Récupérer les paiements d'un bulletin

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN, CAISSIER

**Paramètres**: id (string)

**Réponse de succès (200)**: Liste de payments

### Paiements (Payments)

#### POST /payments
**Description**: Créer un nouveau paiement

**Authentification**: Requise

**Rôles autorisés**: CAISSIER

**Corps de la requête**:
```json
{
  "payslipId": "string",
  "amount": "number",
  "mode": "string",
  "receiptUrl": "string"
}
```

**Réponse de succès (201)**: Objet payment créé

#### GET /payments
**Description**: Lister les paiements de l'entreprise

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN, CAISSIER

**Réponse de succès (200)**:
```json
[
  {
    "id": "string",
    "amount": "number",
    "mode": "string",
    "paymentDate": "date",
    "receiptUrl": "string" | null,
    "payslipId": "string",
    "caissierId": "string"
  }
]
```

#### GET /payments/:id
**Description**: Récupérer un paiement par ID

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN, CAISSIER

**Paramètres**: id (string)

**Réponse de succès (200)**:
```json
{
  "id": "string",
  "amount": "number",
  "mode": "string",
  "paymentDate": "date",
  "receiptUrl": "string" | null,
  "payslipId": "string",
  "caissierId": "string",
  "payslip": { ... },
  "caissier": { ... }
}
```

#### GET /payments/:id/receipt
**Description**: Récupérer le reçu d'un paiement

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN, CAISSIER

**Paramètres**: id (string)

**Réponse de succès (200)**:
```json
{
  "receiptUrl": "string"
}
```

### Santé

#### GET /health
**Description**: Vérifier la santé de l'API

**Authentification**: Non requise

**Réponse de succès (200)**:
```json
{
  "ok": true
}
```

## Endpoints API (résumé)

- `POST /auth/register` : Inscription d'un nouvel utilisateur
- `POST /auth/login` : Connexion utilisateur
- `GET /auth/me` : Informations utilisateur connecté
- `GET /employees` : Lister employés
- `GET /employees/:id` : Détails employé
- `POST /employees` : Créer employé
- `PUT /employees/:id` : Mettre à jour employé
- `PATCH /employees/:id/activate` : Activer/désactiver employé
- `POST /employees/filter` : Filtrer employés
- `GET /entreprises` : Lister entreprises
- `GET /entreprises/:id` : Détails entreprise
- `POST /entreprises` : Créer entreprise
- `PUT /entreprises/:id` : Mettre à jour entreprise
- `DELETE /entreprises/:id` : Supprimer entreprise
- `GET /payruns` : Lister cycles de paie
- `GET /payruns/:id` : Détails cycle de paie
- `POST /payruns` : Créer cycle de paie
- `PUT /payruns/:id` : Mettre à jour statut cycle
- `GET /payruns/:id/payslips` : Bulletins d'un cycle
- `GET /payslips` : Lister bulletins
- `GET /payslips/:id` : Détails bulletin
- `PUT /payslips/:id` : Mettre à jour bulletin
- `GET /payslips/:id/payments` : Paiements d'un bulletin
- `POST /payments` : Créer paiement
- `GET /payments` : Lister paiements
- `GET /payments/:id` : Détails paiement
- `GET /payments/:id/receipt` : Reçu de paiement
- `GET /health` : Santé de l'API

## Développement local (optionnel)

Si vous souhaitez développer localement sans Docker :

### Backend
```bash
cd backend
npm install
# Configurez .env avec DATABASE_URL et JWT_SECRET
npx prisma migrate dev
npx prisma generate
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Assurez-vous de mettre à jour `VITE_API_BASE_URL` dans `frontend/.env` pour pointer vers `http://localhost:3000`.

## Structure du projet

```
projet-salaires/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── employeeController.ts
│   │   │   ├── entrepriseController.ts
│   │   │   ├── payrunController.ts
│   │   │   ├── payslipController.ts
│   │   │   └── paymentController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── repositories/
│   │   │   ├── employeeRepository.ts
│   │   │   ├── entrepriseRepository.ts
│   │   │   ├── payrunRepository.ts
│   │   │   ├── payslipRepository.ts
│   │   │   ├── paymentRepository.ts
│   │   │   └── userRepository.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── employees.ts
│   │   │   ├── entreprises.ts
│   │   │   ├── payruns.ts
│   │   │   ├── payslips.ts
│   │   │   └── payments.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── employeeService.ts
│   │   │   ├── entrepriseService.ts
│   │   │   ├── payrunService.ts
│   │   │   ├── payslipService.ts
│   │   │   └── paymentService.ts
│   │   ├── utils/
│   │   │   └── hash.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── placeholder.svg
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── EmployeeForm.jsx
│   │   │   │   ├── EmployeeProfileDialog.jsx
│   │   │   │   ├── PayrunForm.jsx
│   │   │   │   ├── PayslipDetailsDialog.jsx
│   │   │   │   ├── PayslipForm.jsx
│   │   │   │   └── ...
│   │   │   ├── layout/
│   │   │   │   ├── dashboard-layout.jsx
│   │   │   │   └── sidebar.jsx
│   │   │   ├── ui/
│   │   │   │   └── (composants UI)
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   └── api.js
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── dashboard.jsx
│   │   │   │   ├── employes.jsx
│   │   │   │   ├── payruns.jsx
│   │   │   │   └── payslips.jsx
│   │   │   ├── super-admin/
│   │   │   │   ├── dashboard.jsx
│   │   │   │   └── entreprises.jsx
│   │   │   ├── caissier/
│   │   │   │   ├── dashboard.jsx
│   │   │   │   └── paiements.jsx
│   │   │   ├── login.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── components.json
│   ├── eslint.config.js
│   └── .gitignore
├── docker-compose.yml
├── gestion salaire.md
├── TODO.md
└── README.md
