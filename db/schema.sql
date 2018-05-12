DROP DATABASE IF EXISTS simulation_db;
CREATE DATABASE simulation_db;
USE simulation_db;

CREATE TABLE users(
    userId INT AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(60) NOT NULL,
    friends TEXT,
    PRIMARY KEY(userId)
);