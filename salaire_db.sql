-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : mer. 08 oct. 2025 à 11:07
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
-- Structure de la table `Attendance`
--

CREATE TABLE `Attendance` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `clockIn` datetime(3) DEFAULT NULL,
  `clockOut` datetime(3) DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PRESENT',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `markedById` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Attendance`
--

INSERT INTO `Attendance` (`id`, `employeeId`, `date`, `clockIn`, `clockOut`, `status`, `createdAt`, `updatedAt`, `markedById`) VALUES
('05760723-3183-46c3-845e-4ed7aaace567', 'fbceb27d-2bbd-4fe6-a78c-66a6d8f9ec0b', '2025-10-03 00:00:00.000', '2025-10-03 12:18:14.590', '2025-10-03 12:18:17.964', 'ABSENT', '2025-10-03 12:18:02.790', '2025-10-03 12:18:17.975', 'd7a4af02-e247-4f90-b5f0-831c202949c9'),
('25ab5f0d-16c5-42f4-9752-ad79eb4ce343', 'ccaefd2e-3943-40bc-95c2-af04905370d6', '2025-10-03 00:00:00.000', '2025-10-03 12:18:12.826', '2025-10-03 12:18:13.615', 'ABSENT', '2025-10-03 12:18:02.790', '2025-10-03 12:18:13.622', 'd7a4af02-e247-4f90-b5f0-831c202949c9'),
('7c5ac89d-b772-4023-b75e-d31ec9139708', '1d6edddb-74a9-44b9-9683-8223e645450d', '2025-10-07 00:00:00.000', '2025-10-07 17:17:27.470', '2025-10-07 17:17:29.152', 'PRESENT', '2025-10-07 17:17:27.471', '2025-10-07 17:17:29.164', 'b52d45dc-0e78-484d-b164-45d0442b7fd4'),
('85c2dfbb-bd63-46cb-af28-5bc2bcf7bd36', 'f5f44231-b38c-4d1f-aa97-2d6d560521d6', '2025-10-08 00:00:00.000', '2025-10-08 09:06:13.763', '2025-10-08 14:06:23.225', 'PRESENT', '2025-10-08 09:06:13.763', '2025-10-08 09:06:23.234', '88626513-8c4e-494f-a307-772a97837447'),
('b3b0053b-06b6-41d7-8d2c-59942fa5cab8', '6ab49d38-e744-422d-89c5-d4a7754bfe5c', '2025-10-03 00:00:00.000', '2025-10-03 12:56:59.388', '2025-10-03 12:57:02.504', 'ABSENT', '2025-10-03 12:56:51.858', '2025-10-03 12:57:02.536', 'd7a4af02-e247-4f90-b5f0-831c202949c9'),
('b6217f04-64df-46b6-9f55-1747420b14f7', '8c5eb263-17a4-4f67-bce0-901ce9d0f5c7', '2025-10-07 00:00:00.000', '2025-10-07 08:28:44.489', NULL, 'PRESENT', '2025-10-07 08:28:44.490', '2025-10-07 08:28:44.490', 'b52d45dc-0e78-484d-b164-45d0442b7fd4'),
('bdaa3fe3-a5d2-46ea-b36d-a97fd3b66200', '6ab49d38-e744-422d-89c5-d4a7754bfe5c', '2025-10-07 00:00:00.000', '2025-10-07 08:28:03.392', '2025-10-07 12:18:30.946', 'PRESENT', '2025-10-07 08:28:03.393', '2025-10-07 12:18:30.969', 'b52d45dc-0e78-484d-b164-45d0442b7fd4'),
('c9751fa8-28f3-4f31-98ac-74360ecf25c2', '8c5eb263-17a4-4f67-bce0-901ce9d0f5c7', '2025-10-03 00:00:00.000', '2025-10-03 12:18:09.270', '2025-10-03 12:18:11.502', 'ABSENT', '2025-10-03 12:18:02.759', '2025-10-03 12:18:11.512', 'd7a4af02-e247-4f90-b5f0-831c202949c9'),
('ce91277d-e261-4f58-b53f-0de16253e5aa', 'd9c030a8-e3eb-4ab3-88c1-7f6f8795be8a', '2025-10-06 00:00:00.000', '2025-10-06 12:10:14.502', '2025-10-06 12:10:20.325', 'PRESENT', '2025-10-06 12:10:14.502', '2025-10-06 12:10:20.326', NULL),
('d3577670-9103-4535-90bb-c2009147ecc3', 'ccaefd2e-3943-40bc-95c2-af04905370d6', '2025-10-07 00:00:00.000', '2025-10-07 08:28:51.598', '2025-10-07 17:15:05.889', 'PRESENT', '2025-10-07 08:28:51.599', '2025-10-07 17:15:05.902', 'd7a4af02-e247-4f90-b5f0-831c202949c9'),
('d366c334-fd8f-4288-b6fd-71dce96da1fb', 'c56fbb0e-d619-42f6-a64c-49b5b8f33880', '2025-10-08 00:00:00.000', '2025-10-08 09:06:04.067', '2025-10-08 09:06:05.846', 'PRESENT', '2025-10-08 09:06:04.068', '2025-10-08 09:06:05.854', '88626513-8c4e-494f-a307-772a97837447'),
('d6ef4690-456f-4c6f-b3be-7a54d8c4d5ac', 'd9c030a8-e3eb-4ab3-88c1-7f6f8795be8a', '2025-10-07 00:00:00.000', '2025-10-07 08:28:55.805', NULL, 'PRESENT', '2025-10-07 08:28:55.805', '2025-10-07 08:28:55.805', 'b52d45dc-0e78-484d-b164-45d0442b7fd4'),
('db9516f6-4985-42ca-a377-daaaf584e37b', 'fbceb27d-2bbd-4fe6-a78c-66a6d8f9ec0b', '2025-10-07 00:00:00.000', '2025-10-07 08:28:56.777', NULL, 'PRESENT', '2025-10-07 08:28:56.778', '2025-10-07 08:28:56.778', 'b52d45dc-0e78-484d-b164-45d0442b7fd4'),
('f0b17bd0-860d-4711-a50b-b44ae04964ad', '0bdb2bc1-bc90-4f1a-8a45-fcae20cf5d92', '2025-10-08 00:00:00.000', '2025-10-08 09:05:53.585', '2025-10-08 09:05:55.023', 'PRESENT', '2025-10-08 09:05:53.586', '2025-10-08 09:05:55.032', '88626513-8c4e-494f-a307-772a97837447'),
('f3ca70db-f534-4694-8a53-6a3e235bc997', '6ab49d38-e744-422d-89c5-d4a7754bfe5c', '2025-10-06 00:00:00.000', '2025-10-06 11:52:32.082', NULL, 'PRESENT', '2025-10-06 11:52:32.083', '2025-10-06 11:52:32.083', 'b52d45dc-0e78-484d-b164-45d0442b7fd4'),
('faadb7fb-9879-4d32-bdc7-2be458ce0879', '3b6a73c5-132f-4335-a241-6eee40a1d3dc', '2025-10-08 00:00:00.000', '2025-10-08 09:05:57.865', '2025-10-08 09:05:58.574', 'PRESENT', '2025-10-08 09:05:57.866', '2025-10-08 09:05:58.582', '88626513-8c4e-494f-a307-772a97837447');

