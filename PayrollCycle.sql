-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : mer. 08 oct. 2025 à 10:57
-- Version du serveur : 8.0.43-0ubuntu0.24.04.1
-- Version de PHP : 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `salaire_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `PayrollCycle`
--

CREATE TABLE `PayrollCycle` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `period` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('BROUILLON','APPROUVE','CLOS') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BROUILLON',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `entrepriseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `PayrollCycle`
--

INSERT INTO `PayrollCycle` (`id`, `period`, `status`, `createdAt`, `updatedAt`, `entrepriseId`) VALUES
('110561a4-3364-4fb9-8d83-f4c511414e80', 'Mars 2025', 'APPROUVE', '2025-09-30 22:08:06.242', '2025-09-30 22:08:06.242', 'ab32003e-347e-4704-b2bd-d26a94866df1'),
('63479a90-aa8f-45a1-bf1b-f7ab6d9b4c7c', 'Avril 2025', 'CLOS', '2025-10-03 12:28:17.576', '2025-10-07 08:34:06.036', 'ab32003e-347e-4704-b2bd-d26a94866df1'),
('7b2ffc45-8040-4f0a-9d91-b01e4e5ac7df', '2026-01', 'APPROUVE', '2025-09-28 06:14:41.175', '2025-09-28 06:18:21.676', '520b5770-be98-4bb9-9966-ff6d384aef23'),
('84ffe3b2-9932-4bf0-bd49-0dd7f10b1397', '2025-10', 'BROUILLON', '2025-10-08 10:01:48.096', '2025-10-08 10:01:48.096', '9150e005-7da3-4f03-891a-09a2c217b431'),
('a2d68beb-39eb-456c-9f25-d13104903b9e', 'Octobre 2025', 'APPROUVE', '2025-10-07 14:58:18.340', '2025-10-07 14:58:51.056', 'ab32003e-347e-4704-b2bd-d26a94866df1'),
('a965bbfb-9a7e-44db-92a7-e17115e9346b', '2025-12', 'BROUILLON', '2025-09-28 06:14:18.200', '2025-09-28 06:14:18.200', '520b5770-be98-4bb9-9966-ff6d384aef23'),
('b18f28cc-0c29-45cc-90df-7769e411588a', 'Mars 2025', 'APPROUVE', '2025-09-30 22:08:18.499', '2025-09-30 22:08:18.499', 'ab32003e-347e-4704-b2bd-d26a94866df1'),
('d1664aa2-247a-40a1-b0d7-beee3ff7e8cd', '2025-09', 'BROUILLON', '2025-09-28 06:11:58.948', '2025-09-28 06:11:58.948', '520b5770-be98-4bb9-9966-ff6d384aef23'),
('e2a0019a-9083-4568-bf35-a0123dcd73a3', '2026-02', 'BROUILLON', '2025-09-28 06:19:11.946', '2025-09-28 06:19:11.946', '520b5770-be98-4bb9-9966-ff6d384aef23'),
('ea97bd1a-be41-487b-9a65-4813467c8c8d', 'Mars 2025', 'CLOS', '2025-09-29 09:36:35.046', '2025-09-30 22:09:37.761', 'ab32003e-347e-4704-b2bd-d26a94866df1'),
('f2bbf593-4f47-4d58-bfdf-722bdc9812df', '2025-11', 'BROUILLON', '2025-09-28 06:12:52.911', '2025-09-28 06:12:52.911', '520b5770-be98-4bb9-9966-ff6d384aef23');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `PayrollCycle`
--
ALTER TABLE `PayrollCycle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PayrollCycle_entrepriseId_fkey` (`entrepriseId`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `PayrollCycle`
--
ALTER TABLE `PayrollCycle`
  ADD CONSTRAINT `PayrollCycle_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
