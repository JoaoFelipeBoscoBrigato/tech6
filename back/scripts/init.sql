-- Script de inicialização do banco de dados
-- Este arquivo é executado automaticamente quando o container MySQL é criado

-- Garantir que o banco existe
CREATE DATABASE IF NOT EXISTS tech5br;
USE tech5br;

-- Configurações de charset
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Aqui você pode adicionar queries de inicialização se necessário
-- Por exemplo, inserir dados padrão, criar índices, etc.

SET FOREIGN_KEY_CHECKS = 1; 