# Explication Complète du Projet : Application de Gestion des Salaires

## Vue d'Ensemble

Ce projet est une **application web de gestion des salaires multi-entreprises** développée pour automatiser et simplifier la gestion des employés, des cycles de paie et des bulletins de salaire. Elle remplace les méthodes manuelles (Excel, papier) qui sont sujettes aux erreurs et manquent de traçabilité.

### Objectifs Principaux
- Gérer les employés avec différents types de contrats (journalier, salaire fixe, honoraire)
- Générer des cycles de paie (pay runs) et des bulletins de salaire (payslips)
- Suivre les paiements partiels ou totaux avec génération de reçus PDF
- Fournir un dashboard de suivi avec indicateurs clés et graphiques
- Permettre la gestion multi-entreprises avec rôles utilisateurs stricts

## Architecture Technique

### Backend
- **Technologies** : Node.js avec TypeScript
- **Framework** : Express.js pour l'API REST
- **Base de données** : MySQL avec Prisma ORM
- **Authentification** : JWT (JSON Web Tokens) avec bcrypt pour le hashage des mots de passe
- **Structure** :
  - `controllers/` : Logique métier des endpoints
  - `services/` : Services métier
  - `repositories/` : Accès aux données
  - `routes/` : Définition des routes API
  - `middleware/` : Authentification et autorisations

### Frontend
- **Technologies** : React 18 avec Vite
- **Styling** : Tailwind CSS avec composants shadcn/ui
- **Routing** : React Router DOM
- **State Management** : Context API pour l'authentification
- **HTTP Client** : Axios via un client API personnalisé
- **Data Fetching** : TanStack Query (React Query)
- **Structure** :
  - `components/` : Composants réutilisables (UI, layouts, forms)
  - `pages/` : Pages par rôle utilisateur
  - `contexts/` : Gestion d'état globale
  - `hooks/` : Hooks personnalisés
  - `lib/` : Utilitaires et configuration API

### Infrastructure
- **Containerisation** : Docker et Docker Compose
- **Base de données** : MySQL 8.0
- **Déploiement** : Configuration prête pour production

## Modèle de Données (Prisma Schema)

### Entités Principales

#### User (Utilisateur)
- **Champs** : id, email, password (hashé), role, isActive, entrepriseId
- **Rôles** : SUPER_ADMIN, ADMIN, CAISSIER, EMPLOYE
- **Relations** : Appartient à une entreprise (sauf SUPER_ADMIN), peut être lié à un employé

#### Entreprise
- **Champs** : id, name, logo, address, currency, periodType
- **Relations** : Contient des utilisateurs, employés, cycles de paie

#### Employee (Employé)
- **Champs** : id, firstName, lastName, poste, contract (JOURNALIER/FIXE/HONORAIRE), baseSalary, isActive
- **Relations** : Appartient à une entreprise, peut être lié à un utilisateur, possède des bulletins

#### PayrollCycle (Cycle de Paie)
- **Champs** : id, period, status (BROUILLON/APPROUVE/CLOS)
- **Relations** : Appartient à une entreprise, contient des bulletins

#### Payslip (Bulletin de Salaire)
- **Champs** : id, grossSalary, deductions, netSalary, status (EN_ATTENTE/PARTIEL/PAYE)
- **Relations** : Appartient à un employé et un cycle, contient des paiements

#### Payment (Paiement)
- **Champs** : id, amount, mode, paymentDate, receiptUrl
- **Relations** : Appartient à un bulletin, effectué par un caissier

## Rôles et Permissions (RBAC)

### Super-Administrateur
- Gère toutes les entreprises (création, modification, suppression)
- Crée des comptes utilisateurs pour toutes les entreprises
- Accès complet à toutes les fonctionnalités

### Administrateur (Entreprise)
- Gère son entreprise (paramètres, logo, devise)
- Gestion complète des employés (CRUD, activation/désactivation)
- Lance et approuve les cycles de paie
- Modifie les bulletins tant que le cycle est en brouillon
- Accès aux dashboards et rapports

### Caissier (Entreprise)
- Enregistre les paiements (partiels ou totaux)
- Génère les reçus PDF automatiquement
- Consulte les bulletins et listes de paiements
- Accès limité aux fonctionnalités de paiement