-- --------------------------------------------------------

--
-- Structure de la table `Employee`
--

CREATE TABLE `Employee` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `poste` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contract` enum('JOURNALIER','FIXE','HONORAIRE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `baseSalary` double NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `entrepriseId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Employee`
--

INSERT INTO `Employee` (`id`, `firstName`, `lastName`, `poste`, `contract`, `baseSalary`, `isActive`, `createdAt`, `updatedAt`, `entrepriseId`, `userId`) VALUES
('0bdb2bc1-bc90-4f1a-8a45-fcae20cf5d92', 'Pape ', 'Niang', 'Chef de projet', 'FIXE', 3000, 1, '2025-10-08 08:51:20.635', '2025-10-08 08:51:20.635', '9150e005-7da3-4f03-891a-09a2c217b431', '2e7de80a-946a-4410-a6ed-e32a30e714a9'),
('11615adc-d4ed-44b0-90df-8f446da3d0b4', 'pathe', 'string', 'string', 'JOURNALIER', 150000, 1, '2025-09-28 14:15:39.820', '2025-09-28 14:16:53.426', '44149bdd-be6c-4fd1-9ee0-cf999ba7993d', NULL),
('1d6edddb-74a9-44b9-9683-8223e645450d', 'john', 'doe', 'Développeur', 'HONORAIRE', 500, 1, '2025-10-07 14:55:40.433', '2025-10-07 14:55:40.433', 'ab32003e-347e-4704-b2bd-d26a94866df1', '22988a4a-6862-4de7-80c8-afc9802109ca'),
('336ab6e5-a779-4e4d-a627-9249f027f1a8', 'zafe', 'seck', 'Développeur', 'FIXE', 3000, 1, '2025-10-07 14:50:49.472', '2025-10-07 14:50:49.472', 'ab32003e-347e-4704-b2bd-d26a94866df1', 'a93a3751-0b7a-4625-b17e-0321ef2ac2d3'),
('3b6a73c5-132f-4335-a241-6eee40a1d3dc', 'Fatou', 'Niang', 'Caissière', 'FIXE', 4000, 1, '2025-10-08 08:56:59.833', '2025-10-08 08:56:59.833', '9150e005-7da3-4f03-891a-09a2c217b431', '5340d454-2be9-4f8b-9b34-35e61093ce07'),
('5ed5f7a2-204f-4282-b9f7-be4802333da5', 'string', 'string', 'string', 'JOURNALIER', 150000, 1, '2025-09-28 14:15:38.947', '2025-09-28 14:15:38.947', '44149bdd-be6c-4fd1-9ee0-cf999ba7993d', NULL),
('6586ec9e-29e6-40f4-933e-b5af4d41e559', 'string', 'string', 'string', 'JOURNALIER', 150000, 1, '2025-09-29 09:30:31.390', '2025-09-29 09:30:31.390', '44149bdd-be6c-4fd1-9ee0-cf999ba7993d', NULL),
('6ab49d38-e744-422d-89c5-d4a7754bfe5c', 'Sems ', 'Ndiaye', 'Développeur', 'FIXE', 5000, 1, '2025-10-03 12:33:36.248', '2025-10-03 12:33:36.248', 'ab32003e-347e-4704-b2bd-d26a94866df1', NULL),
('8c5eb263-17a4-4f67-bce0-901ce9d0f5c7', 'Bamba', 'Ndiaye', 'Developpeur', 'JOURNALIER', 4000, 1, '2025-09-29 11:46:03.003', '2025-09-29 11:46:03.003', 'ab32003e-347e-4704-b2bd-d26a94866df1', NULL),
('b98b47cc-d7ff-4114-8950-e46c3e78ad05', 'string', 'string', 'string', 'JOURNALIER', 150000, 1, '2025-09-28 14:14:51.879', '2025-09-28 14:14:51.879', '44149bdd-be6c-4fd1-9ee0-cf999ba7993d', NULL),
('c56fbb0e-d619-42f6-a64c-49b5b8f33880', 'Naby', 'Niang', 'Chef de projet', 'JOURNALIER', 50, 1, '2025-10-08 08:50:35.158', '2025-10-08 08:50:35.158', '9150e005-7da3-4f03-891a-09a2c217b431', '8f62cb23-26cd-44e3-aaa4-bfdafc0e44fb'),
('ccaefd2e-3943-40bc-95c2-af04905370d6', 'kassongo', 'Teuw', 'dev', 'JOURNALIER', 4000, 1, '2025-09-29 09:30:40.091', '2025-09-29 09:30:40.091', 'ab32003e-347e-4704-b2bd-d26a94866df1', NULL),
('d9c030a8-e3eb-4ab3-88c1-7f6f8795be8a', 'Test', 'Employee', 'Développeur', 'FIXE', 3000, 1, '2025-10-03 15:42:17.857', '2025-10-03 15:42:17.857', 'ab32003e-347e-4704-b2bd-d26a94866df1', 'efa0468a-5cf3-4f84-a3a5-3b607dc966d1'),
('f29688eb-1cb3-4189-99f1-56439364d25e', 'Jane', 'Doe', 'Developer', 'FIXE', 60000, 1, '2025-09-28 06:09:08.158', '2025-09-28 06:12:27.387', '520b5770-be98-4bb9-9966-ff6d384aef23', NULL),
('f5f44231-b38c-4d1f-aa97-2d6d560521d6', 'Aicha', 'Diagne', 'Designer', 'HONORAIRE', 20, 1, '2025-10-08 08:52:24.450', '2025-10-08 13:08:09.000', '9150e005-7da3-4f03-891a-09a2c217b431', '1e9be92e-bbe3-4468-bfaa-b958708e03c1'),
('fbceb27d-2bbd-4fe6-a78c-66a6d8f9ec0b', 'Mapathé', 'Ndiaye', 'Developpeur', 'FIXE', 9000, 1, '2025-09-29 12:16:26.464', '2025-09-29 12:16:26.464', 'ab32003e-347e-4704-b2bd-d26a94866df1', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `Entreprise`
--

CREATE TABLE `Entreprise` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currency` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `periodType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Entreprise`
--

