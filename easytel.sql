-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 28, 2023 at 01:07 AM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `easytel`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
CREATE TABLE IF NOT EXISTS `admins` (
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `first_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` varchar(255) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`username`, `password`, `first_name`, `last_name`) VALUES
('admin1', 'admin1', 'edgar allen', 'poe');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `username` varchar(255) NOT NULL,
  `id` int NOT NULL,
  `checkin` date NOT NULL,
  `checkout` date NOT NULL,
  `adults` int NOT NULL,
  `children` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`username`, `id`, `checkin`, `checkout`, `adults`, `children`) VALUES
('SUPERadmin', 3, '2023-03-05', '2023-03-12', 0, 0),
('SUPERadmin', 2, '2023-03-05', '2023-03-12', 0, 0),
('SUPERadmin', 1, '2023-03-12', '2023-03-19', 0, 0),
('SUPERadmin', 4, '2023-03-05', '2023-03-12', 0, 0),
('SUPERadmin', 5, '2023-03-05', '2023-03-12', 0, 0),
('SUPERadmin', 6, '2023-03-05', '2023-03-12', 0, 0),
('SUPERadmin', 7, '2023-03-05', '2023-03-12', 0, 0),
('SUPERadmin', 8, '2023-03-05', '2023-03-12', 0, 0),
('31042b8f15fae809edb85d3eea94aebb:c5f414032dd0d435168ece5729b8850a', 1, '2023-03-26', '2023-04-01', 3, 2),
('gwyn', 1, '2023-04-01', '2023-04-08', 1, 2);

--
-- Triggers `reservations`
--
DROP TRIGGER IF EXISTS `increment_id`;
DELIMITER $$
CREATE TRIGGER `increment_id` BEFORE INSERT ON `reservations` FOR EACH ROW BEGIN
    DECLARE max_id INT DEFAULT 0;
    SELECT COALESCE(MAX(id), 0) INTO max_id FROM reservations WHERE username = NEW.username;
    SET NEW.id = max_id + 1;
  END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('EiwmRNm6xtINs5GYsLfHROOsfntR6vG-', 1680051957, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"username\":\"4196ddd0058c478fad357fffe3a348ce:418bdeee0cc3c0c1aa0face056924d82\",\"table\":\"users\"}'),
('UHDDE4UPWCIpwZE4lIb_jcU3USh42Pz9', 1680026054, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"username\":\"86b61b8c9e233a10e38de5af54c6200a:41df1619ff0581ade71af1d08232757b\",\"table\":\"users\"}');

-- --------------------------------------------------------

--
-- Table structure for table `userid`
--

DROP TABLE IF EXISTS `userid`;
CREATE TABLE IF NOT EXISTS `userid` (
  `username` varchar(190) NOT NULL,
  `frontid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `backid` varchar(255) NOT NULL,
  `idtype` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `username` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `sex` enum('Male','Female') NOT NULL,
  `age` tinyint NOT NULL,
  `contact_number` int NOT NULL,
  `birthday` date NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `active` bit(1) NOT NULL,
  `hasID` tinyint NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `password`, `first_name`, `last_name`, `sex`, `age`, `contact_number`, `birthday`, `email`, `address`, `active`, `hasID`) VALUES
('user1', '$2b$10$8lkLkakVbmDBK6/Env3d2.AG8Uq1bg1vjVm8p5Z6jaYpbB1w6DtV2', 'gwyn', '4321', 'Male', 32, 1234, '2023-03-14', 'e@mail.com', 'beside you', b'1', 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
