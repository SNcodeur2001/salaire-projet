# Auth App

Un modèle d'application d'authentification utilisateur réutilisable avec backend Node.js/Express et frontend React.

## Architecture

- **Backend**: API REST Node.js/Express avec authentification JWT, Prisma ORM et PostgreSQL
- **Frontend**: Application React/Vite avec interface de connexion
- **Base de données**: PostgreSQL
- **Containerisation**: Docker et Docker Compose

Ce modèle fournit une base solide pour ajouter des fonctionnalités métier à votre application.

## Prérequis

- Docker et Docker Compose installés

## Lancement de l'application

1. Clonez ou naviguez vers le répertoire du projet `auth-app`

2. Lancez les services avec Docker Compose :
   ```bash
   docker-compose up --build
   ```

3. Attendez que tous les services démarrent :
   - Base de données PostgreSQL sur le port 5432
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

#### POST /api/auth/register
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

#### POST /api/auth/login
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

#### GET /api/auth/me
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

#### GET /api/employees
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

#### GET /api/employees/:id
**Description**: Récupérer un employé par ID

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN, CAISSIER

**Paramètres**: id (string)

**Réponse de succès (200)**: Objet employé (voir ci-dessus)

**Erreurs**: 404 (non trouvé)

#### POST /api/employees
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

#### PUT /api/employees/:id
**Description**: Mettre à jour un employé

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN

**Paramètres**: id (string)

**Corps de la requête**: Champs à mettre à jour (même structure que création)

**Réponse de succès (200)**: Objet employé mis à jour

#### PATCH /api/employees/:id/activate
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

#### POST /api/employees/filter
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

#### GET /api/entreprises
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

#### GET /api/entreprises/:id
**Description**: Récupérer une entreprise par ID

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN

**Paramètres**: id (string)

**Réponse de succès (200)**: Objet entreprise

#### POST /api/entreprises
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

#### PUT /api/entreprises/:id
**Description**: Mettre à jour une entreprise

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN

**Paramètres**: id (string)

**Corps de la requête**: Champs à mettre à jour

**Réponse de succès (200)**: Objet entreprise mis à jour

#### DELETE /api/entreprises/:id
**Description**: Supprimer une entreprise

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN

**Paramètres**: id (string)

**Réponse de succès (204)**: Aucun contenu





### Cycles de paie (Payruns)

#### GET /api/payruns
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

#### GET /api/payruns/:id
**Description**: Récupérer un cycle de paie par ID

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN, CAISSIER

**Paramètres**: id (string)

**Réponse de succès (200)**: Objet payrun

#### POST /api/payruns
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

#### PUT /api/payruns/:id
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

#### GET /api/payruns/:id/payslips
**Description**: Récupérer les bulletins de paie d'un cycle

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN, CAISSIER

**Paramètres**: id (string)

**Réponse de succès (200)**: Liste de payslips

### Bulletins de paie (Payslips)

#### GET /api/payslips/:id
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

#### PUT /api/payslips/:id
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

#### GET /api/payslips/:id/payments

**Description**: Récupérer les paiements d'un bulletin

**Authentification**: Requise

**Rôles autorisés**: SUPER_ADMIN, ADMIN, CAISSIER

**Paramètres**: id (string)

**Réponse de succès (200)**: Liste de payments







### Paiements (Payments)

#### POST /api/payments
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

#### GET /api/payments/:id
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

#### GET /api/payments/:id/receipt
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

#### GET /api/health
**Description**: Vérifier la santé de l'API

**Authentification**: Non requise

**Réponse de succès (200)**:
```json
{
  "ok": true
}
```

## Endpoints API (résumé)

- `POST /api/auth/register` : Inscription d'un nouvel utilisateur
- `POST /api/auth/login` : Connexion utilisateur
- `GET /api/auth/me` : Informations utilisateur connecté
- `GET /api/employees` : Lister employés
- `GET /api/employees/:id` : Détails employé
- `POST /api/employees` : Créer employé
- `PUT /api/employees/:id` : Mettre à jour employé
- `PATCH /api/employees/:id/activate` : Activer/désactiver employé
- `POST /api/employees/filter` : Filtrer employés
- `GET /api/entreprises` : Lister entreprises
- `GET /api/entreprises/:id` : Détails entreprise
- `POST /api/entreprises` : Créer entreprise
- `PUT /api/entreprises/:id` : Mettre à jour entreprise
- `DELETE /api/entreprises/:id` : Supprimer entreprise
- `GET /api/payruns` : Lister cycles de paie
- `GET /api/payruns/:id` : Détails cycle de paie
- `POST /api/payruns` : Créer cycle de paie
- `PUT /api/payruns/:id` : Mettre à jour statut cycle
- `GET /api/payruns/:id/payslips` : Bulletins d'un cycle
- `GET /api/payslips/:id` : Détails bulletin
- `PUT /api/payslips/:id` : Mettre à jour bulletin
- `GET /api/payslips/:id/payments` : Paiements d'un bulletin
- `POST /api/payments` : Créer paiement
- `GET /api/payments/:id` : Détails paiement
- `GET /api/payments/:id/receipt` : Reçu de paiement
- `GET /api/health` : Santé de l'API

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
npm start
```

Assurez-vous de mettre à jour `VITE_API_BASE_URL` dans `frontend/.env` pour pointer vers `http://localhost:3000`.

## Structure du projet

```
auth-app/
├── backend/
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/auth.js
│   │   ├── middleware/auth.js
│   │   └── utils/hash.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── index.jsx
│   │   ├── App.jsx
│   │   ├── pages/Login.jsx
│   │   └── api.js
│   ├── package.json
│   ├── Dockerfile
│   └── .dockerignore
├── docker-compose.yml
└── README.md# salaire-projet