INSERT INTO `Entreprise` (`id`, `name`, `logo`, `address`, `currency`, `periodType`, `createdAt`, `updatedAt`, `color`) VALUES
('44149bdd-be6c-4fd1-9ee0-cf999ba7993d', 'Another Company', NULL, '', 'EUR', 'mensuelle', '2025-09-28 06:21:03.166', '2025-09-30 00:27:25.050', '#BB86FC'),
('520b5770-be98-4bb9-9966-ff6d384aef23', 'Test Company', NULL, '', 'XAF', 'mensuelle', '2025-09-28 06:07:54.509', '2025-09-30 00:27:32.928', '#BB86FC'),
('757bd567-b08a-4b2e-b720-97e739bafb30', 'SNTECH', '/home/mapath-ndiaye/Images/Captures d’écran/photo.png', 'Dakar', 'XOF', 'mensuelle', '2025-09-30 00:15:43.679', '2025-09-30 00:15:43.679', '#BB86FC'),
('9150e005-7da3-4f03-891a-09a2c217b431', 'breukh', '/home/mapath-ndiaye/Images/Captures d’écran/photo.png', 'Dakar', 'EUR', 'mensuelle', '2025-10-08 08:45:44.136', '2025-10-08 08:45:44.136', '#BB86FC'),
('ab32003e-347e-4704-b2bd-d26a94866df1', 'Mon entreprise ', NULL, '13500', 'XOF', 'hebdomadaire', '2025-09-28 18:38:42.265', '2025-09-30 00:27:50.769', '#BB86FC'),
('d8eedf50-3f88-4f33-8a17-6b816e9a4c85', 'MAPATHE', NULL, 'GT', 'XOF', 'journalière', '2025-09-29 07:16:15.730', '2025-09-30 00:27:57.917', '#BB86FC');

