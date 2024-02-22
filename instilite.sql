-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 16, 2024 at 06:41 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `instilite`
--

-- --------------------------------------------------------

--
-- Table structure for table `eventsdetails`
--

CREATE TABLE `eventsdetails` (
`event_name` varchar(40) NOT NULL,
`event_venue` varchar(40) DEFAULT NULL,
`event_desc` varchar(100) DEFAULT NULL,
`event_posted_date` date NOT NULL DEFAULT current_timestamp(),
`user_id` varchar(30) DEFAULT NULL,
`event_date` date DEFAULT NULL,
`event_time` time(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teamsdetails`
--

CREATE TABLE `teamsdetails` (
`team_id` varchar(40) NOT NULL,
`team_name` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usercreds`
--

CREATE TABLE `usercreds` (
`user_id` varchar(40) NOT NULL,
`user_name` varchar(40) NOT NULL,
`user_phone` bigint(20) DEFAULT NULL,
`user_password` varchar(20) NOT NULL,
`user_role` varchar(10) DEFAULT '"student"',
`user_access_token` varchar(10) DEFAULT '"denied"'
`user_profile_desc` varchar(1000),
`user_linkedin` varchar(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `eventsdetails`
--
ALTER TABLE `eventsdetails`
ADD PRIMARY KEY (`event_name`),
ADD KEY `user_id_FK` (`user_id`);

--
-- Indexes for table `teamsdetails`
--
ALTER TABLE `teamsdetails`
ADD KEY `team_id_FK` (`team_id`),
ADD KEY `team_name_FK` (`team_name`);

--
-- Indexes for table `usercreds`
--
ALTER TABLE `usercreds`
ADD PRIMARY KEY (`user_id`),
ADD UNIQUE KEY `user_name` (`user_name`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `eventsdetails`
--
ALTER TABLE `eventsdetails`
ADD CONSTRAINT `user_id_FK` FOREIGN KEY (`user_id`) REFERENCES `usercreds` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `teamsdetails`
--
ALTER TABLE `teamsdetails`
ADD CONSTRAINT `team_id_FK` FOREIGN KEY (`team_id`) REFERENCES `usercreds` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `team_name_FK` FOREIGN KEY (`team_name`) REFERENCES `usercreds` (`user_name`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
