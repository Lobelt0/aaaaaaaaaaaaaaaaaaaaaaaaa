CREATE DATABASE  IF NOT EXISTS `libreria` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish2_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `libreria`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: libreria
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `inventario_libros`
--

DROP TABLE IF EXISTS `inventario_libros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario_libros` (
  `id_inventario` int NOT NULL AUTO_INCREMENT,
  `libro_id` int NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_inventario`),
  KEY `libro_id` (`libro_id`),
  CONSTRAINT `inventario_libros_ibfk_1` FOREIGN KEY (`libro_id`) REFERENCES `libros` (`id_libro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario_libros`
--

/*!40000 ALTER TABLE `inventario_libros` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventario_libros` ENABLE KEYS */;

--
-- Table structure for table `libros`
--

DROP TABLE IF EXISTS `libros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `libros` (
  `id_libro` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `categoria` varchar(100) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_spanish2_ci,
  `precio` decimal(10,2) DEFAULT NULL,
  `paginas_por_libro` int NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_libro`),
  KEY `paginas_por_libro` (`paginas_por_libro`),
  CONSTRAINT `libros_ibfk_1` FOREIGN KEY (`paginas_por_libro`) REFERENCES `papel` (`paginas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `libros`
--

/*!40000 ALTER TABLE `libros` DISABLE KEYS */;
/*!40000 ALTER TABLE `libros` ENABLE KEYS */;

--
-- Table structure for table `movimientos_libros`
--

DROP TABLE IF EXISTS `movimientos_libros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos_libros` (
  `id_mov_libro` int NOT NULL AUTO_INCREMENT,
  `inventario_id` int NOT NULL,
  `tipo` enum('entrada','salida','venta','ajuste') COLLATE utf8mb4_spanish2_ci NOT NULL,
  `cantidad` int NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `fecha_movimiento` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `observaciones` text COLLATE utf8mb4_spanish2_ci,
  PRIMARY KEY (`id_mov_libro`),
  KEY `inventario_id` (`inventario_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `movimientos_libros_ibfk_1` FOREIGN KEY (`inventario_id`) REFERENCES `inventario_libros` (`id_inventario`),
  CONSTRAINT `movimientos_libros_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimientos_libros`
--

/*!40000 ALTER TABLE `movimientos_libros` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimientos_libros` ENABLE KEYS */;

--
-- Table structure for table `papel`
--

DROP TABLE IF EXISTS `papel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `papel` (
  `paginas` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `stock_paginas` int NOT NULL,
  PRIMARY KEY (`paginas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `papel`
--

/*!40000 ALTER TABLE `papel` DISABLE KEYS */;
/*!40000 ALTER TABLE `papel` ENABLE KEYS */;

--
-- Table structure for table `puntos_venta`
--

DROP TABLE IF EXISTS `puntos_venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puntos_venta` (
  `id_punto_venta` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `ubicacion` varchar(150) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `tipo` enum('tienda','metro','online') COLLATE utf8mb4_spanish2_ci NOT NULL,
  PRIMARY KEY (`id_punto_venta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntos_venta`
--

/*!40000 ALTER TABLE `puntos_venta` DISABLE KEYS */;
/*!40000 ALTER TABLE `puntos_venta` ENABLE KEYS */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_spanish2_ci DEFAULT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_spanish2_ci NOT NULL,
  `rol` enum('admin','vendedor') COLLATE utf8mb4_spanish2_ci NOT NULL DEFAULT 'vendedor',
  `punto_venta_id` int DEFAULT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  KEY `punto_venta_id` (`punto_venta_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`punto_venta_id`) REFERENCES `puntos_venta` (`id_punto_venta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-08 14:11:31
