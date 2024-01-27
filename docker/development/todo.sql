CREATE DATABASE IF NOT EXISTS todo;

CREATE TABLE IF NOT EXISTS `todo`.`todos` (
    id INT NOT NULL AUTO_INCREMENT,
    todo VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL,
    urgency INT NOT NULL,
    is_done INT DEFAULT 0,
    is_deleted INT DEFAULT 0,
    PRIMARY KEY(id)
);

CREATE USER IF NOT EXISTS chenzadik;

GRANT ALL PRIVILEGES ON todo.* TO 'chenzadik'@'localhost';

FLUSH PRIVILEGES;