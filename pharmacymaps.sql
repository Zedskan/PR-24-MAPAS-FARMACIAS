CREATE DATABASE  IF NOT EXISTS `pharmacymaps` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pharmacymaps`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: pharmacymaps
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `controlledmedications`
--

DROP TABLE IF EXISTS `controlledmedications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `controlledmedications` (
  `Idcontrol` int NOT NULL AUTO_INCREMENT,
  `TypeMedicine` varchar(255) NOT NULL,
  `Idpharmacy` int NOT NULL,
  PRIMARY KEY (`Idcontrol`),
  KEY `Idpharmacy` (`Idpharmacy`),
  CONSTRAINT `controlledmedications_ibfk_1` FOREIGN KEY (`Idpharmacy`) REFERENCES `pharmacy` (`Idpharmacy`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `controlledmedications`
--

LOCK TABLES `controlledmedications` WRITE;
/*!40000 ALTER TABLE `controlledmedications` DISABLE KEYS */;
/*!40000 ALTER TABLE `controlledmedications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ownerpharmacy`
--

DROP TABLE IF EXISTS `ownerpharmacy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ownerpharmacy` (
  `Idowner` int NOT NULL AUTO_INCREMENT,
  `OwnerName` varchar(255) NOT NULL,
  `NIT` bigint NOT NULL,
  PRIMARY KEY (`Idowner`),
  UNIQUE KEY `NIT` (`NIT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ownerpharmacy`
--

LOCK TABLES `ownerpharmacy` WRITE;
/*!40000 ALTER TABLE `ownerpharmacy` DISABLE KEYS */;
/*!40000 ALTER TABLE `ownerpharmacy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pharmacy`
--

DROP TABLE IF EXISTS `pharmacy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pharmacy` (
  `Idpharmacy` int NOT NULL AUTO_INCREMENT,
  `pharmacyName` varchar(255) NOT NULL,
  `sector` varchar(100) NOT NULL,
  `typePharmacy` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `zone` varchar(100) NOT NULL,
  `latitude` decimal(10,7) NOT NULL,
  `longitude` decimal(10,7) NOT NULL,
  `zone_code` varchar(50) DEFAULT NULL,
  `municipality` varchar(100) NOT NULL,
  `health_network` varchar(100) NOT NULL,
  `openingTime` time NOT NULL,
  `closingTime` time NOT NULL,
  `referenceNumber` bigint DEFAULT NULL,
  `Idowner` int DEFAULT NULL,
  PRIMARY KEY (`Idpharmacy`),
  KEY `Idowner` (`Idowner`),
  CONSTRAINT `pharmacy_ibfk_1` FOREIGN KEY (`Idowner`) REFERENCES `ownerpharmacy` (`Idowner`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pharmacy`
--

LOCK TABLES `pharmacy` WRITE;
/*!40000 ALTER TABLE `pharmacy` DISABLE KEYS */;
INSERT INTO `pharmacy` VALUES (1,'12 DE DICIEMBRE','Privados','Farmacia Privada','AV.ENCAÑADA S/N ACERA OESTE ENRE C. ALONZO YAÑEZ','PUCARA GRANDE',-17.4573660,-66.1570680,NULL,'Cochabamba','CERCADO','08:00:00','16:00:00',77365876,NULL),(2,'12 DE DICIEMBRE SUCURSAL I','Privados','Farmacia Privada','Calle San Juan s/n  Esquina  Virgen de Guadalupe','Lacma',-17.3934220,-66.1562020,NULL,'Cochabamba','CERCADO','08:00:00','16:00:00',76449377,NULL),(3,'12RICH','Privados','Farmacia Privada','AV. SANTA CRUZ N° 2185 ENTRE AV. CIRCUNVALACIÓN Y AV. SIMON BOLIVAR','QUERU QUERU',-17.3668410,-66.1564170,NULL,'Cochabamba','CERCADO','08:00:00','16:00:00',76433357,NULL),(4,'18 DE MARZO','Privados','Farmacia Privada','CALLE LADISLAO CABRERA N| 120 ENTRE AV. AYACUCHO Y AV. BELZU','CENTRAL',-17.3975780,-66.1574890,NULL,'Cochabamba','CERCADO','08:00:00','16:00:00',77940770,NULL),(5,'18 DE MARZO SUCURSAL I','Privados','Farmacia Privada','AV. REPUBLICA N° 1530 ENTRE AV. GUAYARAMERINY Y AV. ALEMANA','SAN MIGUEL',-17.4065980,-66.1510360,NULL,'Cochabamba','CERCADO','08:00:00','16:00:00',77940770,NULL),(6,'20 DE JULIO','Privados','Farmacia Privada','AV. AMERICA N° 1235 ENTRE CALLE CORDOVA Y CALLE BELGRANO','VILLA BOLIVAR',-17.4084460,-66.1505890,NULL,'Cochabamba','CERCADO','08:00:00','16:00:00',76433358,NULL),(7,'25 DE MAYO','Privados','Farmacia Privada','CALLE SUCRE N° 2400 ENTRE AV. LANDAETA Y AV. BOLIVAR','CENTRAL',-17.4123450,-66.1523450,NULL,'Cochabamba','CERCADO','08:00:00','16:00:00',77940771,NULL),(8,'28 DE OCTUBRE','Privados','Farmacia Privada','AV. SIMON BOLIVAR N° 123 ENTRE CALLE URQUIDI Y AV. ELOY SALMON','SANTA ANA',-17.4144580,-66.1535670,NULL,'Cochabamba','CERCADO','08:00:00','16:00:00',77940772,NULL),(9,'30 DE AGOSTO','Privados','Farmacia Privada','CALLE AYACUCHO N° 345 ENTRE AV. REPUBLICA Y AV. GUAYARAMERIN','CENTRAL',-17.4168990,-66.1546890,NULL,'Cochabamba','CERCADO','08:00:00','16:00:00',77940773,NULL),(10,'1 DE MAYO','Privados','Farmacia Privada','AV. AMERICA N° 567 ENTRE AV. LANDAETA Y AV. BOLIVAR','SAN ANTONIO',-17.4185790,-66.1567890,NULL,'Cochabamba','CERCADO','08:00:00','16:00:00',76433359,NULL);
/*!40000 ALTER TABLE `pharmacy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Iduser` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  PRIMARY KEY (`Iduser`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `users_chk_1` CHECK ((`role` in (_utf8mb4'admin',_utf8mb4'owner')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'pharmacymaps'
--

--
-- Dumping routines for database 'pharmacymaps'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-12 19:17:55
