-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 23, 2023 at 12:44 AM
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
  `checkout` date NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`username`, `id`, `checkin`, `checkout`) VALUES
('SUPERadmin', 3, '2023-03-05', '2023-03-12'),
('SUPERadmin', 2, '2023-03-05', '2023-03-12'),
('SUPERadmin', 1, '2023-03-12', '2023-03-19'),
('SUPERadmin', 4, '2023-03-05', '2023-03-12'),
('SUPERadmin', 5, '2023-03-05', '2023-03-12'),
('SUPERadmin', 6, '2023-03-05', '2023-03-12'),
('SUPERadmin', 7, '2023-03-05', '2023-03-12'),
('SUPERadmin', 8, '2023-03-05', '2023-03-12');

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

-- --------------------------------------------------------

--
-- Table structure for table `userid`
--

DROP TABLE IF EXISTS `userid`;
CREATE TABLE IF NOT EXISTS `userid` (
  `username` varchar(190) NOT NULL,
  `frontname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `backimage` int NOT NULL,
  `imagetype` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
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
('', '$2b$10$ZoxJOSCBgr3eespte/OXoOOT1TVcHE.1zULuVa3n.6nUNS7SSq.y2', 'Allen', 'Gram', 'Male', 15, 2023, '0000-00-00', 'b@mail.com', '', b'1', 0),
('1234', '$2b$10$CmkbarMquAqibvVcgTRaAuZrlnTFAYnQe6kfFIed.rpu7V5OfF1pe', 'Taner', 'Wagner', 'Male', 3, 2020, '0000-00-00', '2323', '23', b'1', 0),
('alfonso', '$2b$10$EDBYw9GHSSMxhFqVG.R0ceb5mE0Rm7YzfUAO2FlJwjrA4dxpYJXeO', 'Easy', 'Tel', 'Female', 1, 2023, '0000-00-00', 'a@mail.com', '56778', b'1', 0),
('angel', '$2b$10$DXJ64/zrwhuQRSXiB8QRS.4dV3KReTRflckXVAPZkWSCB8PG4ebsu', 'Angel', 'Dipay', 'Female', 32, 2023, '0000-00-00', 'q@mail.com', 'Pangasinan', b'1', 0),
('ballpen', '$2b$10$te82YINDDpCgh/zH1okthOtQ8wV2ZZ5e9KqpTiC/cs5pJSS9G1wSe', 'Faber', 'Castle', 'Male', 98, 2023, '0000-00-00', 'faber@castle.com', 'China', b'1', 0),
('gwen', '$2b$10$cF/.pZmcBiU9XO6MZrkAvO9N6wyORLiV4bQiyJFAMhL3ZUrh7Y1xm', 'Gwyn', 'D', 'Male', 32, 2023, '0000-00-00', 'd@mail.com', '546791, Baguio City', b'1', 0),
('gwyn', '$2b$10$Lc20ACypqNYUcEes9rfd..PzhYRS20yTtETv98GPnydpgbxj54Gdi', 'gwyn', 'd', 'Male', 127, 2023, '0000-00-00', 'eqd', 'ae2', b'1', 0),
('johndoe', '$2b$10$pIEkZwp4Vus2EBIAiX5ETORIW3z2nTCnj3RxC5L8pg9vHYja4xg32', 'John', 'Doe', 'Female', 32, 2023, '0000-00-00', 'john@doe.com', 'Farm', b'1', 0),
('san', '$2b$10$bAg2u7FHOKm/YDv31Xa54uImFd49yRlGORKjLfa8q5Fr82XTj1h6i', 'San', 'Miguel', 'Female', 32, 0, '0000-00-00', 'reklxjflksj@maklfmlsaf', 'lkjlkj', b'1', 0),
('SUPERadmin', '$2b$10$x4lHYKW7jLuO1nKKfx6hIuJbB./xS28cn98rSCBTSnb5B/pbfRDTG', 'Easy', 'Tel', 'Female', 1, 2023, '0000-00-00', 'e@mail.com', 'in the computer', b'1', 0),
('tito', '$2b$10$0RkZzLV2g1p97JgrDqL.wO0qPaQrgyVfLI0ut9BqEXolyEVwd8ISe', 'Tito', 'boy', 'Male', 76, 2147483647, '2014-05-21', 'tito@boy.com', 'MNL', b'1', 0),
('uber', '$2b$10$mA.LosXVx/1cX/ms.JzJpuaDuCJKhPAjP7r6chNMsLgRAkNAs2v2e', 'Arnold', 'Danger', 'Male', 54, 987609876, '2000-11-15', 'danger@zone.com', 'USA', b'1', 0),
('user1', '$2b$10$bMuyXR925bIVDYdIo2wG.e5f09j1z5x12kv/hSLHzHuDHuflpIoei', '', '', 'Male', 0, 0, '0000-00-00', '', '', b'1', 0),
('user11', '$2b$10$LVzAqfKrPtQ0wCXoCbxCCecFgYo8rQjs9B0SWzbs.ULAI0Hf4eMg6', 'Alberto', '', 'Male', 0, 0, '0000-00-00', '', '', b'1', 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