### Employé (Optionnel - Phase 2)
- Accès à ses propres bulletins
- Réception par email (futur)

## Fonctionnalités Clés

### 1. Gestion Multi-Entreprises
- Isolation complète des données par entreprise
- Paramétrage individuel (devise, période, logo)
- Gestion centralisée par super-admin

### 2. Gestion des Employés
- CRUD complet avec validation
- Types de contrats flexibles
- Activation/désactivation (vacataires)
- Filtrage avancé (statut, poste, contrat)

### 3. Cycles de Paie (Pay Runs)
- Création par période (mensuelle/hebdomadaire/journalière)
- Génération automatique des bulletins
- Workflow d'approbation (brouillon → approuvé → clos)
- Calcul automatique pour contrats journaliers

### 4. Bulletins de Paie (Payslips)
- Calcul salaire brut, déductions, net
- Modification possible en brouillon
- Verrouillage après approbation
- Export PDF individuel ou en lot

### 5. Gestion des Paiements
- Paiements partiels ou totaux
- Modes multiples (espèces, virement, mobile money)
- Génération automatique de reçus PDF
- Suivi du statut des bulletins

### 6. Génération de Documents PDF
- Reçus de paiement
- Bulletins individuels
- Listes de paiements par période
- Listes d'émargement

### 7. Dashboard et KPIs
- Masse salariale totale
- Montant payé vs restant
- Nombre d'employés actifs
- Graphiques d'évolution (6 derniers mois)
- Liste des prochains paiements

## API REST

### Endpoints Principaux
- **Auth** : `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Entreprises** : `/api/entreprises` (CRUD)
- **Employés** : `/api/employees` (CRUD + filtres)
- **Cycles de Paie** : `/api/payruns` (CRUD + génération bulletins)
- **Bulletins** : `/api/payslips` (CRUD + export PDF)
- **Paiements** : `/api/payments` (CRUD + génération reçus)

### Sécurité
- Authentification JWT obligatoire (sauf login/register)
- Autorisations basées sur les rôles
- Validation des données d'entrée
- Hashage des mots de passe

## Flux de Travail Typique

1. **Super-Admin** crée une entreprise et des comptes utilisateurs
2. **Admin** configure l'entreprise et ajoute les employés
3. **Admin** crée un cycle de paie et génère les bulletins
4. **Admin** révise et approuve les bulletins
5. **Caissier** enregistre les paiements et génère les reçus
6. Tous les rôles consultent les dashboards et rapports

## Technologies et Dépendances

### Backend (package.json)
- **Runtime** : Node.js
- **Langage** : TypeScript
- **Web Framework** : Express.js
- **ORM** : Prisma (@prisma/client)
- **Auth** : jsonwebtoken, bcryptjs
- **Utils** : cors, dotenv

### Frontend (package.json)
- **Build Tool** : Vite
- **UI Framework** : React 18
- **Routing** : react-router-dom
- **Styling** : Tailwind CSS
- **Components** : Radix UI (via shadcn/ui)
- **Forms** : react-hook-form + zod
- **Data Fetching** : @tanstack/react-query
- **Charts** : recharts
- **Icons** : lucide-react

## Structure du Projet

```
projet-salaires/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   └── App.jsx
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Lancement et Déploiement

### Avec Docker (Recommandé)
```bash
docker-compose up --build
```
- Backend : http://localhost:3000
- Frontend : http://localhost:3001
- Base de données : MySQL sur port 3306

### Développement Local
- Backend : `npm run dev` (avec migrations Prisma)
- Frontend : `npm run dev`

## Points Forts de l'Architecture

1. **Séparation claire** : Backend/Frontend indépendants
2. **Sécurité robuste** : RBAC, JWT, validation
3. **Évolutivité** : Structure modulaire, repository pattern
4. **UX moderne** : Interface React avec composants réutilisables
5. **Performance** : Pagination, cache, requêtes optimisées
6. **Maintenabilité** : TypeScript, tests, documentation

## Évolutions Futures

- Intégration bancaire automatisée
- Déclarations sociales/fiscales
- Gestion congés/absences
- Application mobile native
- Notifications email/SMS
- API pour intégrations tierces

Cette application fournit une solution complète et professionnelle pour la gestion des salaires, répondant aux besoins des PME africaines avec une architecture moderne et sécurisée.