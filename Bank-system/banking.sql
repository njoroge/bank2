-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 24, 2018 at 10:44 AM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `banking`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `fname` varchar(40) NOT NULL,
  `lname` varchar(40) NOT NULL,
  `AccNo` varchar(40) NOT NULL,
  `balance` double NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`fname`, `lname`, `AccNo`, `balance`, `date`) VALUES
('EUGENE', 'GHOST', '25355567489', 0, '2018-10-24'),
('jane', 'wind', '54321567890988', 2700, '2018-10-19'),
('Allan', 'smith', '5678904321678', 1200, '2018-10-19'),
('EVELYN', 'WHITE', '7666923345678', 0, '2018-10-24');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(20) NOT NULL,
  `AccNo` varchar(40) NOT NULL,
  `amount` double NOT NULL,
  `balance` double NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `AccNo`, `amount`, `balance`, `date`) VALUES
(5, '54321567890988', 100, 1900, '2018-10-19'),
(6, '5678904321678', 100, 800, '2018-10-19'),
(7, '54321567890988', 100, 2000, '2018-10-19'),
(8, '54321567890988', 100, 2100, '2018-10-22'),
(9, '54321567890988', 100, 2200, '2018-10-22'),
(10, '54321567890988', 100, 2300, '2018-10-22'),
(11, '54321567890988', 100, 2400, '2018-10-22'),
(12, '5678904321678', 100, 900, '2018-10-22'),
(13, '54321567890988', 100, 2500, '2018-10-22'),
(14, '5678904321678', 100, 1000, '2018-10-22'),
(15, '54321567890988', 100, 2600, '2018-10-22'),
(16, '5678904321678', 100, 1100, '2018-10-22'),
(17, '54321567890988', 100, 2700, '2018-10-22'),
(18, '5678904321678', 100, 1200, '2018-10-22');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `fname` varchar(40) NOT NULL,
  `lname` varchar(40) NOT NULL,
  `AccNo` varchar(40) NOT NULL,
  `pin` varchar(100) NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  `is_teller` tinyint(1) NOT NULL,
  `is_clerk` tinyint(1) NOT NULL,
  `is_customer` tinyint(1) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`fname`, `lname`, `AccNo`, `pin`, `is_admin`, `is_teller`, `is_clerk`, `is_customer`, `date`) VALUES
('john', 'doe', '123456789012', '934b535800b1cba8f96a5d72f72f1611', 0, 1, 0, 0, '2018-10-19'),
('james', 'one', '12345678901234', '934b535800b1cba8f96a5d72f72f1611', 1, 0, 0, 0, '2018-10-19'),
('jane', 'one', '12345678904567', '934b535800b1cba8f96a5d72f72f1611', 0, 1, 0, 0, '2018-10-19'),
('john', 'one', '21346789054321', '934b535800b1cba8f96a5d72f72f1611', 0, 0, 1, 0, '2018-10-19'),
('victor', 'juan', '23456780987535', '934b535800b1cba8f96a5d72f72f1611', 0, 1, 0, 0, '2018-10-22'),
('JANE', 'GREEN', '24678901234', '934b535800b1cba8f96a5d72f72f1611', 0, 1, 0, 0, '2018-10-22'),
('EUGENE', 'GHOST', '25355567489', '934b535800b1cba8f96a5d72f72f1611', 0, 0, 0, 1, '2018-10-24'),
('JOHN', 'JUAN', '2578908776756', '934b535800b1cba8f96a5d72f72f1611', 0, 1, 0, 0, '2018-10-22'),
('JOHN', 'WIND', '342456789767', '934b535800b1cba8f96a5d72f72f1611', 0, 0, 1, 0, '2018-10-22'),
('MENDE', 'ROACH', '3445666789934', '934b535800b1cba8f96a5d72f72f1611', 0, 1, 0, 0, '2018-10-24'),
('WILLIAM', 'GREEN', '3456788900212', '934b535800b1cba8f96a5d72f72f1611', 0, 0, 1, 0, '2018-10-22'),
('JAMES', 'GREEN', '348790876543', '934b535800b1cba8f96a5d72f72f1611', 0, 0, 1, 0, '2018-10-23'),
('EUGENE', 'HARVEY', '3663445588991', '934b535800b1cba8f96a5d72f72f1611', 0, 0, 1, 0, '2018-10-24'),
('janet', 'smith', '54309876124556', '934b535800b1cba8f96a5d72f72f1611', 0, 1, 0, 0, '2018-10-22'),
('jane', 'wind', '54321567890988', '2be9bd7a3434f7038ca27d1918de58bd', 0, 0, 0, 1, '2018-10-19'),
('Allan', 'smith', '5678904321678', '934b535800b1cba8f96a5d72f72f1611', 0, 0, 0, 1, '2018-10-19'),
('EVELYN', 'WHITE', '7666923345678', '934b535800b1cba8f96a5d72f72f1611', 0, 0, 0, 1, '2018-10-24'),
('john', 'doe', '78965432134567', '934b535800b1cba8f96a5d72f72f1611', 0, 1, 0, 0, '2018-10-19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD UNIQUE KEY `AccNo` (`AccNo`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`AccNo`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
