-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 29, 2023 at 04:23 AM
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
-- Table structure for table `currentuser`
--

DROP TABLE IF EXISTS `currentuser`;
CREATE TABLE IF NOT EXISTS `currentuser` (
  `username` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `currentuser`
--

INSERT INTO `currentuser` (`username`) VALUES
('user1');

-- --------------------------------------------------------

--
-- Table structure for table `guestreservations`
--

DROP TABLE IF EXISTS `guestreservations`;
CREATE TABLE IF NOT EXISTS `guestreservations` (
  `username` varchar(255) NOT NULL,
  `id` int NOT NULL,
  `checkin` date DEFAULT NULL,
  `checkout` date DEFAULT NULL,
  `bookingstatus` varchar(255) NOT NULL,
  `room` int NOT NULL,
  `adults` int NOT NULL,
  `children` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `guestreservations`
--

INSERT INTO `guestreservations` (`username`, `id`, `checkin`, `checkout`, `bookingstatus`, `room`, `adults`, `children`) VALUES
('Alberto', 0, '2023-04-12', '2023-03-29', 'checked-in', 6, 2, 3);

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `username` varchar(255) NOT NULL,
  `id` int NOT NULL,
  `checkin` date DEFAULT NULL,
  `checkout` date DEFAULT NULL,
  `bookingstatus` varchar(255) NOT NULL,
  `room` int NOT NULL,
  `adults` int NOT NULL,
  `children` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`username`, `id`, `checkin`, `checkout`, `bookingstatus`, `room`, `adults`, `children`) VALUES
('SUPERadmin', 3, '2023-03-05', '2023-03-12', '', 0, 0, 0),
('SUPERadmin', 2, '2023-03-05', '2023-03-12', '', 0, 0, 0),
('SUPERadmin', 1, '2023-03-12', '2023-03-19', '', 0, 0, 0),
('SUPERadmin', 4, '2023-03-05', '2023-03-12', '', 0, 0, 0),
('SUPERadmin', 5, '2023-03-05', '2023-03-12', '', 0, 0, 0),
('SUPERadmin', 6, '2023-03-05', '2023-03-12', '', 0, 0, 0),
('SUPERadmin', 7, '2023-03-05', '2023-03-12', '', 0, 0, 0),
('SUPERadmin', 8, '2023-03-05', '2023-03-12', '', 0, 0, 0),
('31042b8f15fae809edb85d3eea94aebb:c5f414032dd0d435168ece5729b8850a', 1, '2023-03-26', '2023-04-01', '', 0, 3, 2),
('gwyn', 1, '2023-04-01', '2023-04-08', '', 0, 1, 2),
('beh', 1, '2023-03-28', '2023-03-29', '', 0, 1, 0),
('user1', 1, '2023-03-23', '2023-05-03', '', 0, 1, 2),
('user1', 2, '2023-04-08', '2023-04-13', 'confirmed', 0, 3, 5),
('user1', 3, '2023-03-11', '2023-03-18', 'confirmed', 0, 12, 34),
('user1', 4, '2023-03-31', '2023-03-29', 'checked-out', 6, 2, 5),
('user1', 5, '2023-03-24', '2023-03-21', 'cancelled', 15, 6, 9),
('gwon', 1, '2023-04-15', '2023-04-08', 'checked-in', 74, 2, 0),
('SUPERadmin', 9, '2023-03-05', '2023-03-12', '', 0, 0, 0),
('SUPERadmin', 10, '2023-03-05', '2023-03-12', '', 0, 0, 0),
('SUPERadmin', 11, '2023-03-12', '2023-03-19', '', 0, 0, 0),
('SUPERadmin', 12, '2023-03-05', '2023-03-12', '', 0, 0, 0),
('SUPERadmin', 13, '2023-03-05', '2023-03-12', '', 0, 0, 0),
('SUPERadmin', 14, '2023-03-05', '2023-03-12', '', 0, 0, 0),
('SUPERadmin', 15, '2023-03-05', '2023-03-12', '', 0, 0, 0),
('SUPERadmin', 16, '2023-03-05', '2023-03-12', '', 0, 0, 0),
('31042b8f15fae809edb85d3eea94aebb:c5f414032dd0d435168ece5729b8850a', 2, '2023-03-26', '2023-04-01', '', 0, 3, 2),
('gwyn', 2, '2023-04-01', '2023-04-08', '', 0, 1, 2),
('beh', 2, '2023-03-28', '2023-03-29', '', 0, 1, 0),
('user1', 6, '2023-03-23', '2023-05-03', '', 0, 1, 2),
('user1', 7, '2023-04-08', '2023-04-13', 'confirmed', 0, 3, 5),
('user1', 8, '2023-03-11', '2023-03-18', 'confirmed', 0, 12, 34),
('user1', 9, '2023-03-31', '2023-03-29', 'checked-out', 6, 2, 5),
('user1', 10, '2023-03-24', '2023-03-21', 'cancelled', 15, 6, 9),
('gwon', 2, '2023-04-15', '2023-04-08', 'checked-in', 74, 2, 0),
('gwyn', 3, '2023-03-01', '2023-03-25', 'confirmed', 0, 1, 0);

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
('IBdfgFbyGEXAmOC5YOgfBE2IW3eHtA7e', 1680149120, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"username\":\"953ee69025636ca253e28f3456e1de4e:efa6aaee557978f1f347a1c5389ffe8b\",\"table\":\"users\"}'),
('h2F4RtcKiGLxHHp6ENuPVskhKsAmByFp', 1680142523, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"username\":\"a3701e8a51bda8530110b12afbd188e5:003b73a3553ccf50487eaea1f362488c\",\"table\":\"admins\"}'),
('lR0kv_tzZ34LECF-6xYUgP_8Inq3HCbh', 1680114453, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"username\":\"2e810240597fd25b1d5e4e3ea4adc8bf:8f31e011a5279c10570ea07805d066b4\",\"table\":\"users\"}'),
('x4oED5sLUkLcaTWmIcBp6KD9ocV06jTr', 1680114446, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"username\":\"f0153a82d6c33579aada939c617c0a7a:e674647c0b867db337e7880298a2d99d\",\"table\":\"admins\"}');

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

--
-- Dumping data for table `userid`
--

INSERT INTO `userid` (`username`, `frontid`, `backid`, `idtype`) VALUES
('user1', 'user1-front-1679967487576.jpg', 'user1-back-1679967487577.jpg', 'Lisensya');

-- --------------------------------------------------------

--
-- Table structure for table `userpayment`
--

DROP TABLE IF EXISTS `userpayment`;
CREATE TABLE IF NOT EXISTS `userpayment` (
  `username` varchar(255) NOT NULL,
  `method` varchar(255) NOT NULL,
  `number` varchar(255) NOT NULL
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
  `active` tinyint(1) NOT NULL,
  `hasID` tinyint NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `password`, `first_name`, `last_name`, `sex`, `age`, `contact_number`, `birthday`, `email`, `address`, `active`, `hasID`) VALUES
('beh', '$2b$10$m9n7UBBNAoIRQatpDkwL1.r2ATsHkCjALgqf/1dgl0ACdK2uJOWZW', 'beh', 'tlog', 'Male', 69, 1234567890, '2023-03-21', 'b@mail.com', '1234', 0, 0),
('gwyn', '$2b$10$be/1CwxK0zFa/6fsrowz2eDPwFj5OMWp94cpUuGKRyo6HktFjmjLy', 'Ethyl', 'Alcohol', 'Male', 32, 1234566, '2023-03-22', 'e@mail.com', '[\"Baguio\",\"Gcash\"]', 1, 0),
('SUPERadmin', '$2b$10$2/YxZTCe9geLD2ywaVTLtOyWWdbrGc6Ya1X2wKtYcqnY4MGkN2Auu', 'gwyn', 'sadfsf', 'Male', 127, 123556, '2023-03-23', '412321', 'asfdaf', 1, 0),
('user1', '$2b$10$8lkLkakVbmDBK6/Env3d2.AG8Uq1bg1vjVm8p5Z6jaYpbB1w6DtV2', 'gwyn', '4321', 'Male', 32, 1234, '2023-03-14', 'e@mail.com', 'beside you', 1, 1),
('user2', '$2b$10$ZX.H.sZzyXQoX40nHnpVzeZOgKSlc.qpP8lbVxWiX6mXodLtQmf0W', 'chimney', 'swift', 'Male', 32, 123414, '2023-02-28', '6541231', '123134', 1, 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
