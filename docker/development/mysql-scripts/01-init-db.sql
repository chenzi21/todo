CREATE DATABASE IF NOT EXISTS todo;

SET foreign_key_checks = 0;
DROP TABLE IF EXISTS `todo`.`todos`, `todo`.`users`, `todo`.`sessions`;
SET foreign_key_checks = 1;