-- --------------------------------------------------------

--
-- Structure de la table `Payment`
--

CREATE TABLE `Payment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `mode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `paymentDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `receiptUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payslipId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caissierId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Payment`
--

INSERT INTO `Payment` (`id`, `amount`, `mode`, `paymentDate`, `receiptUrl`, `payslipId`, `caissierId`) VALUES
('0a4b5919-729f-4f5b-9c6d-39dd7a7703b1', 30000, 'ESPECES', '2025-09-28 06:16:06.418', NULL, '5918854f-d73b-4fd6-96c5-5b1de07bb1c1', '8dac9755-4d4d-4708-a3c9-96e128541def'),
('1a2d6ab9-3525-4c87-99bb-6f85aad9c999', 30000, 'ESPECES', '2025-09-28 06:20:08.554', NULL, 'e93b7308-ed89-4350-8460-c8e27b8415fa', 'ec043846-0c86-4f2b-9364-f6c724374333'),
('4634794e-6a5e-4310-b474-5fc53e086a40', 9000, 'ESPECES', '2025-10-07 09:03:44.709', NULL, '12fc262e-9068-4b33-b8bd-3892152c2bf0', 'ef267fd9-67ef-43f4-9adb-6665385a5206'),
('51a0782b-8f7d-49ca-ba77-e11d7a9a39f0', 4000, 'VIREMENT', '2025-10-01 08:39:19.947', NULL, '7a79217a-23f5-4012-8a83-cd48317a0936', 'ef267fd9-67ef-43f4-9adb-6665385a5206'),
('5cf272c0-29aa-47ed-9b6f-7360f336de40', 4000, 'ESPECES', '2025-10-07 09:03:29.117', NULL, '12fc262e-9068-4b33-b8bd-3892152c2bf0', 'ef267fd9-67ef-43f4-9adb-6665385a5206'),
('89a1395e-e913-40e3-b4a3-515f1256852b', 100, 'ESPECES', '2025-10-08 10:29:39.958', NULL, '243faffd-bcc0-4afe-ae20-da29013b322c', '5340d454-2be9-4f8b-9b34-35e61093ce07'),
('8a03fcc9-3488-4d3c-af01-9a6941e26b48', 30000, 'VIREMENT', '2025-09-28 06:20:42.332', NULL, 'e93b7308-ed89-4350-8460-c8e27b8415fa', 'ec043846-0c86-4f2b-9364-f6c724374333'),
('99b3b7ac-e7f1-4979-8225-be813a99a37f', 4000, 'ESPECES', '2025-10-07 10:53:28.845', NULL, 'ca0475d6-c2ca-4959-adb4-e94b0cf6416c', 'ef267fd9-67ef-43f4-9adb-6665385a5206'),
('a23209c7-71d7-481f-9fdd-570e33d7a2d6', 100.053, 'ESPECES', '2025-10-08 10:30:21.192', NULL, '243faffd-bcc0-4afe-ae20-da29013b322c', '5340d454-2be9-4f8b-9b34-35e61093ce07'),
('a5ac4d63-4d56-4e97-ae24-59eef5950bbf', 5000, 'CHEQUE', '2025-10-07 17:16:03.496', NULL, '65f5fbdf-4b6f-4d06-a415-87d649f6367f', 'ef267fd9-67ef-43f4-9adb-6665385a5206'),
('a98aee23-d477-4b9a-a511-72b1a9c332a5', 500, 'ESPECES', '2025-10-07 14:59:23.193', NULL, '7b307dc2-1ca6-4bb4-9b7b-19a23ff2089a', 'ef267fd9-67ef-43f4-9adb-6665385a5206'),
('b462e746-28b9-49ae-ac36-848ac32eb4b1', 9000, 'VIREMENT', '2025-09-30 22:48:21.612', NULL, '14e9a3e1-9d3b-4a80-bffa-512ae31ae926', 'ef267fd9-67ef-43f4-9adb-6665385a5206'),
('bc18bd4d-7449-48f0-9470-8ff522ba66f9', 25000, 'VIREMENT', '2025-09-28 06:16:19.046', NULL, '5918854f-d73b-4fd6-96c5-5b1de07bb1c1', '8dac9755-4d4d-4708-a3c9-96e128541def'),
('c31138f2-deb1-4888-95b5-e203573fe280', 4000, 'ESPECES', '2025-10-03 12:29:20.205', NULL, 'c0aab8f4-6861-4b12-8fca-ba60277f9d9f', 'ef267fd9-67ef-43f4-9adb-6665385a5206'),
('cbf7e978-6aaa-4940-b297-066a13afca91', 4000, 'VIREMENT', '2025-10-03 12:35:07.365', NULL, '513e6de2-a4f0-4943-ab51-b197e25d9192', 'ef267fd9-67ef-43f4-9adb-6665385a5206');

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

-- --------------------------------------------------------

--
-- Structure de la table `Payslip`
--

CREATE TABLE `Payslip` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grossSalary` double NOT NULL,
  `deductions` double NOT NULL,
  `netSalary` double NOT NULL,
  `status` enum('EN_ATTENTE','PARTIEL','PAYE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EN_ATTENTE',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cycleId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `daysWorked` int DEFAULT NULL,
  `hoursWorked` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Payslip`
--

INSERT INTO `Payslip` (`id`, `grossSalary`, `deductions`, `netSalary`, `status`, `createdAt`, `updatedAt`, `employeeId`, `cycleId`, `daysWorked`, `hoursWorked`) VALUES
('10237117-0a02-478f-b53c-02dbfd042b31', 3000, 0, 3000, 'EN_ATTENTE', '2025-10-08 10:01:48.106', '2025-10-08 10:01:48.106', '0bdb2bc1-bc90-4f1a-8a45-fcae20cf5d92', '84ffe3b2-9932-4bf0-bd49-0dd7f10b1397', NULL, NULL),
('12fc262e-9068-4b33-b8bd-3892152c2bf0', 9000, 0, 9000, 'PAYE', '2025-09-30 22:08:06.282', '2025-10-07 09:03:44.721', 'fbceb27d-2bbd-4fe6-a78c-66a6d8f9ec0b', '110561a4-3364-4fb9-8d83-f4c511414e80', NULL, NULL),
('14e9a3e1-9d3b-4a80-bffa-512ae31ae926', 9000, 0, 9000, 'PAYE', '2025-09-30 22:08:18.519', '2025-09-30 22:48:21.632', 'fbceb27d-2bbd-4fe6-a78c-66a6d8f9ec0b', 'b18f28cc-0c29-45cc-90df-7769e411588a', NULL, NULL),
('243faffd-bcc0-4afe-ae20-da29013b322c', 100.0525666666667, 0, 100.0525666666667, 'PAYE', '2025-10-08 10:01:48.131', '2025-10-08 10:30:21.209', 'f5f44231-b38c-4d1f-aa97-2d6d560521d6', '84ffe3b2-9932-4bf0-bd49-0dd7f10b1397', NULL, 5.002628333333333),
('513e6de2-a4f0-4943-ab51-b197e25d9192', 4000, 0, 4000, 'PAYE', '2025-09-29 09:36:35.091', '2025-10-03 12:35:07.382', 'ccaefd2e-3943-40bc-95c2-af04905370d6', 'ea97bd1a-be41-487b-9a65-4813467c8c8d', NULL, NULL),
('5918854f-d73b-4fd6-96c5-5b1de07bb1c1', 60000, 5000, 55000, 'PAYE', '2025-09-28 06:14:41.199', '2025-09-28 06:16:19.062', 'f29688eb-1cb3-4189-99f1-56439364d25e', '7b2ffc45-8040-4f0a-9d91-b01e4e5ac7df', NULL, NULL),
('5bb9dfbc-16e5-414b-a70e-17b3e65ac5c1', 4000, 0, 4000, 'EN_ATTENTE', '2025-09-30 22:08:06.257', '2025-09-30 22:08:06.257', '8c5eb263-17a4-4f67-bce0-901ce9d0f5c7', '110561a4-3364-4fb9-8d83-f4c511414e80', NULL, NULL),
('65f5fbdf-4b6f-4d06-a415-87d649f6367f', 5000, 0, 5000, 'PAYE', '2025-10-07 14:58:18.377', '2025-10-07 17:16:03.521', '6ab49d38-e744-422d-89c5-d4a7754bfe5c', 'a2d68beb-39eb-456c-9f25-d13104903b9e', NULL, NULL),
('7a79217a-23f5-4012-8a83-cd48317a0936', 4000, 0, 4000, 'PAYE', '2025-09-30 22:08:18.513', '2025-10-01 08:39:19.970', 'ccaefd2e-3943-40bc-95c2-af04905370d6', 'b18f28cc-0c29-45cc-90df-7769e411588a', NULL, NULL),
('7b307dc2-1ca6-4bb4-9b7b-19a23ff2089a', 0, 0, 0, 'PAYE', '2025-10-07 14:58:18.356', '2025-10-07 14:59:23.221', '1d6edddb-74a9-44b9-9683-8223e645450d', 'a2d68beb-39eb-456c-9f25-d13104903b9e', NULL, 0),
('c0aab8f4-6861-4b12-8fca-ba60277f9d9f', 4000, 0, 4000, 'PAYE', '2025-09-30 22:08:18.508', '2025-10-03 12:29:20.228', '8c5eb263-17a4-4f67-bce0-901ce9d0f5c7', 'b18f28cc-0c29-45cc-90df-7769e411588a', NULL, NULL),
('ca0475d6-c2ca-4959-adb4-e94b0cf6416c', 4000, 0, 4000, 'PAYE', '2025-09-30 22:08:06.271', '2025-10-07 10:53:28.888', 'ccaefd2e-3943-40bc-95c2-af04905370d6', '110561a4-3364-4fb9-8d83-f4c511414e80', NULL, NULL),
('e1de9434-822b-4da4-98d6-e42489dd7c1e', 4000, 0, 4000, 'EN_ATTENTE', '2025-10-08 10:01:48.114', '2025-10-08 10:01:48.114', '3b6a73c5-132f-4335-a241-6eee40a1d3dc', '84ffe3b2-9932-4bf0-bd49-0dd7f10b1397', NULL, NULL),
('e3b4dc43-b2e5-4482-bbf0-3b9d160c6849', 1550, 0, 1550, 'EN_ATTENTE', '2025-10-08 10:01:48.120', '2025-10-08 10:01:48.120', 'c56fbb0e-d619-42f6-a64c-49b5b8f33880', '84ffe3b2-9932-4bf0-bd49-0dd7f10b1397', 31, NULL),
('e93b7308-ed89-4350-8460-c8e27b8415fa', 60000, 0, 60000, 'PAYE', '2025-09-28 06:19:11.965', '2025-09-28 06:20:42.344', 'f29688eb-1cb3-4189-99f1-56439364d25e', 'e2a0019a-9083-4568-bf35-a0123dcd73a3', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `User`
--

CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('SUPER_ADMIN','ADMIN','CAISSIER','VIGILE','EMPLOYE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EMPLOYE',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `entrepriseId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `User`
--

INSERT INTO `User` (`id`, `email`, `password`, `role`, `createdAt`, `entrepriseId`, `isActive`, `updatedAt`) VALUES
('1e9be92e-bbe3-4468-bfaa-b958708e03c1', 'aicha@gmail.com', '$2a$10$5BX5eNQMfI6a5SnEsPxS5.BPQoPWv/EETVDF9cXBSQ5ebBMzOCfj6', 'EMPLOYE', '2025-10-08 08:52:24.442', '9150e005-7da3-4f03-891a-09a2c217b431', 1, '2025-10-08 08:52:24.442'),
('1ea32c9a-434d-44cb-bd72-7df7d6b1acc5', 'superadmin@payrollpro.com', '$2a$10$d8ztBproTGJkmD.VtkwqqOTdEMsQTY.wuEVPH7bbq4VzXbL/roYyK', 'SUPER_ADMIN', '2025-09-29 06:51:57.916', NULL, 1, '2025-09-29 06:51:57.916'),
('22988a4a-6862-4de7-80c8-afc9802109ca', 'john@gmail.com', '$2a$10$FFF5M.G3tXq6DV5xSnb89.NnyD.nm4aa1/QQX9oIsAkNhEZv74INW', 'EMPLOYE', '2025-10-07 14:55:40.424', 'ab32003e-347e-4704-b2bd-d26a94866df1', 1, '2025-10-07 14:55:40.424'),
('2e7de80a-946a-4410-a6ed-e32a30e714a9', 'pape@gmail.com', '$2a$10$j.uT2iXGWGRnTnH55npdKuVzU1rIyf4lpyhOUXNH8U.J4cb9H1A8q', 'EMPLOYE', '2025-10-08 08:51:20.628', '9150e005-7da3-4f03-891a-09a2c217b431', 1, '2025-10-08 08:51:20.628'),
('31d3709b-8e9d-4cdd-8299-2eef29ef54c6', 'employe@test.com', '$2a$10$EEpToo5G59.DYzh6a7dZk.1SYmRfDOy85lvhrQ6XWVkIyt6EX0vy.', 'EMPLOYE', '2025-09-28 06:20:54.653', '520b5770-be98-4bb9-9966-ff6d384aef23', 1, '2025-09-28 06:20:54.653'),
('5340d454-2be9-4f8b-9b34-35e61093ce07', 'fatou@gmail.com', '$2a$10$SPnjpTcHtPmCduxSLUIJUu3QPz9q0mne07Sus10VOGofefSpMYQPW', 'CAISSIER', '2025-10-08 08:56:59.822', '9150e005-7da3-4f03-891a-09a2c217b431', 1, '2025-10-08 08:56:59.822'),
('536070e4-316b-43dc-9928-bc6f5a2d4a1e', 'amadou@gmail.com', '$2a$10$rcBBXi/LD2vFkUMK3aWSluVjVCBacaa5jk5lQBSraJRtqOdusZgLC', 'ADMIN', '2025-09-30 00:15:43.843', '757bd567-b08a-4b2e-b720-97e739bafb30', 1, '2025-09-30 00:15:43.843'),
('81ff54f8-460e-4685-ad88-a07ff5d41788', 'abdou@gmail.com', '$2a$10$Ik85CxJZ5q0pXB.cERQXZefY5H6hGLgRKpGzOSZ2wl91z3BTFP08O', 'ADMIN', '2025-09-29 07:20:19.063', NULL, 1, '2025-09-29 07:20:19.063'),
('88626513-8c4e-494f-a307-772a97837447', 'vigile1@gmail.com', '$2a$10$NAI4Wx.JVQN89qFJAegJ6.VL5zuXZ1Xp54.ogWdySu18.9PJ8RNwC', 'VIGILE', '2025-10-08 09:03:30.514', '9150e005-7da3-4f03-891a-09a2c217b431', 1, '2025-10-08 09:03:30.514'),
('8dac9755-4d4d-4708-a3c9-96e128541def', 'admin@example.com', '$2a$10$Yp02Vj0mSl3xIICbyq4YPeVECp2F.fSGPxu034EV/KhrJl1q4igwa', 'SUPER_ADMIN', '2025-09-28 06:06:24.094', NULL, 1, '2025-09-28 06:06:24.094'),
('8f62cb23-26cd-44e3-aaa4-bfdafc0e44fb', 'naby@gmail.com', '$2a$10$FelhduJT4tlFeNnitKeVme.u9Ft5sWp6iALa9LAPvuqEoq2bDe5g.', 'EMPLOYE', '2025-10-08 08:50:35.150', '9150e005-7da3-4f03-891a-09a2c217b431', 1, '2025-10-08 08:50:35.150'),
('93b9fd75-824d-451d-b527-ae4acbf99de4', 'admin2@test.com', '$2a$10$X/Xr3dn9ZljUZ8BzjRejAeHNmvojl81LHqTAdOrLPZ/md/kBLa2U6', 'ADMIN', '2025-09-28 06:21:08.979', '44149bdd-be6c-4fd1-9ee0-cf999ba7993d', 1, '2025-09-28 06:21:08.979'),
('a93a3751-0b7a-4625-b17e-0321ef2ac2d3', 'zafe@gmail.com', '$2a$10$9jkxwj7jAm17KLWJ6me/TO6lRk.NGB5UMJ.6EZfnrzWKf0.lDWx2C', 'EMPLOYE', '2025-10-07 14:50:49.460', 'ab32003e-347e-4704-b2bd-d26a94866df1', 1, '2025-10-07 14:50:49.460'),
('b52d45dc-0e78-484d-b164-45d0442b7fd4', 'vigile@gmail.com', '$2a$10$lmb0RbaBhn.dRZXXtJ8ny.xKFgDIW7NXPKHjyyajq1A8dWqG9of0.', 'VIGILE', '2025-10-03 12:20:03.744', 'ab32003e-347e-4704-b2bd-d26a94866df1', 1, '2025-10-03 12:20:03.744'),
('c1819ebe-6e0e-4c4b-8611-f761c2a27924', 'newsuperadmin@test.com', '$2a$10$mvPa3bsZi6Iz6mcBtBtRgeB9vrs5KPmvfSx78yTBqyAnrZ1/ai6ZK', 'SUPER_ADMIN', '2025-09-28 06:41:03.812', NULL, 1, '2025-09-28 06:41:03.812'),
('d3e63b6f-39a4-4292-9d62-16b4106c2972', 'admin@gmail.com', '$2a$10$7ysh/XtcPARLRQVPLyuQm.tdhW1JO3MvcxyaPuvHaPK3OtXm31hbC', 'SUPER_ADMIN', '2025-09-28 14:32:33.933', NULL, 1, '2025-09-28 14:32:33.933'),
('d7a4af02-e247-4f90-b5f0-831c202949c9', 'abdallah@gmail.com', '$2a$10$Y2XZGQjNcYlGuNoS/lcSzOWiVlwaJYbfKJMHtnjVE8fP/rgm853QO', 'ADMIN', '2025-09-28 18:38:42.436', 'ab32003e-347e-4704-b2bd-d26a94866df1', 1, '2025-09-28 18:38:42.436'),
('d9174354-4217-4d6a-a841-d0d3fda7e005', 'string', '$2a$10$ghc4/s3PwN/NAqFbT1kAM.f3/i4hBqV16iv/Czoo12a.Pf2ahhR1C', 'ADMIN', '2025-09-28 07:01:36.405', '44149bdd-be6c-4fd1-9ee0-cf999ba7993d', 1, '2025-09-28 07:01:36.405'),
('ec043846-0c86-4f2b-9364-f6c724374333', 'caissier@test.com', '$2a$10$N6nxgzNFBQNAq6g5egw4Ue.8KDj/2w1XbqL6ZxhvO7tqiHvS0gil6', 'CAISSIER', '2025-09-28 06:19:01.745', '520b5770-be98-4bb9-9966-ff6d384aef23', 1, '2025-09-28 06:19:01.745'),
('ef267fd9-67ef-43f4-9adb-6665385a5206', 'caissier@gmail.com', '$2a$10$VEAsOBGEZgqgOffg9PiqHuUdVkwNyeHrpMu3Fnr3BPtmQoFD/VEG.', 'CAISSIER', '2025-09-30 22:47:23.437', 'ab32003e-347e-4704-b2bd-d26a94866df1', 1, '2025-09-30 22:47:23.437'),
('efa0468a-5cf3-4f84-a3a5-3b607dc966d1', 'test.employee@example.com', '$2a$10$D/aRSYEFbIL2Uo/7x5XdiOfDPI0K/3TaLmUUhOi4iWFDosvp3kqwO', 'EMPLOYE', '2025-10-03 15:42:17.850', 'ab32003e-347e-4704-b2bd-d26a94866df1', 1, '2025-10-03 15:42:17.850'),
('fa811d52-fdd5-434f-a9ce-861180426b5f', 'aly@breukh.org', '$2a$10$HSf9SDOYK/j.d6Bv07DE4.FnWAz.G143frUkQ/30Ta7OquZnibfyu', 'ADMIN', '2025-10-08 08:45:44.278', '9150e005-7da3-4f03-891a-09a2c217b431', 1, '2025-10-08 08:45:44.278');

-- --------------------------------------------------------

--
-- Structure de la table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('02629e99-491d-4dda-910b-30f80cdcbf13', '344d5c572f566c217916a777efabf3d7a32cbea2031fc33b08bc8fb54f6effd8', '2025-09-28 06:06:12.017', '20250928060611_update_schema', NULL, NULL, '2025-09-28 06:06:11.215', 1),
('207b38a0-d752-49fd-a20e-bf9237c8dd46', 'b0b92d27870189c2bb3e1db9b5176920051c9d8e240af96bea4784108aa54292', '2025-09-30 00:01:33.351', '20250930000133_add_color_to_entreprise', NULL, NULL, '2025-09-30 00:01:33.275', 1),
('265b6109-d59f-464f-8aec-b7107c9936e0', '85bf0c20d6492f7fd8d2a6a0b0ca3df56010e352507e2a3fc807a587dbba23fd', '2025-09-28 06:05:58.718', '20250927130423_migration_1', NULL, NULL, '2025-09-28 06:05:58.684', 1),
('75bb8d95-4fed-425c-8448-7bb567cea9ad', '7d3862a354f54afd71311d837558321a66df95e64a9b9c112149b35fdd08ca4d', '2025-10-03 11:33:38.509', '20251003113338_add_attendance_model', NULL, NULL, '2025-10-03 11:33:38.390', 1),
('79402572-6a37-4a6d-bed3-61f0247baebe', 'ee684b46a9a832719070210c8828fba8891a333d5d0eab81582cdd1e6c78b3d8', '2025-10-01 12:21:46.389', '20251001122146_add_work_fields_to_payslip', NULL, NULL, '2025-10-01 12:21:46.342', 1),
('eaff572f-a502-4ff1-9047-38d274078c02', '5929253cfa98dc61db1fe0c39947c69298b0f3eb724f3edc2e44c3d0ce7cc858', '2025-10-03 11:37:01.382', '20251003113701_add_vigile_role_and_attendance_tracking', NULL, NULL, '2025-10-03 11:37:01.159', 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Attendance`
--
ALTER TABLE `Attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Attendance_employeeId_fkey` (`employeeId`),
  ADD KEY `Attendance_markedById_fkey` (`markedById`);

--
-- Index pour la table `Employee`
--
ALTER TABLE `Employee`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Employee_userId_key` (`userId`),
  ADD KEY `Employee_entrepriseId_fkey` (`entrepriseId`);

--
-- Index pour la table `Entreprise`
--
ALTER TABLE `Entreprise`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Payment`
--
ALTER TABLE `Payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Payment_payslipId_fkey` (`payslipId`),
  ADD KEY `Payment_caissierId_fkey` (`caissierId`);

--
-- Index pour la table `PayrollCycle`
--
ALTER TABLE `PayrollCycle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PayrollCycle_entrepriseId_fkey` (`entrepriseId`);

--
-- Index pour la table `Payslip`
--
ALTER TABLE `Payslip`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Payslip_employeeId_fkey` (`employeeId`),
  ADD KEY `Payslip_cycleId_fkey` (`cycleId`);

--
-- Index pour la table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD KEY `User_entrepriseId_fkey` (`entrepriseId`);

--
-- Index pour la table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Attendance`
--
ALTER TABLE `Attendance`
  ADD CONSTRAINT `Attendance_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `Attendance_markedById_fkey` FOREIGN KEY (`markedById`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `Employee`
--
ALTER TABLE `Employee`
  ADD CONSTRAINT `Employee_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `Employee_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `Payment`
--
ALTER TABLE `Payment`
  ADD CONSTRAINT `Payment_caissierId_fkey` FOREIGN KEY (`caissierId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `Payment_payslipId_fkey` FOREIGN KEY (`payslipId`) REFERENCES `Payslip` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Contraintes pour la table `PayrollCycle`
--
ALTER TABLE `PayrollCycle`
  ADD CONSTRAINT `PayrollCycle_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Contraintes pour la table `Payslip`
--
ALTER TABLE `Payslip`
  ADD CONSTRAINT `Payslip_cycleId_fkey` FOREIGN KEY (`cycleId`) REFERENCES `PayrollCycle` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `Payslip_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Contraintes pour la table `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `User_entrepriseId_fkey` FOREIGN KEY (`entrepriseId`) REFERENCES `Entreprise` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
